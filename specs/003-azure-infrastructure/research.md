# Azure Infrastructure Research & Decisions

## Key Architectural Decisions

### 1. Azure Functions Consumption Plan vs App Service Plan

**Decision**: Use **Consumption Plan (Y1)** for Azure Functions

**Rationale**:
- Truly serverless (no dedicated resources, runs on Azure backbone)
- Pay per execution (~$0.20 per million executions)
- 1 million free executions per month
- Auto-scales to zero when idle
- Perfect for low-to-moderate traffic (~1000 submissions/month = essentially free)

**Trade-offs**:
- ✅ Cost: ~$0-2/month vs ~$13/month (B1 App Service)
- ✅ Scaling: Automatic, no configuration needed
- ⚠️ Cold starts: ~3 seconds (acceptable for form submission)
- ⚠️ No VNet integration (not needed for our use case)
- ⚠️ 10 minute execution limit (plenty for API calls)

**Alternative Considered**: 
- **Dedicated App Service Plan (B1)**: $13/month, always-on, no cold starts
  - Rejected: Overkill for current needs, 5x cost increase
- **Premium Plan (EP1)**: $150/month, always warm, VNet support
  - Rejected: Way too expensive for dev environment

**References**:
- [Azure Functions Hosting Plans](https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale)
- [Consumption Plan Pricing](https://azure.microsoft.com/pricing/details/functions/)

---

### 2. Separate Storage Accounts (Main vs Functions)

**Decision**: Use **two separate storage accounts**

**Rationale**:
1. **Isolation**: Function App state/logs separate from application data
2. **Security**: Different access policies for each
3. **Performance**: Function App storage optimized for high IOPS
4. **Best Practice**: Microsoft recommendation

**Configuration**:
- **Main Storage** (`{project}{env}sa`): Event images, public blob access
- **Functions Storage** (`{project}{env}fn`): Function runtime state, logs, bindings

**Cost Impact**: Minimal (~$0.50/month additional)

**Alternative Considered**:
- Single storage account with separate containers
- Rejected: Increases blast radius, harder to manage permissions

**References**:
- [Function App Storage Requirements](https://learn.microsoft.com/azure/azure-functions/storage-considerations)

---

### 3. SQL Database Tier Selection

**Decision**: **Basic tier for dev**, configurable for production

**Rationale**:
- Basic tier: 5 DTUs, 2GB storage, $4.99/month
- Sufficient for development and low-traffic testing
- Easy to scale up to S1/P1 for production via terraform variable

**Performance Expectations**:
| Tier | DTU | Cost/Month | Use Case |
|------|-----|------------|----------|
| Basic | 5 | $4.99 | Dev, <100 requests/hour |
| S0 | 10 | $15 | Staging, <1000 requests/hour |
| S1 | 20 | $30 | Production, <5000 requests/hour |
| P1 | 125 | $465 | High-traffic production |

**Scaling Strategy**:
1. Start with Basic for dev
2. Monitor DTU usage in Azure Portal
3. Scale up when DTU consistently > 80%
4. Update `sql_db_sku` variable and `terraform apply`

**References**:
- [SQL Database Pricing](https://azure.microsoft.com/pricing/details/sql-database/)
- [DTU vs vCore Models](https://learn.microsoft.com/azure/azure-sql/database/purchasing-models)

---

### 4. Key Vault for Secrets Management

**Decision**: Use **Azure Key Vault** with managed identity

**Rationale**:
- Industry best practice for secrets management
- No credentials in code or configuration
- Centralized secret rotation
- Audit logging for compliance
- Function App uses managed identity (no auth credentials needed)

**Implementation**:
```hcl
# In Function App settings:
SQL_PASSWORD = "@Microsoft.KeyVault(SecretUri=${vault_secret_uri})"
```

**Alternative Considered**:
- App Settings only (no Key Vault)
- Rejected: Less secure, harder to rotate, exposed in logs

**Access Pattern**:
1. Function App → Managed Identity → Key Vault → Secret
2. Developer → Azure CLI → Key Vault → Secret (for local dev)

**Cost**: ~$0.03/month (first 10K operations free)

**References**:
- [Key Vault Best Practices](https://learn.microsoft.com/azure/key-vault/general/best-practices)
- [Managed Identity Tutorial](https://learn.microsoft.com/azure/app-service/overview-managed-identity)

---

### 5. Blob Storage Public Access

**Decision**: **Public blob access** for images container

**Rationale**:
- Images need to be publicly viewable (displayed on website)
- Blob-level access (not container listing)
- Images are non-sensitive (event promotional photos)
- Simplifies frontend implementation (direct URLs)

**Security Considerations**:
- ✅ CORS restricts upload origins
- ✅ No container listing allowed
- ✅ Image URLs are non-guessable (UUID-based)
- ⚠️ Anyone with URL can view image (intentional)

**Alternative Considered**:
- SAS tokens for image access
- Rejected: Adds complexity, not needed for public images

**Configuration**:
```hcl
container_access_type = "blob"  # Not "container" (would allow listing)
```

**References**:
- [Blob Storage Security](https://learn.microsoft.com/azure/storage/blobs/security-recommendations)

---

### 6. SQL Server Firewall Rules

**Decision**: Allow **Azure services** + **optional developer IP**

**Rationale**:
- Azure services (0.0.0.0 rule): Required for Function App to connect
- Developer IP: Optional, for local development and debugging
- Restricts all other traffic

**Configuration**:
```hcl
# Required: Allow Function App
resource "azurerm_mssql_firewall_rule" "allow_azure_services" {
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# Optional: Allow developer
resource "azurerm_mssql_firewall_rule" "allow_dev_ip" {
  count = var.dev_ip_address != "" ? 1 : 0
  start_ip_address = var.dev_ip_address
  end_ip_address   = var.dev_ip_address
}
```

**Security Notes**:
- 0.0.0.0 rule is standard for Azure-to-Azure communication
- Does NOT open to public internet
- Developer must provide their public IP explicitly

**Finding Your IP**:
```bash
curl ifconfig.me
# or visit https://whatismyipaddress.com/
```

**References**:
- [SQL Server Firewall Rules](https://learn.microsoft.com/azure/azure-sql/database/firewall-configure)

---

### 7. Terraform State Management

**Decision**: **Local state** for initial setup, recommend **remote state** for teams

**Rationale**:
- Local state (`terraform.tfstate` file): Simple, good for solo dev
- Remote state (Azure Storage): Required for team collaboration, state locking

**Current Implementation**: Local state (simpler for getting started)

**Upgrade Path** (when ready):
```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfstate"
    container_name       = "tfstate"
    key                  = "eventure.terraform.tfstate"
  }
}
```

**Recommendations**:
- ✅ Solo dev: Local state, backup `terraform.tfstate` to Git LFS or cloud
- ✅ Team: Remote state in Azure Storage with state locking
- ⚠️ Never commit `.tfstate` to Git (contains secrets)

**References**:
- [Terraform Remote State](https://developer.hashicorp.com/terraform/language/state/remote)
- [Azure Backend Configuration](https://developer.hashicorp.com/terraform/language/settings/backends/azurerm)

---

### 8. CORS Configuration

**Decision**: **Explicit allowed origins** list (no wildcards in production)

**Rationale**:
- Security: Prevents unauthorized domains from making requests
- Flexibility: Different origins for dev/staging/prod
- Simple: Managed via Terraform variable

**Configuration**:
```hcl
variable "allowed_origins" {
  default = [
    "http://localhost:3000",      # Local dev
    "http://localhost:3001",      # Alternative port
    # Add production domain when deployed
  ]
}
```

**CORS Applied To**:
1. Blob Storage (image uploads)
2. Function App (API requests)

**Security Best Practice**:
- ❌ Never use `*` wildcard in production
- ✅ List specific domains
- ✅ Update list when deploying new environments

**References**:
- [Azure Storage CORS](https://learn.microsoft.com/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services)

---

### 9. Resource Naming Strategy

**Decision**: Use **existing project naming convention**

**Format**: `{resource-type}-{project}-{environment}`

**Examples**:
- Resource Group: `rg-eventure-webapp-dev` (existing)
- SQL Server: `sql-eventure-dev`
- Function App: `func-eventure-dev`

**Special Cases**:
- Storage accounts: `{project}{env}{type}` (no hyphens, lowercase only)
  - Main: `eventuredevsa`
  - Functions: `eventuredevfn`

**Rationale**:
- Clear environment separation (avoid prod/dev confusion)
- Easy to identify resources in Azure Portal
- Consistent with Azure naming conventions
- Supports multiple environments in same subscription

**Constraints**:
- Storage account names: 3-24 chars, lowercase, alphanumeric only, globally unique
- Most resources: Hyphens allowed, case-insensitive

**References**:
- [Azure Naming Conventions](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming)

---

### 10. Auto-Generated vs User-Provided Passwords

**Decision**: **Auto-generate SQL password** by default, allow override

**Rationale**:
- Security: 32-char random password is more secure than user-chosen
- Convenience: No need to think of strong password
- Flexibility: Can override for specific requirements (e.g., password policy)

**Implementation**:
```hcl
resource "random_password" "sql_admin" {
  count   = var.sql_admin_password == "" ? 1 : 0
  length  = 32
  special = true
}

# Use user-provided if set, otherwise auto-generated
local.sql_password = var.sql_admin_password != "" ? 
                     var.sql_admin_password : 
                     random_password.sql_admin[0].result
```

**Best Practice**:
- Leave `sql_admin_password = ""` in tfvars (auto-generate)
- Store generated password in Key Vault (done automatically)
- Retrieve via: `terraform output sql_admin_password`

**References**:
- [Terraform Random Provider](https://registry.terraform.io/providers/hashicorp/random/latest/docs)

---

## Technology Evaluation Summary

### Why Terraform over Alternatives?

**Alternatives Considered**:
1. **Azure CLI Scripts**: Imperative, harder to maintain
2. **ARM Templates**: Verbose JSON, limited tooling
3. **Bicep**: Newer, less ecosystem support
4. **Pulumi**: Good, but requires programming language expertise

**Why Terraform**:
- ✅ Declarative (describe desired state)
- ✅ Mature ecosystem, extensive documentation
- ✅ Provider supports all Azure resources
- ✅ State management built-in
- ✅ Preview changes before applying
- ✅ Cross-cloud (if ever need AWS/GCP)
- ✅ Large community, lots of examples

---

## Performance Benchmarks

### Expected Performance (Dev Environment)

| Operation | Expected Time | Notes |
|-----------|---------------|-------|
| Event submission (cold) | ~3.5s | Includes cold start |
| Event submission (warm) | ~500ms | After first request |
| Image upload | ~2-5s | Depends on image size |
| SQL query | ~100-200ms | Basic tier |
| Terraform apply | ~5-10min | First deployment |
| Terraform apply (update) | ~2-5min | Subsequent changes |

### Scaling Considerations

**When to upgrade**:
- SQL DTU > 80% consistently → Upgrade to S0/S1
- Function cold starts become problem → Upgrade to Premium plan
- Blob storage latency high → Add CDN (Azure Front Door)

---

## Cost Optimization Tips

1. **Development**:
   - Use Basic SQL tier
   - Use LRS (Local) storage replication
   - Use Consumption Function plan
   - Destroy resources when not in use: `terraform destroy`

2. **Production**:
   - Right-size SQL tier based on actual DTU usage
   - Use GRS (Geo-redundant) storage for critical data
   - Consider reserved instances for predictable workload
   - Enable cost alerts in Azure Portal

3. **Monitoring**:
   - Set up Azure spending alerts
   - Review cost analysis monthly
   - Use Azure Cost Management + Billing

---

## Security Checklist

- [ ] SQL admin password in Key Vault
- [ ] Blob connection string in Key Vault
- [ ] Managed identity enabled for Function App
- [ ] SQL firewall restricts access
- [ ] CORS configured (no wildcards)
- [ ] TLS 1.2+ enforced
- [ ] `.tfvars` files in `.gitignore`
- [ ] Terraform outputs marked as sensitive
- [ ] Soft delete enabled on Key Vault
- [ ] No credentials in application code

---

## References

- [Azure Well-Architected Framework](https://learn.microsoft.com/azure/architecture/framework/)
- [Terraform Azure Provider Docs](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Functions Best Practices](https://learn.microsoft.com/azure/azure-functions/functions-best-practices)
- [Azure SQL Security Best Practices](https://learn.microsoft.com/azure/azure-sql/database/security-best-practices)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)
