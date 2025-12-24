# Eventure Terraform Infrastructure

This directory contains Terraform configuration for deploying Azure infrastructure for the Eventure event submission platform.

## 📦 Resources Created

- **Resource Group**: Use existing `rg-eventure-webapp-dev` or create new
- **Storage Account**: Blob storage for event images (`eventuredevsa`)
- **Storage Account**: Function App storage (`eventuredevfn`)
- **Blob Container**: `events-images` container with public read access
- **Azure SQL Server**: SQL Server instance with Entra ID authentication (`sql-eventure-dev`)
- **Azure SQL Database**: Database for submitted events (`sqldb-eventure-dev`)
- **SQL Firewall Rules**: Allow Azure services and optional developer IP
- **Function App**: Serverless API endpoints with system-assigned managed identity (`func-eventure-dev`)
- **Role Assignments**: Storage Blob Data Contributor for Function App

## 🚀 Prerequisites

1. **Azure CLI** installed and authenticated:
   ```bash
   az login
   az account list --output table  # Find your subscription ID
   az account set --subscription "your-subscription-id"
   ```

2. **Terraform** installed (v1.0+):
   ```bash
   brew install terraform  # macOS
   # or download from https://www.terraform.io/downloads
   ```

3. **Azure Subscription ID**: Find it by running:
   ```bash
   az account show --query id -o tsv
   ```

## 📋 Setup Instructions

### 1. Get Your Azure Subscription ID

```bash
# Show your current subscription
az account show

# Copy the "id" field - it looks like:
# 12345678-1234-1234-1234-123456789abc
```

### 2. Configure Variables

```bash
# Copy example file
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
nano terraform.tfvars
```

**REQUIRED - Set your subscription ID:**
```hcl
subscription_id = "12345678-1234-1234-1234-123456789abc"  # Your actual subscription ID
```

**Configure for existing resource group:**
```hcl
use_existing_resource_group  = true
existing_resource_group_name = "rg-eventure-webapp-dev"
```

**Optional - Add your IP for SQL access:**
```bash
# Find your public IP
curl ifconfig.me

# Add to terraform.tfvars:
dev_ip_address = "123.456.789.012"
```

### 3. Initialize Terraform

```bash
cd terraform
terraform init
```

### 4. Preview Changes

```bash
terraform plan
```

Review the resources that will be created. You should see:
- Storage accounts (2)
- SQL Server and Database (with Entra ID admin)
- Function App with managed identity
- Role assignments for storage access
- Firewall rules

### 5. Deploy Infrastructure

```bash
terraform apply
```

Type `yes` when prompted to confirm.

⏱️ **Deployment time**: ~5-10 minutes

### 6. Get Outputs

After successful deployment, retrieve configuration:

```bash
# View all outputs
terraform output

# Get env file content (copy to .env.local)
terraform output -raw env_file_content

# Get specific values
terraform output sql_server_fqdn
terraform output function_app_url
terraform output -raw sql_admin_password
```

### 7. Set Up SQL Database Azure AD Access

**IMPORTANT**: After Terraform deployment, you need to grant the Function App's managed identity access to SQL Database:

```bash
# Get Function App name from Terraform
FUNCTION_APP_NAME=$(terraform output -raw function_app_name)

# Connect to SQL Database as Azure AD admin and run:
# Use Azure Data Studio or Azure Portal Query Editor

# Open the setup script
cat ../db/setup-aad-user.sql and setting up Azure AD access, initialize the database:

```bash
# Option 1: Using Azure AD authentication (recommended)
# Connect with Azure Data Studio as Azure AD admin
# Run ../db/schema.sql

# Option 2: Using SQL authentication (if SQL admin credentials still configured)
SQL_SERVER=$(terraform output -raw sql_server_fqdn)
SQL_DB=$(terraform output -raw sql_database_name)

# Connect with Azure Data Studio and run ../db/schema.sql
```
# Save to .env.local in project root (no secrets needed!)
terraform output -raw env_file_content > ../.env.local

# Verify file was created
cat ../.env.local
```

Note: With managed identity, no passwords or connection strings are needed in `.env.local`!

## 🗄️ Database Schema Setup

After deploying infrastructure, initialize the database:

```bash
# Get connection details
SQL_SERVER=$(terraform output -raw sql_server_fqdn)
SQL_DB=$(terraform output -raw sql_database_name)
SQL_USER=$(terraform output -raw sql_admin_username)
SQL_PASSWORD=$(terraform output -raw sql_admin_password)

# Connect and run schema
sqlcmd -S $SQL_SERVER \
       -d $SQL_DB \
       -U $SQL_USER \
       -P $SQL_PASSWORD \
       -i ../db/schema.sql
```

