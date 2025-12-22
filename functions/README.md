# Azure Functions for Eventure

Node.js 18 Azure Functions for event submission and image upload.

## Local Setup

```bash
cd functions
npm install
npm run build
npm start
```

This starts the Functions runtime locally at `http://localhost:7071/api/`

## Environment Variables

Create `local.settings.json` with:
```json
{
  "Values": {
    "SQL_SERVER": "sql-eventure-dev.database.windows.net",
    "SQL_DATABASE": "sqldb-eventure-dev",
    "SQL_USER": "sqladmin",
    "SQL_PASSWORD": "...",
    "BLOB_CONNECTION_STRING": "DefaultEndpointsProtocol=https;...",
    "BLOB_CONTAINER": "events-images"
  }
}
```

Or copy from root `.env.local`:
```bash
grep "SQL_\|BLOB_" ../.env.local
```

## Deployment

### Option 1: Using Azure CLI (Recommended)
```bash
# Login to Azure
az login

# Build
npm run build

# Deploy
npm run deploy
```

### Option 2: Using VS Code Azure Functions Extension
1. Install "Azure Functions" extension
2. Sign in to Azure
3. Right-click Functions folder → Deploy to Function App
4. Select `func-eventure-dev`

## API Endpoints

### POST /api/events/submit
Submit a new event.

**Request:**
```json
{
  "title": "Tech Conference 2025",
  "description": "Annual tech conference",
  "event_date": "2025-06-15",
  "start_time": "09:00:00",
  "end_time": "17:00:00",
  "location": "Convention Center",
  "category": "Technology",
  "contact_email": "organizer@example.com",
  "contact_phone": "+1234567890",
  "website": "https://example.com",
  "image_url": "https://..."
}
```

**Response:**
```json
{
  "id": "uuid-here",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

### POST /api/events/upload-image
Upload event image to Blob Storage.

**Request:** multipart/form-data with `file` field

**Response:**
```json
{
  "url": "https://eventuredevsa.blob.core.windows.net/events-images/...",
  "filename": "uuid.jpg"
}
```

## Testing

Test locally with curl:

```bash
# Submit event
curl -X POST http://localhost:7071/api/events/submit \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "Test",
    "event_date": "2025-02-01",
    "start_time": "14:00:00",
    "location": "Test Location",
    "category": "Test"
  }'

# Upload image (local testing only, use multipart)
curl -X POST http://localhost:7071/api/events/upload-image \
  -F "file=@path/to/image.jpg"
```

## Troubleshooting

- **Connection timeout**: Check firewall rules in SQL Server
- **Auth errors**: Verify credentials in `local.settings.json`
- **Blob errors**: Check connection string and container exists
- **CORS errors**: Check Function App CORS settings in Azure Portal

## Cost

- **Consumption Plan Y1**: ~$0-2/month (dev)
- **Storage**: ~$0.50/month for images
- **SQL Database**: $4.99/month (Basic)

**Total monthly**: ~$5-7 (dev)
