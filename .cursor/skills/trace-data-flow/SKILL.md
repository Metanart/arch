---
name: trace-data-flow
description: >
  Use when tracing how data moves through the application from persistence,
  external API, or backend source to state, transformation layers, and final UI
  rendering. Handles source discovery, contract tracing, transformation mapping,
  state-flow tracing, and render-path analysis. Do NOT use for implementation,
  refactoring, or broad repository architecture review.
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Trace Data Flow
Use this skill to trace a concrete data path through the system.

## Workflow
1. Define the target data.
Identify exactly what data must be traced:
- entity
- DTO
- model
- response payload
- field group
- UI view data
- derived data

2. Find the data source.
Locate where the data first enters the application flow:
- database query
- repository method
- backend service
- API endpoint
- IPC response
- local storage
- external integration

3. Find the first application boundary.
Identify where raw source data is first consumed:
- repository
- service
- loader
- thunk
- query function
- IPC handler
- state initialization

4. Trace all transformations.
Follow the data through each transformation step.
Look for:
- mapping
- normalization
- filtering
- sorting
- enrichment
- validation
- aggregation
- derived fields
- shape changes

For each step identify:
- input shape
- output shape
- why the transformation exists
- where it happens

5. Trace state flow.
Identify whether the data is:
- stored in state
- derived from state
- passed through props
- accessed through hooks
- memoized
- selected through selectors
- re-fetched on demand

6. Trace the render path.
Follow how the data reaches the UI:
- selector
- hook
- container
- component props
- presentation component
- conditional rendering
- list rendering
- final rendered fields

7. Identify contracts between layers.
List the data contracts used at each boundary:
- entity
- DTO
- API response
- state shape
- selector output
- component props
- view model

8. Identify side effects and dependencies.
Note where the flow depends on:
- async fetches
- cache
- pagination
- lazy loading
- user interaction
- IPC
- persistence writes
- feature flags
- permissions

9. Identify breakpoints and risks.
Highlight:
- hidden transformations
- duplicated mapping
- unclear ownership
- over-fetching
- under-typed boundaries
- stale data risks
- coupling between layers

10. Stop at tracing.
Do not propose refactors unless explicitly requested.
Do not generate code.
Focus on the actual path used by the repository.

## Output
### Data Target
What data is being traced.

### Source
Where the data originates.

### End-to-End Flow
Step-by-step path from source to rendered UI.

### Transformations
All important shape changes and derived-data steps.

### State Flow
How the data is stored, derived, selected, or passed.

### Render Path
How the data reaches the final components.

### Contracts
Data shapes used between layers.

### Key Files
Most relevant files and their roles.

### Risks and Ambiguities
Unclear, duplicated, fragile, or inconsistent parts of the flow.