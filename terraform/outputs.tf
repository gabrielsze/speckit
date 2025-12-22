output "resource_group_name" {
  description = "Name of the resource group"
  value       = local.resource_group_name
}

output "storage_account_name" {
  description = "Name of the storage account"
  value       = azurerm_storage_account.main.name
}

output "storage_account_connection_string" {
  description = "Storage account connection string"
  value       = azurerm_storage_account.main.primary_connection_string
  sensitive   = true
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

output "sql_admin_username" {
  description = "SQL Server administrator username"
  value       = var.sql_admin_username
}

output "sql_admin_password" {
  description = "SQL Server administrator password"
  value       = var.sql_admin_password != "" ? var.sql_admin_password : random_password.sql_admin[0].result
  sensitive   = true
}

output "function_app_name" {
  description = "Name of the Function App"
  value       = azurerm_linux_function_app.main.name
}

output "function_app_url" {
  description = "URL of the Function App"
  value       = "https://${azurerm_linux_function_app.main.default_hostname}"
}

output "function_app_identity" {
  description = "Managed identity principal ID of the Function App"
  value       = azurerm_linux_function_app.main.identity[0].principal_id
}

output "key_vault_name" {
  description = "Name of the Key Vault"
  value       = azurerm_key_vault.main.name
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = azurerm_key_vault.main.vault_uri
}

# Environment variables for local development
output "env_variables" {
  description = "Environment variables for .env.local"
  value = {
    SQL_SERVER              = azurerm_mssql_server.main.fully_qualified_domain_name
    SQL_DATABASE            = azurerm_mssql_database.main.name
    SQL_USER                = var.sql_admin_username
    SQL_PASSWORD            = var.sql_admin_password != "" ? var.sql_admin_password : random_password.sql_admin[0].result
    BLOB_ACCOUNT            = azurerm_storage_account.main.name
    BLOB_CONTAINER          = azurerm_storage_container.events_images.name
    BLOB_CONNECTION_STRING  = azurerm_storage_account.main.primary_connection_string
    NEXT_PUBLIC_API_BASE    = "https://${azurerm_linux_function_app.main.default_hostname}/api"
    APP_ENV                 = var.environment
    LOG_LEVEL               = var.log_level
  }
  sensitive = true
}

# Output formatted for easy copy-paste to .env.local
output "env_file_content" {
  description = "Ready-to-use .env.local file content"
  value = <<-EOT
# Azure SQL Database
SQL_SERVER=${azurerm_mssql_server.main.fully_qualified_domain_name}
SQL_DATABASE=${azurerm_mssql_database.main.name}
SQL_USER=${var.sql_admin_username}
SQL_PASSWORD=${var.sql_admin_password != "" ? var.sql_admin_password : random_password.sql_admin[0].result}

# Azure Blob Storage
BLOB_ACCOUNT=${azurerm_storage_account.main.name}
BLOB_CONTAINER=${azurerm_storage_container.events_images.name}
BLOB_CONNECTION_STRING=${azurerm_storage_account.main.primary_connection_string}

# App Configuration
APP_ENV=${var.environment}
LOG_LEVEL=${var.log_level}
NEXT_PUBLIC_API_BASE=https://${azurerm_linux_function_app.main.default_hostname}/api
EOT
  sensitive = true
}
