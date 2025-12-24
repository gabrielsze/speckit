output "resource_group_name" {
  description = "Name of the resource group"
  value       = local.resource_group_name
}

output "storage_account_name" {
  description = "Name of the storage account"
  value       = azurerm_storage_account.main.name
}

output "blob_container_name" {
  description = "Blob container name for event images"
  value       = azurerm_storage_container.events_images.name
}

output "blob_base_url" {
  description = "Base URL for blob storage"
  value       = azurerm_storage_account.main.primary_blob_endpoint
}

output "sql_server_fqdn" {
  description = "Fully qualified domain name of the SQL Server"
  value       = azurerm_mssql_server.main.fully_qualified_domain_name
}

output "sql_database_name" {
  description = "Name of the SQL Database"
  value       = azurerm_mssql_database.main.name
}

output "function_app_name" {
  description = "Name of the Function App"
  value       = azurerm_linux_function_app.main.name
}

output "function_app_url" {
  description = "URL of the Function App"
  value       = "https://${azurerm_linux_function_app.main.default_hostname}"
}

output "function_app_principal_id" {
  description = "Principal ID of the Function App's system-assigned managed identity"
  value       = azurerm_linux_function_app.main.identity[0].principal_id
}

# Environment variables for local development (no sensitive credentials needed)
output "env_variables" {
  description = "Environment variables for .env.local"
  value = {
    SQL_SERVER           = azurerm_mssql_server.main.fully_qualified_domain_name
    SQL_DATABASE         = azurerm_mssql_database.main.name
    BLOB_ACCOUNT         = azurerm_storage_account.main.name
    BLOB_CONTAINER       = azurerm_storage_container.events_images.name
    NEXT_PUBLIC_API_BASE = "https://${azurerm_linux_function_app.main.default_hostname}/api"
    APP_ENV              = var.environment
    LOG_LEVEL            = var.log_level
  }
  sensitive = false
}

# Output formatted for easy copy-paste to .env.local
output "env_file_content" {
  description = "Ready-to-use .env.local file content (no secrets needed with Managed Identity)"
  value       = <<-EOT
# Azure SQL Database
SQL_SERVER=${azurerm_mssql_server.main.fully_qualified_domain_name}
SQL_DATABASE=${azurerm_mssql_database.main.name}

# Azure Blob Storage
BLOB_ACCOUNT=${azurerm_storage_account.main.name}
BLOB_CONTAINER=${azurerm_storage_container.events_images.name}

# App Configuration
APP_ENV=${var.environment}
LOG_LEVEL=${var.log_level}
NEXT_PUBLIC_API_BASE=https://${azurerm_linux_function_app.main.default_hostname}/api

# Note: No SQL or Blob credentials needed! Function App uses Managed Identity authentication.
# For local development, ensure you're logged in with: az login
EOT
  sensitive   = false
}
