---
name: collect-architecture-context
description: >
  Use when extracting repository architecture, implementation patterns,
  technology stack, boundaries, and conventions in order to later create
  repository-specific rules. Handles architecture mapping, flow tracing,
  pattern discovery, boundary discovery, and convention extraction.
  Do NOT use for implementation, refactoring, code generation, or broad
  speculative redesign.
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Collect Architecture Context
Use this skill to gather repository evidence for later rule creation.

## Workflow
1. Identify analysis scope.
Determine which part of the repository must be analyzed:
- full repository
- app
- package
- feature area
- workflow
- layer
- module group

2. Find real entry points.
Locate:
- app entry points
- renderer and main process entry points
- routes
- state initialization
- service bootstrapping
- IPC boundaries
- persistence boundaries

3. Map repository structure.
Identify:
- apps
- packages
- shared modules
- feature modules
- infrastructure modules
- cross-cutting modules

4. Identify architectural layers actually used.
Determine which layers exist in the codebase.
Examples:
- UI
- hooks
- state
- services
- repositories
- persistence
- IPC
- infrastructure

Do not assume layers without code evidence.

5. Trace representative flows.
Trace 3-5 real flows through the system.
Prefer flows that show how the project is actually built.
Examples:
- UI -> hook -> state -> service -> repository
- renderer -> IPC -> main -> service
- form -> validation -> state -> persistence
- load flow
- save flow

For each flow identify:
- entry point
- layers crossed
- key files
- contracts passed between layers
- side effects

6. Find stable implementation patterns.
Look for repeated patterns in:
- React components
- hooks
- state modules
- services
- repositories
- entities, DTOs, models
- IPC handlers
- validation
- test files
- file naming
- folder structure

Only include patterns that appear repeated or clearly intentional.

7. Identify boundaries and ownership.
Determine:
- what each layer owns
- what modules are allowed to access
- where side effects happen
- where persistence begins
- where IPC boundaries exist
- where business logic lives

8. Extract conventions.
Identify conventions for:
- naming
- file suffixes
- folder naming
- exports
- barrel files
- type location
- test placement
- co-location vs separation

9. Separate inconsistencies.
List patterns that should not become rules.
Mark them as:
- inconsistent
- legacy
- transitional
- unclear ownership
- probable anti-pattern

10. Stop at analysis.
Do not write rules yet.
Do not propose refactors unless required to explain inconsistency.
Do not generate code.

## Output
### Technology Stack
Confirmed technologies and where they are used.

### Repository Structure
Apps, packages, shared modules, and major directories.

### Architectural Layers
Layers that actually exist and their roles.

### Representative Flows
3-5 concrete flows with:
- name
- entry point
- layers crossed
- key files
- contracts
- side effects

### Stable Patterns
Repeated patterns grouped by area:
- UI
- hooks
- state
- services
- repositories
- persistence
- IPC
- testing
- file structure

For each pattern include:
- short name
- description
- evidence
- where it appears
- whether it looks rule-worthy

### Boundaries and Ownership
Layer ownership and important boundaries.

### Naming and Organization Conventions
Actual naming and file organization conventions.

### Inconsistencies and Anti-Patterns
Patterns that should not become rules.

### Candidate Rule Areas
High-level areas that could later become rules.
Do not write the rules yet.

### Open Questions
Unclear areas that need more investigation.

## Quality Bar
Base conclusions on repository evidence.
Prefer concrete files and flows over generic statements.
Mark uncertainty explicitly.
Do not invent architecture that is not present in the codebase.