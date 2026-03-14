---
name: plan
description: >
  Use when defining a technical implementation plan for a specific feature,
  change, bug fix, or workflow update after analysis is complete. Handles
  scope definition, integration planning, contract planning, implementation
  sequencing, risk identification, and test planning. Do NOT use for repository
  exploration, architecture discovery without a concrete change goal, code
  generation, or implementation.
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Plan
Use this skill after analysis and before implementation.

## Workflow
1. Restate the requested change.
Define the expected outcome, affected behavior, and success criteria.

2. Use analysed context.
Base the plan on existing architecture, patterns, constraints, and integration points.
Do not invent a new architecture if an existing pattern already fits.

3. Define scope.
Identify:
- affected layers
- affected modules
- files to modify
- files to create
- existing dependencies to reuse
- boundaries that must remain intact

4. Define the integration approach.
Describe how the change should connect to the current system.
Examples:
- UI change -> state update -> service call
- Redux action -> thunk -> service -> repository
- renderer -> IPC -> main -> service
- entity change -> repository update -> service update

5. Define required contracts.
List the affected or required:
- types
- DTOs
- state shape
- service interfaces
- repository interfaces
- component props
- action payloads
- schema or entity fields

6. Break work into ordered steps.
Each step must represent one logical change.
Prefer steps that can be implemented and reviewed independently.

7. Identify risks and unknowns.
List:
- edge cases
- coupling risks
- migration risks
- backward compatibility risks
- unclear dependencies
- unresolved contracts

8. Define test scope.
Specify which behaviors must be tested, updated, or regression-checked.
Do not write tests.

9. Stop at planning.
Do not generate code.
Do not mix planning with implementation.

## Output
### Summary
What must change.

### Scope
Affected layers, modules, files, and boundaries.

### Integration Approach
How the change should fit into the existing system.

### Contracts
Types, interfaces, payloads, state, DTOs, schemas, or entities affected.

### Steps
Ordered implementation steps.

### Risks and Unknowns
Technical risks, ambiguities, and compatibility concerns.

### Test Scope
What must be verified by tests.