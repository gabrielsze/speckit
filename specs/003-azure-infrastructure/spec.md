# Azure Infrastructure Specification

**Feature ID**: 003-azure-infrastructure  
**Status**: ✅ Complete (Verified December 24, 2025)  
**Created**: 2024-12-22  
**Updated**: 2025-12-24  
**Owner**: Infrastructure Team

## Overview

Provision Azure cloud infrastructure to support the Eventure event submission platform, including database, blob storage, and serverless API endpoints.

## Goals

1. **Cost-Effective**: Minimize infrastructure costs while meeting performance needs (~$5-10/month for dev)
2. **Serverless-First**: Use consumption-based pricing where possible
3. **Secure**: Follow Azure security best practices (Key Vault, managed identities, firewall rules)
4. **Reproducible**: Infrastructure as Code (Terraform) for consistent deployments
5. **Scalable**: Architecture can scale from dev to production without major changes

## User Stories

### US1: Deploy Database Infrastructure (P1) ✅
**As a** developer  
**I want** an Azure SQL database provisioned  
**So that** submitted events can be persisted

**Acceptance Criteria**:
- [x] SQL Server instance created with secure admin credentials
- [x] Database created with appropriate tier (Basic for dev, scalable for prod)
- [x] Firewall rules allow Azure services and developer IP
- [x] Connection string available for application configuration
- [x] Database schema can be initialized (`submitted_events` table)
- [x] Entra ID authentication enabled on SQL Server

### US2: Deploy Blob Storage (P1) ✅
**As a** developer  
**I want** Azure Blob Storage configured  
**So that** event images can be uploaded and publicly accessed

**Acceptance Criteria**:
- [x] Storage account created with unique name
- [x] Container `events-images` created with blob (public read) access
- [x] CORS configured for allowed origins
- [x] Account details available (no connection string needed with managed identity)
- [x] Images accessible via public URL

### US3: Deploy Serverless API Infrastructure (P1) ✅
**As a** developer  
**I want** Azure Functions infrastructure provisioned  
**So that** API endpoints can handle event submissions and image uploads

**Acceptance Criteria**:
- [x] Function App created with Consumption (Y1) plan (truly serverless)
- [x] Node.js 20 runtime configured (upgraded from 18 for Azure SDK compatibility)
- [x] CORS configured for frontend origins
- [x] System-assigned managed identity enabled
- [x] Function App URL available for `NEXT_PUBLIC_API_BASE`

### US4: SQL Authentication via Managed Identity (P1) ✅
**As a** security-conscious developer  
**I want** Azure Functions to authenticate to SQL using managed identity  
**So that** no credentials are stored in configuration files or logs

**Acceptance Criteria**:
- [x] Azure SQL configured with Entra ID authentication enabled
- [x] Azure AD user created for Function App's managed identity (manual setup via `db/setup-aad-user.sql`)
- [x] Function App assigned `db_owner` role on database
- [x] Function code uses `@azure/identity` with `ManagedIdentityCredential` (Azure) and `DefaultAzureCredential` (local)
- [x] No SQL username/password in environment variables
- [x] Managed identity automatically rotates tokens
- [x] **Verified in production**: Event successfully created with token authentication

### US5: Blob Storage Authentication via Managed Identity (P1) ✅
**As a** security-conscious developer  
**I want** Azure Functions to access Blob Storage using managed identity  
**So that** connection strings are not exposed in configuration

**Acceptance Criteria**:
- [x] Storage account access configured for managed identity
- [x] Function App has "Storage Blob Data Contributor" role on storage account (provisioned via Terraform)
- [x] Function code uses `@azure/identity` with `ManagedIdentityCredential` to authenticate
- [x] No storage connection string in environment variables
- [x] Access tokens automatically rotated by managed identity

### US6: Infrastructure as Code (P1) ✅
**As a** developer  
**I want** Terraform configuration  
**So that** infrastructure is reproducible and version-controlled

**Acceptance Criteria**:
- [x] All resources defined in Terraform `.tf` files
- [x] Variables configurable via `terraform.tfvars`
- [x] Can use existing resource group OR create new one
- [x] Outputs provide all necessary connection details
- [x] Role assignments for managed identity included

### US7: Local Development Support (P2) ✅
**As a** developer  
**I want** to test Azure Functions locally with managed identity auth  
**So that** I can develop without deploying to Azure constantly

**Acceptance Criteria**:
- [x] `DefaultAzureCredential` supports Azure CLI authentication for local dev
- [x] Functions work locally after `az login`
- [x] Same code runs both locally and in Azure
- [x] **Verified**: Local submitEvent successfully wrote to Azure SQL using CLI credentials

**Remaining Acceptance Criteria**:
- [ ] Azure CLI authentication works with local development
- [ ] Functions can use managed identity tokens locally (via Azure CLI)
- [ ] Fallback to connection string for non-Azure environments documented
- [ ] `.env.local` minimal (only contains non-secret values)
- [ ] `.env.local` content auto-generated from outputs
- [ ] Documentation includes deployment steps
- [ ] `.gitignore` protects sensitive tfvars files

### US6: Multi-Environment Support (P2)
**As a** DevOps engineer  
**I want** environment-specific configurations  
**So that** I can deploy dev, staging, and production environments

**Acceptance Criteria**:
- [ ] Environment variable (`dev`, `staging`, `prod`) affects resource naming
- [ ] Resource tiers adjustable per environment (Basic SQL for dev, S1+ for prod)
- [ ] Tags applied for resource organization
- [ ] Separate `.tfvars` files can be maintained per environment

