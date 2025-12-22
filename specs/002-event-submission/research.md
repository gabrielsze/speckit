# Research: Event Submission Page

**Feature**: 002-event-submission  
**Date**: 2025-12-22  
**Phase**: 0 - Research & Decision Documentation

## Overview
This document captures implementation-level decisions and technical guidance for the Event Submission Page feature. The `spec.md` remains technology-agnostic and focused on user value; technical details and rationale are recorded here for engineers.

## 1. Security & Secrets Management

**Decision**: Use environment-specific secure configuration for credentials.
- Store Azure SQL connection string in environment variables (e.g., Azure App Service/App Config)  
- Store Azure Blob Storage credentials/sas tokens in environment variables  
- Never expose secrets in client-side code or commit to source control  
- Rotate credentials and restrict scopes (principle of least privilege)

**Rationale**: Aligns with twelve-factor app methodology, simplifies POC deployment, and keeps secrets out of source. Future evolution can adopt Azure Key Vault and Managed Identity for passwordless auth.

**Alternatives Considered**:
- Azure Key Vault integration (higher security, more setup)  
- Managed Identity to Azure SQL (best security, requires Azure AD integration)

## 2. Storage Architecture (Images)

**Decision**: Use Azure Blob Storage for image uploads; persist blob URL in database.
- Container: `events-images` (private or public depending on needs)  
- Enforce max size (5MB) and allowed types (JPEG/PNG/WebP)  
- Generate unique filenames (UUID + timestamp)  
- Validate MIME type server-side before upload  
- Optionally use SAS for controlled upload if needed

**Rationale**: Static site architecture and scalability favor object storage over filesystem. Blob Storage provides durable, cost-effective storage with CDN integration options.

**Failure Modes & Handling**:
- Upload timeout → return 503 with retry guidance
- Invalid file type/size → 400 with validation errors
- Storage auth fail → 401/403 and log securely

## 3. Static Site API Organization

**Decision**: Segment API endpoints by domain; keep logic separate from UI.
- Endpoints:  
  - POST `/api/events/submit` → validate, persist to Azure SQL, return event id  
  - POST `/api/events/upload-image` → validate, upload to Blob Storage, return blob URL  
- Conventions: RESTful verbs, clear naming, JSON request/response
- Structure: Group related endpoints under feature domain directories
- Documentation: Define request/response schemas and error codes per endpoint

**Rationale**: Improves maintainability, discoverability, and reduces coupling in a static site.

## 4. Data Model Notes

- `SubmittedEvent` includes: id, title, description, eventDate, startTime, endTime?, location, category, contactEmail?, contactPhone?, website?, imageUrl?, createdAt  
- Immediate visibility (POC): New rows are queryable by listings with `createdAt` descending  
- Duplication (POC): No uniqueness constraints across title/date/location; future can add soft duplicate detector

## 5. Observability (Deferred for POC)

- Basic server-side logging of failures (submission, upload)  
- Correlation id per request for tracing (UUID)  
- Future: App Insights/Log Analytics integration

## 6. Future Hardening Path

- Migrate secrets to Azure Key Vault  
- Adopt Managed Identity for SQL access  
- Add moderation workflow and status transitions  
- Add duplicate detection (Levenshtein on title + same day/location)

---
**Status**: Ready to inform `plan.md` and implementation.
