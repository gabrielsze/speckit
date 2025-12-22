# Azure Infrastructure Implementation Plan

**Feature**: Azure Infrastructure Deployment  
**Spec**: [spec.md](./spec.md)  
**Estimated Effort**: 4-6 hours  
**Target Date**: Week of 2024-12-22

## Tech Stack

### Infrastructure as Code
- **Terraform**: v1.0+ (HCL configuration)
- **Provider**: `hashicorp/azurerm` v3.0+
- **State Storage**: Local (upgrade to Azure Storage backend for team collaboration)

### Azure Services
- **Azure SQL Database**: Managed relational database (Basic tier for dev)
- **Azure Blob Storage**: Object storage for images (LRS replication for dev)
- **Azure Functions**: Serverless compute (Consumption Y1 plan)
- **Azure Key Vault**: Secrets management (Standard SKU)
- **Azure Resource Group**: Logical container for all resources

### Supporting Tools
- **Azure CLI**: Authentication and manual operations
- **sqlcmd** or **Azure Data Studio**: Database schema initialization

## Architecture

### Resource Topology

```
Azure Subscription
└── Resource Group: rg-eventure-webapp-{env} (existing or new)
    ├── Storage Account: eventure{env}sa (main)
    │   └── Container: events-images (public blob access)
    ├── Storage Account: eventure{env}fn (functions)
    │   └── (Internal function state/logs)
    ├── SQL Server: eventure-{env}-sqlserver
    │   ├── Database: eventure-{env}-db
    │   └── Firewall Rules
    │       ├── AllowAzureServices (0.0.0.0)
    │       └── AllowDeveloperIP (optional)
    ├── Function App: eventure-{env}-func
    │   ├── Runtime: Node.js 18 (Linux)
    │   ├── Plan: Consumption (Y1)
    │   └── Managed Identity: Enabled
    └── Key Vault: eventure-{env}-kv
        ├── Secret: sql-admin-password
        └── Secret: blob-connection-string
```

### Naming Convention

Format: Matches existing project convention

Examples:
- Resource Group: `rg-eventure-webapp-{env}` (use existing if available)
- SQL Server: `sql-eventure-{env}`
- Function App: `func-eventure-{env}`
- Storage (special): `eventuredevsa` (no hyphens, max 24 chars)

### Network Flow

```
┌─────────────────┐
│   Developer     │
│   (Local)       │
└────────┬────────┘
         │
    ┌────┴─────────────────────────────┐
    │                                  │
    ▼                                  ▼
┌──────────────┐              ┌──────────────┐
│  SQL Server  │              │ Terraform    │
│  (Admin)     │              │ (Provision)  │
└──────────────┘              └──────────────┘

┌──────────────────┐
│  Next.js Static  │
│  Site (Browser)  │
└────────┬─────────┘
         │
    ┌────┴───────────────────┐
    │                        │
    ▼                        ▼
┌──────────────┐    ┌─────────────────┐
│ Blob Storage │    │  Function App   │
│  (Images)    │    │  (API Handlers) │
└──────────────┘    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
            ┌──────────────┐  ┌──────────────┐
            │  SQL Server  │  │  Key Vault   │
            │  (Database)  │  │  (Secrets)   │
            └──────────────┘  └──────────────┘
```

## Resource Configuration

### 1. Resource Group
- **Purpose**: Logical container, simplifies cleanup
- **Naming**: `rg-eventure-webapp-{env}`
- **Location**: Variable (default: `eastus`)
- **Tags**: Project, Environment, ManagedBy
- **Note**: Can use existing RG (`rg-eventure-webapp-dev`) or create new one

### 2. Storage Account (Main - for images)
- **Purpose**: Store uploaded event images
- **Naming**: `{project}{env}sa` (lowercase, no hyphens)
- **Tier**: Standard
- **Replication**: LRS (dev), GRS (prod)
- **Container**: `events-images`
- **Access**: Blob (public read)
- **CORS**: Allow origins from `allowed_origins` variable

