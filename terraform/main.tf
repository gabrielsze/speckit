terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy = true
    }
  }
  subscription_id = var.subscription_id
}

# Data source for existing resource group (if using existing)
data "azurerm_resource_group" "existing" {
  count = var.use_existing_resource_group ? 1 : 0
  name  = var.existing_resource_group_name
}

# Create new resource group (if not using existing)
resource "azurerm_resource_group" "main" {
  count    = var.use_existing_resource_group ? 0 : 1
  name     = "rg-${var.project_name}-webapp-${var.environment}"
  location = var.location
  tags     = var.tags
}

# Local value to reference the correct resource group
locals {
  resource_group_name = var.use_existing_resource_group ? data.azurerm_resource_group.existing[0].name : azurerm_resource_group.main[0].name
  resource_group_location = var.use_existing_resource_group ? data.azurerm_resource_group.existing[0].location : azurerm_resource_group.main[0].location
}

# Storage Account for Blob Storage (event images)
resource "azurerm_storage_account" "main" {
  name                     = "${var.project_name}${var.environment}sa"
  resource_group_name      = local.resource_group_name
  location                 = local.resource_group_location
  account_tier             = "Standard"
  account_replication_type = var.storage_replication_type
  
  blob_properties {
    cors_rule {
      allowed_headers    = ["*"]
      allowed_methods    = ["GET", "POST", "PUT"]
      allowed_origins    = var.allowed_origins
      exposed_headers    = ["*"]
      max_age_in_seconds = 3600
    }
  }

  tags = var.tags
}

# Blob Container for event images
resource "azurerm_storage_container" "events_images" {
  name                  = "events-images"
  storage_account_name  = azurerm_storage_account.main.name
  container_access_type = "blob" # Public read access for images
}

# Storage Account for Function App (required for Azure Functions)
resource "azurerm_storage_account" "functions" {
  name                     = "${var.project_name}${var.environment}fn"
  resource_group_name      = local.resource_group_name
  location                 = local.resource_group_location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = var.tags
}

# Service Plan for Function App (Consumption Y1 plan)
resource "azurerm_service_plan" "functions" {
  name                = "asp-${var.project_name}-${var.environment}"
  resource_group_name = local.resource_group_name
  location            = local.resource_group_location
  os_type             = "Linux"
  sku_name            = "Y1"  # Consumption plan (serverless)

  tags = var.tags
}

# SQL Server
resource "azurerm_mssql_server" "main" {
  name                         = "sql-${var.project_name}-${var.environment}"
  resource_group_name          = local.resource_group_name
  location                     = local.resource_group_location
  version                      = "12.0"
  administrator_login          = var.sql_admin_username
  administrator_login_password = var.sql_admin_password != "" ? var.sql_admin_password : random_password.sql_admin[0].result
  minimum_tls_version          = "1.2"

  tags = var.tags
}

# SQL Database
resource "azurerm_mssql_database" "main" {
  name           = "sqldb-${var.project_name}-${var.environment}"
  server_id      = azurerm_mssql_server.main.id
  collation      = "SQL_Latin1_General_CP1_CI_AS"
  license_type   = "LicenseIncluded"
  max_size_gb    = var.sql_db_max_size_gb
  sku_name       = var.sql_db_sku
  zone_redundant = false

  tags = var.tags
}

# SQL Firewall Rule - Allow Azure Services
resource "azurerm_mssql_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_mssql_server.main.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# SQL Firewall Rule - Allow your IP (optional, for development)
resource "azurerm_mssql_firewall_rule" "allow_dev_ip" {
  count            = var.dev_ip_address != "" ? 1 : 0
  name             = "AllowDeveloperIP"
  server_id        = azurerm_mssql_server.main.id
  start_ip_address = var.dev_ip_address
  end_ip_address   = var.dev_ip_address
}

# Function App (Consumption Plan - Serverless)
resource "azurerm_linux_function_app" "main" {
  name                = "func-${var.project_name}-${var.environment}"
  resource_group_name = local.resource_group_name
  location            = local.resource_group_location

  storage_account_name       = azurerm_storage_account.functions.name
  storage_account_access_key = azurerm_storage_account.functions.primary_access_key
  service_plan_id            = azurerm_service_plan.functions.id
  
  builtin_logging_enabled    = false

  site_config {
    application_stack {
      node_version = "18"
    }

    cors {
      allowed_origins     = var.allowed_origins
      support_credentials = false
    }
  }

  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME"       = "node"
    "WEBSITE_NODE_DEFAULT_VERSION"   = "~18"
    "WEBSITE_RUN_FROM_PACKAGE"       = "1"
    
    # SQL Database
    "SQL_SERVER"   = azurerm_mssql_server.main.fully_qualified_domain_name
    "SQL_DATABASE" = azurerm_mssql_database.main.name
    "SQL_USER"     = var.sql_admin_username
    "SQL_PASSWORD" = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.sql_password.id})"
    
    # Blob Storage
    "BLOB_ACCOUNT"            = azurerm_storage_account.main.name
    "BLOB_CONTAINER"          = azurerm_storage_container.events_images.name
    "BLOB_CONNECTION_STRING"  = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.blob_connection_string.id})"
    
    # App Config
    "APP_ENV"   = var.environment
    "LOG_LEVEL" = var.log_level
  }

  identity {
    type = "SystemAssigned"
  }

  tags = var.tags
}

# Key Vault for secrets
resource "azurerm_key_vault" "main" {
  name                        = "kv-${var.project_name}-${var.environment}"
  location                    = local.resource_group_location
  resource_group_name         = local.resource_group_name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false

  sku_name = "standard"

  # Access policy for current user/service principal (Terraform)
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "Get",
      "List",
      "Set",
      "Delete",
      "Purge",
      "Recover"
    ]
  }

  tags = var.tags
}

# Store SQL Password in Key Vault
resource "azurerm_key_vault_secret" "sql_password" {
  name         = "sql-admin-password"
  value        = var.sql_admin_password != "" ? var.sql_admin_password : random_password.sql_admin[0].result
  key_vault_id = azurerm_key_vault.main.id
}

# Store Blob Connection String in Key Vault
resource "azurerm_key_vault_secret" "blob_connection_string" {
  name         = "blob-connection-string"
  value        = azurerm_storage_account.main.primary_connection_string
  key_vault_id = azurerm_key_vault.main.id
}

# Access policy for Function App managed identity (added after Function App is created)
resource "azurerm_key_vault_access_policy" "function_app" {
  key_vault_id = azurerm_key_vault.main.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_linux_function_app.main.identity[0].principal_id

  secret_permissions = [
    "Get",
    "List"
  ]
}

# Data source for current client config
data "azurerm_client_config" "current" {}

# Random password for SQL admin (if not provided)
resource "random_password" "sql_admin" {
  count   = var.sql_admin_password == "" ? 1 : 0
  length  = 32
  special = true
}
