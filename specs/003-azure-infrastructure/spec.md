# Azure Infrastructure Specification

**Feature ID**: 002-azure-infrastructure  
**Status**: Draft  
**Created**: 2024-12-22  
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

### US1: Deploy Database Infrastructure (P1)
**As a** developer  
**I want** an Azure SQL database provisioned  
**So that** submitted events can be persisted

**Acceptance Criteria**:
- [ ] SQL Server instance created with secure admin credentials
- [ ] Database created with appropriate tier (Basic for dev, scalable for prod)
- [ ] Firewall rules allow Azure services and developer IP
- [ ] Connection string available for application configuration
- [ ] Database schema can be initialized (`submitted_events` table)

### US2: Deploy Blob Storage (P1)
**As a** developer  
**I want** Azure Blob Storage configured  
**So that** event images can be uploaded and publicly accessed

**Acceptance Criteria**:
- [ ] Storage account created with unique name
- [ ] Container `events-images` created with blob (public read) access
- [ ] CORS configured for allowed origins
- [ ] Connection string and account details available
- [ ] Images accessible via public URL

### US3: Deploy Serverless API Infrastructure (P1)
**As a** developer  
**I want** Azure Functions infrastructure provisioned  
**So that** API endpoints can handle event submissions and image uploads

**Acceptance Criteria**:
- [ ] Function App created with Consumption (Y1) plan (truly serverless)
- [ ] Node.js 18 runtime configured
- [ ] CORS configured for frontend origins
- [ ] Environment variables injected (SQL, Blob, app config)
- [ ] Managed identity enabled for Key Vault access
- [ ] Function App URL available for `NEXT_PUBLIC_API_BASE`

### US4: Secure Secrets Management (P2)
**As a** security-conscious developer  
**I want** sensitive credentials stored in Key Vault  
**So that** secrets are not exposed in configuration files or logs

**Acceptance Criteria**:
- [ ] Key Vault created with appropriate access policies
- [ ] SQL admin password stored as secret
- [ ] Blob connection string stored as secret
- [ ] Function App uses managed identity to access secrets
- [ ] Developer can access secrets via Azure CLI for local dev

### US5: Infrastructure as Code (P1)
**As a** developer  
**I want** Terraform configuration  
**So that** infrastructure is reproducible and version-controlled

**Acceptance Criteria**:
- [ ] All resources defined in Terraform `.tf` files
- [ ] Variables configurable via `terraform.tfvars`
- [ ] Can use existing resource group OR create new one
- [ ] Outputs provide all necessary connection details
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
- **SQL**: TLS 1.2+, firewall rules restrict access, admin password stored in Key Vault
- **Blob Storage**: Public read for images only, CORS restricts origins
- **Functions**: Managed identity (no hardcoded credentials), HTTPS only
- **Key Vault**: RBAC controls, soft delete enabled

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
   **A**: Yes (best practice), Functions need dedicated storage for state/logs

3. **Q**: Should SQL admin password be auto-generated or user-provided?  
   **A**: Auto-generate by default, allow override via tfvars

4. **Q**: What Azure region should be default?  
   **A**: `eastus` (low cost, high availability), configurable

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