### 3. Storage Account (Functions)
- **Purpose**: Function App internal storage (required)
- **Naming**: `{project}{env}fn`
- **Tier**: Standard
- **Replication**: LRS
- **Why Separate?**: Best practice, isolates function state from app data

### 4. SQL Server
- **Purpose**: Host SQL database
- **Naming**: `{project}-{env}-sqlserver`
- **Version**: 12.0 (latest)
- **Admin User**: Variable (default: `sqladmin`)
- **Admin Password**: Auto-generated (32 chars) or user-provided
- **TLS**: 1.2 minimum
- **Firewall**:
  - Azure Services: 0.0.0.0 (required for Function App)
  - Developer IP: Optional (for local access)

### 5. SQL Database
- **Purpose**: Store submitted events
- **Naming**: `{project}-{env}-db`
- **SKU**: Variable (default: Basic)
- **Max Size**: Variable (default: 2GB)
- **Collation**: SQL_Latin1_General_CP1_CI_AS
- **Schema**: Manual init after provisioning (run `db/schema.sql`)

### 6. Function App
- **Purpose**: Host API endpoints (`/api/events/submit`, `/api/events/upload-image`)
- **Naming**: `{project}-{env}-func`
- **Plan**: Consumption (Y1) - truly serverless
- **Runtime**: Node.js 18 (Linux)
- **CORS**: Allow origins from `allowed_origins` variable
- **Identity**: System-assigned managed identity
- **App Settings**:
  - `SQL_SERVER`: FQDN of SQL Server
  - `SQL_DATABASE`: Database name
  - `SQL_USER`: Admin username
  - `SQL_PASSWORD`: Key Vault reference
  - `BLOB_ACCOUNT`: Storage account name
  - `BLOB_CONTAINER`: Container name
  - `BLOB_CONNECTION_STRING`: Key Vault reference
  - `APP_ENV`: Environment name
  - `LOG_LEVEL`: Logging level

### 7. Key Vault
- **Purpose**: Secure storage for secrets
- **Naming**: `{project}-{env}-kv`
- **SKU**: Standard
- **Soft Delete**: 7 days retention
- **Access Policies**:
  - Developer: Get, List, Set, Delete secrets
  - Function App: Get, List secrets (via managed identity)
- **Secrets**:
  - `sql-admin-password`: SQL admin password
  - `blob-connection-string`: Blob storage connection string

## File Structure

```
terraform/
├── main.tf                    # Resource definitions
├── variables.tf               # Input variables with defaults
├── outputs.tf                 # Output values (connection strings, URLs)
├── terraform.tfvars.example   # Example configuration
├── .gitignore                 # Protect sensitive files
└── README.md                  # Setup and usage documentation
```

## Variables Design

### Required Variables
- `project_name`: String (default: "eventure")
- `environment`: String (default: "dev",
- `use_existing_resource_group`: Bool (default: false)
- `existing_resource_group_name`: String (default: "", used if use_existing_resource_group = true) allowed: dev/staging/prod)
- `location`: String (default: "eastus")

### Optional Variables
- `sql_admin_username`: String (default: "sqladmin")
- `sql_admin_password`: String (default: "", auto-generated if empty)
- `sql_db_sku`: String (default: "Basic")
- `sql_db_max_size_gb`: Number (default: 2)
- `storage_replication_type`: String (default: "LRS")
- `allowed_origins`: List(string) (default: ["http://localhost:3000"])
- `dev_ip_address`: String (default: "", optional)
- `log_level`: String (default: "info")
- `tags`: Map(string) (project metadata)

### Validation Rules
- `project_name`: Lowercase alphanumeric, max 10 chars (for storage account naming)
- `environment`: Must be dev, staging, or prod
- `log_level`: Must be debug, info, warn, or error

## Outputs Design

### Critical Outputs
1. **SQL Connection**:
   - `sql_server_fqdn`: Fully qualified domain name
   - `sql_database_name`: Database name
   - `sql_admin_username`: Admin username
   - `sql_admin_password`: Admin password (sensitive)

