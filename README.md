git clone <repository-url>
npm run dev
# Eventure - Modern Event Registration Website

A Next.js 14 site with event discovery, user submissions, and an Azure-backed API layer (Azure Functions, Azure SQL, Azure Storage) provisioned via Terraform.

## 🎯 Features

- Landing page with featured events (max 6)
- Event discovery with category/price filters, search, and sorting
- FAQ page with accordion experience
- Event submission page (`/submit`) with dark-mode styling and validation
- Backend APIs (Azure Functions v4, Node.js) that write to Azure SQL and upload images to Azure Blob Storage

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **APIs**: Azure Functions v4 (JavaScript, `@azure/functions`)
- **Data**: Azure SQL Database (`submitted_events` table), Azure Blob Storage (`events-images` container)
- **IaC**: Terraform (azurerm) provisioning storage, SQL, Functions, Key Vault

## 📋 Prerequisites

- Node.js 20.9.0+ for both Next.js app and Azure Functions
- npm (latest)
- Azure CLI (authenticated with `az login`) for managed identity support
- Azure Functions Core Tools v4 (for API deployment/debugging)
- Terraform CLI (if provisioning infra)

## 🛠️ Quickstart (Frontend)

```bash
git clone <repository-url>
cd speckit
npm install

# Set API base (dev Function App) in .env.local
echo "NEXT_PUBLIC_API_BASE=https://func-eventure-dev.azurewebsites.net/api" > .env.local

npm run dev
# Open http://localhost:3000
```

## 🔌 API Endpoints (Azure Functions)

- POST `/api/events/submit` — Inserts an event into Azure SQL using managed identity authentication. Expects snake_case fields: `title`, `description`, `event_date`, `start_time`, `end_time?`, `location`, `category`, `contact_email?`, `contact_phone?`, `website?`, `image_url?`.
- POST `/api/events/upload-image` — Uploads an image to Blob Storage using managed identity authentication; returns `imageUrl`.

Sources: functions/submitEvent.js, functions/uploadImage.js, entrypoint functions/index.js.

**Authentication**: Both endpoints use Azure Managed Identity with Entra ID (no passwords or connection strings needed).

## 🌐 Environment Variables

Frontend (.env.local):
- `NEXT_PUBLIC_API_BASE` — Base URL of the Function App (e.g., `https://func-eventure-dev.azurewebsites.net/api`).

Functions (App Settings) - **Passwordless with Managed Identity**:
- `SQL_SERVER`, `SQL_DATABASE` — Database connection details (no username/password needed)
- `BLOB_ACCOUNT`, `BLOB_CONTAINER=events-images` — Storage details (no connection string needed)
- `FUNCTIONS_WORKER_RUNTIME=node`, `WEBSITE_NODE_DEFAULT_VERSION=~20`

Authentication uses Azure Managed Identity with tokens automatically acquired from Entra ID.

For local development: Authenticate with `az login` and Azure CLI credentials are used automatically.

Database schema: db/schema.sql (table `submitted_events` with time columns).

## 🏗️ Infrastructure (Terraform)

Terraform under terraform/ provisions:
- Storage accounts (events images + Function App storage)
- Azure SQL Server + Database (Basic tier) with Entra ID authentication
- App Service plan (Y1) + Function App (Node 20 runtime)
- System-assigned managed identity with RBAC role assignments
- Storage Blob Data Contributor role for Function App
- SQL Server firewall rules

**Note**: SQL AAD user must be created manually after Terraform applies (see `db/setup-aad-user.sql`).

Usage (baseline):
```bash
cd terraform
terraform init
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```
Outputs map to Function App settings and .env.local.

## 🧪 Testing

- Type checks: `npm run type-check`
- Lint: `npm run lint`
- Manual: submit via `/submit` with valid and invalid data; verify success ID and DB insert. Test image upload flow if using `/api/upload-image`.

## 📝 Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "type-check": "tsc --noEmit"
}
```

## 🚨 Known Issues & Notes

- Frontend expects the Function App URL in `NEXT_PUBLIC_API_BASE` (no relative API routes in production static export).
- **Both frontend and Functions use Node 20+** for compatibility with Azure SDK requirements.
- Image uploads require valid MIME and size limits (see functions/uploadImage.js).
- Azure SQL AAD user creation requires manual setup after Terraform (see `db/setup-aad-user.sql`).
- Local development requires Azure CLI authentication (`az login`).

## 📁 Project Structure (abridged)

```
app/                 # Next.js pages (landing, events, faq, submit)
components/          # UI components
functions/           # Azure Functions (v4 JS) entry + handlers
terraform/           # IaC for storage, SQL, Functions, Key Vault
db/schema.sql        # submitted_events table definition
specs/002-event-submission/  # Specs/plan for submission feature
```

## 🤝 Contributing

- Keep secrets out of the repo; use Azure App Settings/Key Vault.
- Update specs/002-event-submission docs when changing submission or API behavior.
- Validate `/submit` end-to-end (form → Functions → SQL) after backend changes.

---

**Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and Azure Functions**
