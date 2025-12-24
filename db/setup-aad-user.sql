-- Setup Azure AD User for Function App Managed Identity
-- Run this script after Terraform provisioning to grant the Function App access to SQL Database
-- 
-- Prerequisites:
-- 1. Terraform has been applied successfully
-- 2. You have the Function App's managed identity name (from Terraform output)
-- 3. You are connected to the SQL Database as an Azure AD admin
--
-- Replace {FUNCTION_APP_NAME} with your actual Function App name
-- Example: func-eventure-dev

-- Create user from the Function App's managed identity
CREATE USER [func-eventure-dev] FROM EXTERNAL PROVIDER;
GO

-- Grant db_owner role (gives full permissions)
ALTER ROLE db_owner ADD MEMBER [func-eventure-dev];
GO

-- OR for more restricted permissions (recommended for production):
-- ALTER ROLE db_datareader ADD MEMBER [func-eventure-dev];
-- ALTER ROLE db_datawriter ADD MEMBER [func-eventure-dev];
-- ALTER ROLE db_ddladmin ADD MEMBER [func-eventure-dev];
-- GO

-- Verify the user was created
SELECT name, type_desc, authentication_type_desc 
FROM sys.database_principals 
WHERE name = 'func-eventure-dev';
GO