2. **Blob Storage**:
   - `storage_account_name`: Account name
   - `blob_container_name`: Container name
   - `blob_connection_string`: Connection string (sensitive)
   - `blob_base_url`: Public URL base

3. **Function App**:
   - `function_app_name`: Function App name
   - `function_app_url`: Full HTTPS URL
   - `function_app_identity`: Managed identity principal ID

4. **Key Vault**:
   - `key_vault_name`: Vault name
   - `key_vault_uri`: Vault URI

5. **Convenience**:
   - `env_file_content`: Ready-to-use `.env.local` content (sensitive)

## Deployment Phases

### Phase 1: Configuration (15 minutes)
1. Install prerequisites (Terraform, Azure CLI)
2. Authenticate with Azure: `az login`
3. Copy `terraform.tfvars.example` to `terraform.tfvars`
4. Customize values (project name, environment, location, allowed origins)
5. Optionally set `dev_ip_address` for local SQL access

### Phase 2: Provisioning (5-10 minutes)
1. Initialize Terraform: `terraform init`
2. Validate configuration: `terraform validate`
3. Preview changes: `terraform plan`
4. Apply configuration: `terraform apply`
5. Confirm and wait for completion

### Phase 3: Post-Provisioning (10 minutes)
1. Extract outputs: `terraform output`
2. Save environment variables: `terraform output -raw env_file_content > ../.env.local`
3. Initialize database schema:
   ```bash
   sqlcmd -S $(terraform output -raw sql_server_fqdn) \
          -d $(terraform output -raw sql_database_name) \
          -U $(terraform output -raw sql_admin_username) \
          -P $(terraform output -raw sql_admin_password) \
          -i ../db/schema.sql
   ```
4. Test blob storage: Upload a test image
5. Test function app: Call health endpoint (after code deployment)

### Phase 4: Validation (5 minutes)
- [ ] SQL database accessible from developer machine
- [ ] `submitted_events` table exists with correct schema
- [ ] Blob container accepts uploads
- [ ] Uploaded images accessible via public URL
- [ ] Function App URL responds (404 expected before code deployment)
- [ ] `.env.local` file contains all required variables
- [ ] No sensitive data committed to Git

## Cost Breakdown

### Development Environment (Monthly)

| Resource | SKU | Est. Cost |
|----------|-----|-----------|
| SQL Database | Basic (5 DTU) | $4.99 |
| Storage Account (main) | Standard LRS | $0.02/GB |
| Storage Account (functions) | Standard LRS | $0.50 |
| Function App | Consumption | $0-2.00* |
| Key Vault | Standard | $0.03** |
| **Total** | | **~$6-8/month** |

*1M free executions/month, $0.20 per additional million  
**First 10K operations free

### Production Environment (Estimated)

| Resource | SKU | Est. Cost |
|----------|-----|-----------|
| SQL Database | S1 (20 DTU) | $30.00 |
| Storage Account (main) | Standard GRS | $0.05/GB |
| Storage Account (functions) | Standard LRS | $0.50 |
| Function App | Consumption | $5-10.00 |
| Key Vault | Standard | $0.50 |
| **Total** | | **~$40-50/month** |

## Security Considerations

### Secrets Management
- ✅ SQL password stored in Key Vault
- ✅ Blob connection string stored in Key Vault
- ✅ Function App uses managed identity (no hardcoded credentials)
- ✅ `.tfvars` files in `.gitignore`
- ✅ Outputs marked as sensitive

### Network Security
- ✅ SQL firewall restricts access to Azure services + developer IP
- ✅ Blob CORS restricts origins
- ✅ Function App CORS restricts origins
- ✅ TLS 1.2 minimum for SQL
- ✅ HTTPS enforced for Function App

### Access Control
- ✅ Managed identity for service-to-service auth
- ✅ Key Vault RBAC for secret access
- ✅ SQL admin credentials rotatable
- ⚠️ Developer needs Contributor role on subscription (document)

## Monitoring & Operations