Or use **Azure Data Studio**:
1. Connect to SQL Server using credentials from `terraform output`
2. Open `../db/schema.sql`
3. Execute the script

##**Total**: ~$5-7/month (no Key Vault needed with managed identity!)
```bash
# See what will change
terraform plan

# Apply changes
terraform apply
```

## 🧹 Destroy Resources

**⚠️ Warning**: This will delete ALL resources and data!

```bash
terraform destroy
```

## 📊 Cost Estimate

**Development Environment** (Monthly):
- SQL Database (Basic): $4.99
- Storage (LRS): $0.02/GB
- Function App (Consumption): $0-2.00
- Key Vault: $0.03
- **Total**: ~$6-8/month

## 🔐 Security Notes

1. **Secrets Management**: Passwords stored in Key Vault
2. **SQL Firewall**: Only Azure services + your IP allowed
3. **Blob Access**: Public read for images (required for display)
4. **Managed Identity**: Function App uses MSI for Key Vault access
5. **`.tfvars` Protected**: Added to `.gitignore`

## 🏗️ Architecture

```
┌────Managed Identity**: Function App uses system-assigned managed identity (no passwords!)
2. **Azure AD Authentication**: SQL Database uses Entra ID authentication for Function App
3. **SQL Firewall**: Only Azure services + your IP allowed
4. **Blob Access**: Public read for images (required for display), write via managed identity
5. **`.tfvars` Protected**: Added to `.gitignore`
6. **Local Development**: Uses Azure CLI credentials (`az login`) - no secrets needed
    ┌────┴───────────────────┐
    │                        │
    ▼                        ▼
┌──────────────┐    ┌─────────────────────┐
│ Blob Storage │    │  Function App       │
│  (Images)    │◄───│  (Managed Identity) │
└──────────────┘    └─────────┬───────────┘
                              │
                              ▼
                      ┌──────────────────┐
                      │   SQL Server     │
                      │   (Entra ID Auth)│
                      └──────────────────┘
```

## 🐛 Troubleshooting

### "Storage account name not available"
- Storage names must be globally unique
- Change `project_name` in terraform.tfvars

### "Cannot connect to SQL Server"
- Add your IP: Set `dev_ip_address` in terraform.tfvars
- Re-apply: `terraform apply`

### "Subscription not found"
- **For managed identity**: Ensure you've run the Azure AD user setup script

### "SQL authentication failed" (locally)
- Run `az login` to authenticate with Azure CLI
- Function code uses DefaultAzureCredential which checks Azure CLI credentials
- **Note**: Key Vault is no longer used! Managed Identity provides direct access.
- If you see this error, ensure you're using the updated Terraform configuration
- Set correct subscription: `az account set --subscription "id"`

### "Key Vault access denied"
- Ensure you're logged in: `az login`
- Check subscription: `az account show`

### "Function App deployment fails"
- Consumption plan requires Linux
- Node version must be 18
- Check logs in Azure Portal

## 📚 Useful Commands

```bash
# Show current state
terraform show

# List all resources
terraform state list

# Get specific output
terraform output function_app_url

# Format configuration files
terraform fmt

# Validate configuration
terraform validate

# Refresh state from Azure
terraform refresh

# Import existing resource
terraform import azurerm_resource_group.main /subscriptions/SUB_ID/resourceGroups/RG_NAME
```
Set up Azure AD user for Function App in SQL Database (`db/setup-aad-user.sql`)
2. ✅ Initialize database with schema (`db/schema.sql`)
3. ✅ Copy environment variables to `.env.local`
4. ✅ Install dependencies: `npm install` (adds @azure/identity)
5. ⬜ Test Functions locally with `az login` for authentication
6. ⬜ Deploy Function App code (see `../docs/deployment.md`)
7. ⬜ Update CORS origins for production domain
8. ⬜ Deploy Next.js frontend (Vercel/Azure SWA)o `.env.local`
3. ⬜ Deploy Function App code (see `../docs/deployment.md`)
4. ⬜ Test event submission locally
5. ⬜ Update CORS origins for production domain
6. ⬜ Deploy Next.js frontend (Vercel/Azure SWA)
7. ⬜ Set up monitoring and alerts

## 📖 Additional Resources

- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Functions Documentation](https://learn.microsoft.com/en-us/azure/azure-functions/)
- [Azure SQL Database Pricing](https://azure.microsoft.com/en-us/pricing/details/sql-database/)
- [Find Your Public IP](https://whatismyipaddress.com/)
