---
name: implement
description: >
  Use when implementing a specific feature, bug fix, refactor, or scoped
  workflow change after analysis or planning is complete. Handles code changes,
  integration into existing layers, state wiring, persistence wiring, IPC
  wiring, and required test updates. Do NOT use for repository exploration,
  architecture discovery, broad technical planning, or speculative design.
---

# Implement
Use this skill to apply a defined change in the existing repository.

## Workflow
1. Restate the change.
Define the required behavior, scope, and success criteria.

2. Use existing context.
Use prior analysis, plan, repository patterns, and existing integration points.
Do not re-open broad exploration if the target path is already known.

3. Confirm target layers.
Identify which layers must change:
- UI
- state
- application
- persistence
- Electron renderer
- Electron main
- infrastructure adapter

4. Confirm target files.
List the files to modify and files to create.
Keep changes scoped to the required path.

5. Implement from boundaries inward.
Apply the change through the existing system flow.
Examples:
- component -> hook -> state -> service
- action -> thunk -> service -> repository
- renderer -> IPC -> main -> service
- service -> repository -> database

6. Reuse existing patterns.
Match existing module shape, naming, contracts, and integration flow.
Prefer extending current abstractions over introducing new ones.

7. Wire required contracts.
Update only the contracts required by the change:
- types
- DTOs
- props
- payloads
- entity fields
- repository signatures
- service interfaces
- state shape

8. Update tests required by the change.
Add or update tests for changed behavior, integration paths, and regressions in scope.

9. Stop at implementation.
Do not expand into unrelated refactoring.
Do not broaden the scope beyond the requested change.

## Output
### Summary
What was implemented.

### Files
Files created and modified.

### Integration
How the change connects to existing layers.

### Implementation
Code required for the change.

### Tests
Tests added or updated.