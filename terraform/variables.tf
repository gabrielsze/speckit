variable "subscription_id" {
  description = "Azure subscription ID where resources will be created"
  type        = string

  validation {
    condition     = can(regex("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$", var.subscription_id))
    error_message = "Subscription ID must be a valid GUID format."
  }
}

variable "project_name" {
  description = "Project name prefix for all resources"
  type        = string
  default     = "eventure"

  validation {
    condition     = length(var.project_name) <= 10 && can(regex("^[a-z][a-z0-9]*$", var.project_name))
    error_message = "Project name must be lowercase alphanumeric, start with letter, max 10 chars."
  }
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "eastus"
}

variable "use_existing_resource_group" {
  description = "Whether to use an existing resource group instead of creating a new one"
  type        = bool
  default     = false
}

variable "existing_resource_group_name" {
  description = "Name of existing resource group (required if use_existing_resource_group = true)"
  type        = string
  default     = ""

  validation {
    condition     = var.use_existing_resource_group == false || var.existing_resource_group_name != ""
    error_message = "existing_resource_group_name must be provided when use_existing_resource_group is true."
  }
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "Eventure"
    ManagedBy   = "Terraform"
    Environment = "dev"
  }
}

# Storage Account
variable "storage_replication_type" {
  description = "Storage replication type (LRS, GRS, RAGRS, ZRS)"
  type        = string
  default     = "LRS"
}

# SQL Server
variable "sql_admin_username" {
  description = "SQL Server administrator username"
  type        = string
  default     = "sqladmin"
}

variable "sql_admin_password" {
  description = "SQL Server administrator password (leave empty to auto-generate)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "sql_db_sku" {
  description = "SQL Database SKU (Basic, S0, S1, P1, etc.)"
  type        = string
  default     = "Basic"
}

variable "sql_db_max_size_gb" {
  description = "SQL Database max size in GB"
  type        = number
  default     = 2
}

# CORS / Security
variable "allowed_origins" {
  description = "Allowed CORS origins for API and Blob Storage"
  type        = list(string)
  default     = ["http://localhost:3000", "http://localhost:3001"]
}

variable "dev_ip_address" {
  description = "Developer IP address for SQL firewall (leave empty to skip)"
  type        = string
  default     = ""
}

# Logging
variable "log_level" {
  description = "Application log level"
  type        = string
  default     = "info"

  validation {
    condition     = contains(["debug", "info", "warn", "error"], var.log_level)
    error_message = "Log level must be debug, info, warn, or error."
  }
}
