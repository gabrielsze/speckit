# Eventure Terraform Infrastructure

This directory contains Terraform configuration for deploying Azure infrastructure for the Eventure event submission platform.

## 📦 Resources Created

- **Resource Group**: Use existing `rg-eventure-webapp-dev` or create new
- **Storage Account**: Blob storage for event images (`eventuredevsa`)
- **Storage Account**: Function App storage (`eventuredevfn`)
- **Blob Container**: `events-images` container with public read access
- **Azure SQL Server**: SQL Server instance (`sql-eventure-dev`)
- **Azure SQL Database**: Database for submitted events (`sqldb-eventure-dev`)
- **SQL Firewall Rules**: Allow Azure services and optional developer IP
- **Function App**: Serverless API endpoints (`func-eventure-dev`) - Consumption Plan (Y1)
- **Key Vault**: Secure storage for secrets (`kv-eventure-dev`)

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
- SQL Server and Database
- Function App
- Key Vault
- Firewall rules and secrets

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

### 7. Save Environment Variables

```bash
# Save to .env.local in project root
terraform output -raw env_file_content > ../.env.local

# Verify file was created
cat ../.env.local
```

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

## 🔄 Update Infrastructure

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
┌─────────────────┐
│  Next.js Static │
│  Site (Browser) │
└────────┬────────┘
         │
    ┌────┴───────────────────┐
    │                        │
    ▼                        ▼
┌──────────────┐    ┌─────────────────┐
│ Blob Storage │    │  Function App   │
│  (Images)    │    │  (Consumption)  │
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

## 🐛 Troubleshooting

### "Storage account name not available"
- Storage names must be globally unique
- Change `project_name` in terraform.tfvars

### "Cannot connect to SQL Server"
- Add your IP: Set `dev_ip_address` in terraform.tfvars
- Re-apply: `terraform apply`

### "Subscription not found"
- Verify: `az account show`
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

## 🔗 Next Steps

After infrastructure is deployed:

1. ✅ Initialize database with schema (`db/schema.sql`)
2. ✅ Copy environment variables to `.env.local`
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
