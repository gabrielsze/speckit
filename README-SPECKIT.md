# Speckit Workflow Documentation

This project was used to experiment with a lightweight specification + planning assistant ("Speckit") inside GitHub/VS Code. This README explains how the Speckit structure in this repo is organized, how to extend it, and recommended best practices when collaborating.

## Purpose
Speckit provides a structured, text-first way to:
- Capture a product constitution (guiding principles)
- Author feature-level specs and keep them versioned
- Break work into phased plans and atomic tasks
- Maintain data models and component contracts
- Record research decisions and rationale

## Directory Overview
```
.specify/                     # Speckit memory store (constitution + active spec refs)
specs/
  001-event-registration-website/
    spec.md                  # Core feature specification (POC scope)
    plan.md                  # Multi-phase implementation plan
    tasks.md                 # 49 task breakdown + completion state
    research.md              # Technical decisions & tradeoffs
    data-model.md            # Entity/interface definitions
    contracts/components.md  # Component contracts (props, behaviors)
    quickstart.md            # Developer environment & setup notes
```

## File Roles
- constitution.md: Foundational principles (performance, accessibility, static-first, etc.)
- spec.md: User stories, acceptance criteria, edge cases
- plan.md: Phased roadmap (Setup → Foundational → User Stories → Polish)
- tasks.md: Atomic, checkable tasks with test criteria
- data-model.md: Source of truth for types/interfaces
- contracts/components.md: Prop-level contracts for UI pieces
- research.md: Decisions (e.g., static export, no DB, Tailwind, Next.js App Router)
- quickstart.md: Onboarding instructions for new contributors

## Recommended Workflow
1. Define/Update Constitution → Ensure project principles still apply.
2. Draft/Refine spec.md → Keep POC vs Production scope clear.
3. Break spec into phases in plan.md → Each phase ends in a tangible milestone.
4. Expand tasks.md → Tasks must be testable and independently verifiable.
5. Implement tasks sequentially → Update tasks.md as each completes (no batching).
6. Record deviations or pivots in research.md → Preserve reasoning for future maintainers.
7. Keep data-model.md and contracts/components.md synchronized with actual code.

## Task Hygiene Guidelines
- Each task should move codebase from one stable state to another.
- Prefer verbs and outcomes ("Add SearchBar component", not just "SearchBar").
- Mark partial implementations explicitly (e.g., PARTIAL, SKIPPED, BLOCKED) with reasons.
- Include test criteria at phase level for quick validation.

## Extending Speckit
Add new feature folder under `specs/` with incremented numeric prefix:
```
specs/
  002-some-new-feature/
    spec.md
    plan.md
    tasks.md
    data-model.md   (if new entities)
    contracts/      (component or API contracts)
```
Then reference the new spec in `.specify/memory/constitution.md` or a central index if you maintain one.

## Collaboration Best Practices
- Avoid editing historical decision files (research.md) retroactively—append instead.
- Never silently remove tasks; mark superseded tasks as REPLACED and link the new task ID.
- Keep PRs scoped to a small set of related tasks for easy review.
- Cross-link implementation commits to task IDs (e.g., commit message: `feat: T034 integrate SearchBar with events page`).

## Suggested Commit Message Format
```
feat: T026 render full events grid
fix: T030 adjust category badge colors
docs: update plan.md Phase 3 summary
chore: add .gitignore entries for build artifacts
```

## Lifecycle Checkpoints
| Stage | Artifact | Exit Criteria |
|-------|----------|---------------|
| Spec Draft | spec.md | User stories & acceptance criteria defined |
| Planning | plan.md | Phases justify sequencing & risk mitigation |
| Tasking | tasks.md | All tasks trace to user stories or polish goals |
| Implementation | code + tasks.md | Tasks toggled to [x] only after validation |
| Polish | audit docs | Accessibility & performance baseline recorded |

## Audit & Traceability
To audit progress:
1. Scan `tasks.md` for unchecked items or BLOCKED notes.
2. Cross-reference with implementation summary (`docs/IMPLEMENTATION_SUMMARY.md`).
3. Confirm data-model interfaces exist in `types/` and are still correct.
4. Review `contracts/components.md` for drift vs actual component props.

## Adding Automation (Optional Ideas)
- Pre-commit hook verifying task ID in commit message.
- Script to compute completion % and inject into tasks.md.
- CI job parsing spec/plan to fail if orphan tasks exist (tasks without story linkage).

## FAQ
**Q: Should I delete old specs?**  
No—version them with date stamps or suffixes (e.g., `spec.v2.md`).

**Q: How do I handle scope changes mid-implementation?**  
Append a "Scope Change" section to `research.md` and update affected tasks with a note.

**Q: Can tasks span multiple PRs?**  
Avoid it. If required, split the task into smaller sub-tasks.

## Next Steps
- Introduce a root `SPEC_INDEX.md` for multi-feature repos.
- Add JSON export summarizing tasks for automated dashboards.
- Integrate a simple CLI (`bin/speckit`) to list tasks by status.

---
**Speckit Workflow Status**: Stable for this POC; production hardening would add validation scripts and CI guards.