### Built-in Monitoring (Free Tier)
- Azure Monitor: Basic metrics (CPU, memory, requests)
- SQL Database: Query performance insights (Basic tier)
- Storage: Request metrics and logging
- Function App: Execution logs (built-in)

### Optional Enhancements (Future)
- Application Insights integration
- Azure Alerts for cost thresholds
- Log Analytics workspace
- Audit logging

## Rollback Strategy

### Complete Rollback
```bash
terraform destroy
```
- Deletes all resources
- **Warning**: Destroys data (SQL database, uploaded images)
- Soft delete on Key Vault (7 day retention)

### Partial Rollback
- Use `terraform state rm` to remove specific resources
- Manually delete via Azure Portal
- Re-apply Terraform to reconcile

### State Recovery
- Terraform state stored locally in `terraform.tfstate`
- **Recommendation**: Backup state file before major changes
- **Production**: Use remote state (Azure Storage backend)

## Testing Strategy

### Unit Tests (Pre-Deployment)
- ✅ Terraform validate: `terraform validate`
- ✅ Terraform format: `terraform fmt -check`
- ✅ Variable validation rules (built into Terraform)

### Integration Tests (Post-Deployment)
1. SQL connectivity test
2. Database schema verification (`submitted_events` table exists)
3. Blob upload/download test
4. Function App health check (after code deployment)
5. Key Vault secret retrieval test

### Cost Validation
- Review estimated cost in Azure Portal after deployment
- Set up spending alerts (optional)

## Documentation Deliverables

1. **README.md**: Comprehensive setup guide
   - Prerequisites
   - Quick start (5 steps)
   - Troubleshooting common issues
   - Cost optimization tips
   - Security best practices
   - Useful commands reference

2. **terraform.tfvars.example**: Annotated configuration template
   - All variables with descriptions
   - Recommended values per environment
   - Security notes

3. **ARCHITECTURE.md** (Optional): Visual diagrams
   - Resource topology
   - Network flows
   - Security boundaries

## Success Metrics

1. ✅ Developer can provision infrastructure in < 15 minutes
2. ✅ Zero manual Azure Portal configuration required
3. ✅ All secrets accessible via `.env.local` file
4. ✅ Infrastructure cost < $10/month for dev
5. ✅ Can destroy and recreate infrastructure identically
6. ✅ No secrets in Git repository (verified by `.gitignore`)

## Next Steps After Deployment

1. Deploy Function App code (`api/events/*`)
2. Test event submission end-to-end
3. Deploy Next.js static site (Vercel/Azure SWA)
4. Update CORS origins with production domain
5. Set up CI/CD pipeline (GitHub Actions)
6. Configure production environment (staging/prod tfvars)
7. Enable monitoring and alerts

## Open Decisions

### Decision 1: Consumption Plan vs Premium Plan
**Options**:
- **Consumption (Y1)**: Serverless, cold starts (~3s), $0-2/month
- **Premium (EP1)**: Always warm, VNet integration, ~$150/month

**Recommendation**: Start with Consumption, upgrade if cold starts become an issue

### Decision 2: Separate Storage Accounts
**Current Plan**: Two storage accounts (main for images, separate for functions)

**Rationale**: Best practice, isolates concerns, minimal cost impact

**Alternative**: Single storage account (simpler, slightly cheaper)

### Decision 3: Key Vault Access
**Current Plan**: Managed identity for Function App, developer access via Azure CLI

**Alternative**: Key Vault references in app settings (simpler, less secure)

**Recommendation**: Stick with managed identity (industry best practice)

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Terraform state file lost | Regular backups, consider remote state backend |
| Storage account name collision | Add random suffix if needed |
| SQL password in plain text | Use Key Vault, mark outputs as sensitive |
| Over-provisioned resources | Start with Basic/consumption tiers, monitor usage |
| Function cold start latency | Accept tradeoff or upgrade to Premium plan |

## Timeline Estimate

- **Terraform Configuration**: 2 hours
- **Documentation**: 1 hour
- **Testing/Validation**: 1 hour
- **Total**: 4 hours (first deployment)
- **Subsequent Deployments**: 15 minutes (fully automated)