## Non-Functional Requirements

### Performance
- **SQL Database**: Query response < 500ms (Basic tier sufficient for dev)
- **Blob Storage**: Image upload < 5s for 5MB file
- **Function App**: Cold start < 3s, warm execution < 500ms

### Security
- **SQL**: TLS 1.2+, firewall rules restrict access, Entra ID authentication only (no password-based)
- **Blob Storage**: Public read for images only, CORS restricts origins, managed identity authentication
- **Functions**: System-assigned managed identity (no hardcoded credentials), HTTPS only, token-based auth
- **Access Control**: Azure RBAC for all resources, time-limited access tokens, no shared credentials

### Cost
- **Development**: < $10/month
- **Production**: Scale-appropriate (estimate $30-50/month for moderate traffic)

### Compliance
- Data stored in single Azure region (GDPR compliance if EU)
- Audit logs enabled (optional for production)

## Out of Scope

- CI/CD pipeline configuration (separate feature)
- Monitoring/Application Insights setup (can add later)
- Custom domain configuration
- CDN for blob storage
- Database backups/disaster recovery (use Azure defaults)
- Multiple regions/geo-replication
- User-assigned managed identities (will use system-assigned)
- Key Vault (deferred if managed identity covers all auth needs)

## Success Criteria

1. ✅ Developer can run `terraform apply` and provision all resources in < 10 minutes
2. ✅ All connection strings/secrets output as `.env.local` format
3. ✅ SQL database accessible from developer machine (with IP whitelisting)
4. ✅ Blob storage accepts image uploads and serves publicly
5. ✅ Function App endpoints respond (even before code deployment)
6. ✅ Total infrastructure cost < $10/month for dev environment
7. ✅ No sensitive credentials in Git repository
8. ✅ Infrastructure can be destroyed and recreated identically

## Open Questions

1. **Q**: Should we use Azure Static Web Apps instead of separate Function App?  
   **A**: TBD - Evaluate if SWA meets our needs (combines static site + API)

2. **Q**: Do we need a separate storage account for Function App internal storage?  
   **A**: What Azure region should be default?  
   **A**: `eastus` (low cost, high availability), configurable

4. **Q**: Should we enable SQL database backups?  
   **A**: Yes, Azure provides automatic backups for SQL Database (7-35 days retention)

5. **Q**: How do we handle local development with managed identity?  
   **A**: Use Azure CLI auth locally (`az login`), Functions runtime will use DefaultAzureCredential chain
5. **Q**: Should we enable SQL database backups?  
   **A**: Yes, Azure provides automatic backups for SQL Database (7-35 days retention)

## Assumptions

- Developer has Azure CLI installed and authenticated
- Developer has Terraform >= 1.0 installed
- Azure subscription has sufficient quota for resources
- Developer will manually run database schema script after provisioning
- Static site (Next.js) will be deployed separately (Vercel/Azure SWA/etc.)

## Dependencies

- Azure subscription with Contributor role
- Terraform >= 1.0
- Azure CLI >= 2.50
- Database schema script: `db/schema.sql`
- API code ready for deployment: `api/events/*`

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Storage account name collision | High | Medium | Include random suffix or prompt user |
| SQL password exposed in state | High | Low | Use Terraform Cloud or encrypted backend |
| Cost overruns in production | Medium | Medium | Set Azure spending alerts, use Basic tier for dev |
| Function cold start delays | Low | High | Accept as Consumption plan tradeoff, or use Premium plan |
| Terraform version incompatibility | Medium | Low | Lock provider versions in config |

## References

- [Azure SQL Database Pricing](https://azure.microsoft.com/pricing/details/sql-database/)
- [Azure Functions Pricing](https://azure.microsoft.com/pricing/details/functions/)
- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Best Practices](https://learn.microsoft.com/azure/architecture/)

## Implementation Details

### Managed Identity Authentication Flow

**SQL Database**:
1. Function App has system-assigned managed identity enabled in Terraform
2. Terraform creates an Azure AD user corresponding to the Function App identity
3. Terraform assigns SQL role to the AD user (db_owner for dev, more restricted for prod)
4. Function code uses `@azure/identity` library to get access token
5. Token is passed to SQL connection using `accessToken` authentication type
6. Token automatically rotated by managed identity; code handles refresh transparently

**Blob Storage**:
1. Function App identity gets "Storage Blob Data Contributor" role assignment
2. Function code uses `@azure/identity` to get access token
3. `BlobServiceClient.fromTokenCredential()` used instead of connection string
4. Token is automatically managed by the identity library

### Local Development Flow

For developers testing locally:
1. Developer runs `az login` via Azure CLI (authenticates with their own identity)
2. Functions runtime uses `DefaultAzureCredential` chain:
   - First checks for environment variables (for CI/CD)
   - Then checks Azure CLI cached token
   - Falls back to other credential types
3. Developer must have permissions on resources they're testing
4. No secrets needed in `.env.local` for Managed Identity auth

### Environment Variables

**Needed (minimal)**:
```
SQL_SERVER=sql-eventure-dev.database.windows.net
SQL_DATABASE=sqldb-eventure-dev
BLOB_ACCOUNT=eventuredevsa
BLOB_CONTAINER=events-images
```

**NOT needed anymore**:
- `SQL_USER`
- `SQL_PASSWORD`
- `BLOB_CONNECTION_STRING`
