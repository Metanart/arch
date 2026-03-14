---
name: create-tests
description: >
  Use when creating or updating tests for an existing feature, module, service,
  state flow, persistence layer, or IPC flow in a TypeScript application using
  Vitest. Handles test-surface identification, test-case selection, dependency
  isolation, and test generation for React, Redux Toolkit, services, TypeORM,
  and Electron flows. Do NOT use for implementation, repository exploration,
  or broad technical planning.
---

# Create Tests
Use this skill to add or update tests for existing code.

## Workflow
1. Identify the unit under test.
Determine whether the target is:
- React component
- hook
- Redux reducer
- selector
- thunk
- service
- repository
- IPC handler
- workflow module

2. Identify the observable surface.
Determine what must be verified:
- rendered output
- user interaction
- returned values
- state transitions
- dependency calls
- persistence effects
- IPC responses
- failure behavior

3. Identify required test boundaries.
Determine which dependencies must be isolated.
Mock or fake only external systems required by the test.

4. Define test coverage in scope.
Cover:
- normal behavior
- edge cases
- failure paths
- regression-sensitive paths

5. Match test shape to module type.
Use the correct strategy for the target:
- React: rendered behavior and interaction
- Redux: reducers, selectors, thunk behavior
- services: inputs, outputs, side effects
- TypeORM: persistence behavior and query results
- Electron: request handling and response behavior

6. Generate tests.
Write only the tests required for the requested scope.
Keep the test file aligned with existing repository patterns.

## Output
### Test Strategy
What behavior will be tested.

### Test Cases
Scenarios covered.

### Test Implementation
Vitest test code.