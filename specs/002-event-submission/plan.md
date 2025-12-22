# Implementation Plan: Event Submission Page

**Feature**: 002-event-submission  
**Date**: 2025-12-22  
**Architecture**: Static export (Next.js `output: 'export'`) + Serverless APIs

## Overview
This plan delivers a submission page in a static Next.js site that posts to serverless APIs (Azure Functions or Azure Static Web Apps API) to persist events in Azure SQL and upload images to Azure Blob Storage. The static site remains exportable; all server-side work is in the API layer.

## High-Level Phases

1. Phase 0 — Foundations
- Confirm static export constraints (`next.config.js` has `output: 'export'`) ✓
- Choose serverless API hosting (Azure Functions or Azure Static Web Apps)
- Define environment variable names and secrets strategy
- Create repo structure for API functions (e.g., `/api/` folder)

2. Phase 1 — UI: Submission Page
- Add `app/submit/page.tsx` with accessible form
- Client-side validation (required fields, formats)
- Category dropdown from existing data source
- Preserve form data on submission errors

3. Phase 2 — API: Event Submission
- Create serverless function `POST /events/submit`
- Validate payload server-side
- Insert into Azure SQL (`submitted_events` table)
- Return `{ id, createdAt }` on success; structured errors on failure

4. Phase 3 — API: Image Upload
- Create serverless function `POST /events/upload-image`
- Validate MIME/type/size
- Upload to Azure Blob Storage; return `{ imageUrl }`
- Support anonymous uploads for POC; tighten later

5. Phase 4 — Client Integration
- Wire form to call image upload (optional) then event submission
- On success, show confirmation and optionally redirect to events listing
- Make new submissions immediately visible (list reads include new rows)

6. Phase 5 — Non-Functional & Polish
- Basic server-side logging and correlation id
- Error messaging and retry guidance on client
- Accessibility checks and performance sanity

7. Phase 6 — Deployment & Config
- Provision Azure resources (SQL, Blob, Functions)
- Configure environment variables per environment
- Document endpoints and secrets handling

## Deliverables per Phase

- Phase 0: `research.md` finalized, API folder scaffold, env var names
- Phase 1: `app/submit/page.tsx` with form and validation
- Phase 2: `api/events/submit` function + SQL insert
- Phase 3: `api/events/upload-image` function + Blob upload
- Phase 4: Client integration and success flow
- Phase 5: Logs and error handling improvements
- Phase 6: Deployment scripts and config docs

## API Endpoints & Contracts

### POST /events/submit
- Purpose: Persist submitted event to Azure SQL
- Request (JSON):
```json
{
  "title": "string",
  "description": "string",
  "eventDate": "YYYY-MM-DD",
  "startTime": "HH:mm",
  "endTime": "HH:mm?",
  "location": "string",
  "category": "string",
  "contactEmail": "string?",
  "contactPhone": "string?",
  "website": "string?",
  "imageUrl": "string?"
}
```
- Response 200 (JSON): `{ "id": "string", "createdAt": "ISO8601" }`
- Errors:
  - 400: Validation errors `{ fieldErrors: Record<string,string> }`
  - 500: Insert failed `{ code: "SQL_INSERT_FAILED", message: "..." }`

### POST /events/upload-image
- Purpose: Upload image to Blob Storage and return URL
- Request: `multipart/form-data` with `file`
- Response 200 (JSON): `{ "imageUrl": "string" }`
- Errors:
  - 400: Invalid type/size `{ code: "INVALID_FILE", message: "..." }`
  - 503: Storage timeout `{ code: "STORAGE_TIMEOUT", message: "..." }`

## Environment Variables (Server-side only)

- SQL:
  - `SQL_SERVER` — hostname
  - `SQL_DATABASE` — database name
  - `SQL_USER` — username
  - `SQL_PASSWORD` — password (secure)
  - `SQL_ENCRYPT` — `true`
- Blob:
  - `BLOB_ACCOUNT` — storage account name
  - `BLOB_CONTAINER` — container name (e.g., `events-images`)
  - `BLOB_CONNECTION_STRING` or `BLOB_SAS_TOKEN` — auth (secure)
- General:
  - `APP_ENV` — `development` | `production`
  - `LOG_LEVEL` — `info` | `debug`

Notes:
- Secrets live in platform config (Azure), not in repo.
- Client bundle must not read any of the above directly.

## Database Schema (POC)

Table: `submitted_events`

| Column        | Type         | Notes                          |
|---------------|--------------|---------------------------------|
| `id`          | `uniqueid`   | PK (GUID/UUID)                 |
| `title`       | `nvarchar(200)` | required                     |
| `description` | `nvarchar(2000)` | required                    |
| `event_date`  | `date`       | required                        |
| `start_time`  | `time`       | required                        |
| `end_time`    | `time`       | optional                        |
| `location`    | `nvarchar(300)` | required                     |
| `category`    | `nvarchar(100)` | required                     |
| `contact_email` | `nvarchar(254)` | optional                   |
| `contact_phone` | `nvarchar(32)`  | optional                   |
| `website`     | `nvarchar(300)` | optional                      |
| `image_url`   | `nvarchar(500)` | optional                      |
| `created_at`  | `datetimeoffset` | default `sysdatetimeoffset()` |

POC rule: allow duplicates; no unique constraints across title/date/location.

## Client UX Flow

1. User opens `/submit` and fills form
2. Optional: Upload image → receive `imageUrl`
3. Submit event → POST `/events/submit`
4. Success: Confirmation with event id; listing includes new event
5. Failure: Show error; keep form data; allow retry

## Static Export Considerations

- Next.js static export means no in-project API routes are available in production
- Use Azure Functions or Azure Static Web Apps API for serverless endpoints
- Client calls fully-qualified API URLs (configured per environment)

## Testing & Validation

- Unit: Client validation functions
- Integration: API functions (mocked SQL/Blob clients)
- E2E (manual): Submit with/without image; error cases;
- Accessibility: Form labels, focus management, keyboard navigation

## Risks & Mitigations

- Secret exposure → enforce server-side only usage; review build for leaks
- Static/site mismatch → ensure deployment supports functions (SWAs or Functions + frontend)
- SQL connectivity → `encrypt=true`, firewall rules, limited user privileges
- Blob hotlinks → SAS or public container depending on POC needs

## Timeline (POC)

- Phase 0: 0.5 day
- Phase 1: 0.5 day
- Phase 2: 1 day
- Phase 3: 0.5 day
- Phase 4: 0.5 day
- Phase 5: 0.5 day
- Phase 6: 0.5 day

Total: ~4 days

## Acceptance Criteria Mapping

- SC-001/004: UX timing validated with test submissions
- SC-003: DB insert success ≥95% under normal conditions
- SC-006: No secrets in client bundle; input sanitization
- SC-007: Upload performance verified (≤5s for 5MB)

---
**Status**: Ready to break down into tasks.md and start implementation.
