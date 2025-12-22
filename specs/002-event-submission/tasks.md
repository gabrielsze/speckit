---

description: "Tasks for Event Submission Page feature"
---

# Tasks: Event Submission Page

**Input**: Design documents from `/specs/002-event-submission/`
**Prerequisites**: plan.md (required), spec.md (required), research.md

**Tests**: Not explicitly requested; focus on independently testable story criteria.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize environment and scaffold structure

- [x] T001 Create environment example file at .env.example
- [x] T002 [P] Add SQL driver dependency (`mssql`) in package.json
- [x] T003 [P] Add Azure Blob dependency (`@azure/storage-blob`) in package.json
- [x] T004 [P] Add validation dependency (`zod`) in package.json
- [x] T005 Scaffold API functions directory at api/events/submit/index.ts
- [x] T006 Scaffold image upload API directory at api/events/upload-image/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required before any user story

**CRITICAL**: User story work starts only after this phase completes

- [x] T007 Create SQL connection utility in lib/db.ts
- [x] T008 [P] Create Blob client helper in lib/blob.ts
- [x] T009 [P] Create validation schema module in lib/validation.ts
- [x] T010 Create database schema script for `submitted_events` at db/schema.sql
- [x] T011 Add `SubmittedEvent` type to types/index.ts
- [x] T012 Create server-side config loader for env vars in lib/config.ts
- [x] T013 [P] Add default placeholder image at public/images/placeholder-event.png

**Checkpoint**: Foundation ready — user stories can start in parallel

---

## Phase 3: User Story 1 — Submit New Event (Priority: P1) 🎯 MVP

**Goal**: Submit event details and persist to database

**Independent Test**: Fill form and submit; verify DB save and success confirmation

### Implementation for User Story 1

- [x] T014 [P] [US1] Implement `EventSubmissionService` to persist events in lib/services/eventSubmission.ts
- [x] T015 [US1] Implement POST handler for submission in api/events/submit/index.ts
- [x] T016 [US1] Build submission form UI in app/submit/page.tsx (title, description, date, time, location, category)
- [x] T017 [US1] Wire client to POST `process.env.NEXT_PUBLIC_API_BASE` + `/events/submit` in app/submit/page.tsx
- [x] T018 [US1] Show success confirmation with returned `id` in app/submit/page.tsx
- [x] T019 [P] [US1] Add "Submit an Event" link to navigation in components/Navigation.tsx

**Checkpoint**: US1 fully functional and testable independently

---

## Phase 4: User Story 2 — Form Validation & Errors (Priority: P2)

**Goal**: Client/server validation; error messages; prevent invalid submissions

**Independent Test**: Attempt invalid submissions and verify errors block submission

### Implementation for User Story 2

- [x] T020 [P] [US2] Implement zod validation schema for form fields in lib/validation.ts
- [x] T021 [US2] Add inline error messages and field-level validation in app/submit/page.tsx
- [x] T022 [US2] Enforce "date not in past" rule in app/submit/page.tsx
- [x] T023 [US2] Add server-side validation before insert in api/events/submit/index.ts
- [x] T024 [US2] Disable submit button during request to prevent duplicates in app/submit/page.tsx
- [x] T025 [US2] Preserve form data on failure and focus first error in app/submit/page.tsx

**Checkpoint**: US2 works independently (errors displayed; submission blocked on invalid input)

---

## Phase 5: User Story 3 — Contact Info Capture (Priority: P3)

**Goal**: Optional contact fields saved with event

**Independent Test**: Submit with and without contact info; verify persistence

### Implementation for User Story 3

- [x] T026 [P] [US3] Add contact fields (email, phone, website) to form in app/submit/page.tsx
- [x] T027 [US3] Map optional contact fields in client request in app/submit/page.tsx
- [x] T028 [US3] Persist contact fields in service layer in lib/services/eventSubmission.ts
- [x] T029 [US3] Validate email/URL formats server-side in api/events/submit/index.ts

**Checkpoint**: US3 independently functional; optional fields handled correctly

---

## Phase 6: User Story 4 — Image Upload (Priority: P3)

**Goal**: Upload image and associate URL with event

**Independent Test**: Submit with/without image; verify URL saved and placeholder used

### Implementation for User Story 4

- [x] T030 [P] [US4] Implement Blob upload helper functions in lib/blob.ts
- [x] T031 [US4] Implement POST handler for image upload in api/events/upload-image/index.ts
- [x] T032 [US4] Add file input and client upload logic in app/submit/page.tsx
- [x] T033 [US4] Persist returned `imageUrl` alongside event in lib/services/eventSubmission.ts
- [x] T034 [US4] Use placeholder image when no upload provided in app/submit/page.tsx

**Checkpoint**: US4 independently functional; image uploads and fallbacks work

---

## Final Phase: Polish & Cross-Cutting

**Purpose**: Improvements across stories and documentation

- [ ] T035 [P] Update documentation with API usage and env vars in README.md
- [ ] T036 [P] Accessibility: ensure labels, aria-invalid, keyboard/focus management in app/submit/page.tsx
- [ ] T037 Add correlation id and basic logging in api/events/submit/index.ts
- [ ] T038 Add loading states and error boundaries in app/submit/page.tsx
- [ ] T039 Performance: ensure minimal client bundle and avoid unnecessary dependencies
- [ ] T040 Security review: confirm no secrets leak; update docs/audit.md
- [ ] T041 [P] Ensure category options sourced consistently from data/categories.ts

---

## Dependencies & Execution Order

**Phase Dependencies**
- Setup → Foundational → User Stories → Polish (sequential)
- User stories begin only after Foundational completes

**User Story Dependencies**
- US1 (P1): No dependencies on other stories
- US2 (P2): Depends on Foundational; independent of US1 but integrates client UI
- US3 (P3): Depends on Foundational; independent of US1/US2
- US4 (P3): Depends on Foundational; independent of US1/US2

**Within Story Order**
- Models/types → Services → Endpoints → UI integration

**Parallel Opportunities**
- Setup: T002–T004
- Foundational: T008–T009, T013
- US1: T014, T019
- US2: T020
- US3: T026
- US4: T030
- Polish: T035, T036, T041

---

## Parallel Examples per Story

**US1**
- Parallel: Implement service (lib/services/eventSubmission.ts) and navigation link (components/Navigation.tsx)

**US2**
- Parallel: Validation schema (lib/validation.ts) while UI error messaging (app/submit/page.tsx)

**US3**
- Parallel: Add form fields (app/submit/page.tsx) while mapping persistence (lib/services/eventSubmission.ts)

**US4**
- Parallel: Blob helper (lib/blob.ts) while API handler (api/events/upload-image/index.ts)

---

## Implementation Strategy

**MVP First (US1 only)**
- Complete Setup and Foundational, then implement US1; stop and validate independently

**Incremental Delivery**
- Add US2 → validate independently
- Add US3 → validate independently
- Add US4 → validate independently

