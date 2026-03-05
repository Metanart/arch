---
name: implement
description: Implement new features or functionality in a TypeScript application using React, Redux Toolkit, Electron, TypeORM, and Vitest.
---

# Implement Skill

## Purpose

This skill is used to implement new functionality in the codebase.

It ensures that new code:

- follows the existing architecture
- reuses existing modules and patterns
- respects application layering
- maintains type safety
- integrates correctly with state management and persistence

This skill should be used when:

- implementing a new feature
- adding a new module
- extending an existing workflow
- writing new services or components

The goal is **correct integration with the existing system**, not just generating working code.

---

# Implementation Procedure

Follow the steps in order.

Do not generate code before completing the analysis steps.

---

## 1. Understand the Task

Determine:

- what feature must be implemented
- what the expected behavior is
- which parts of the application are affected

Identify:

- inputs
- outputs
- side effects

If the requirements are unclear, infer them from:

- surrounding code
- existing workflows
- similar features

---

## 2. Identify the Architectural Layer

Determine where the implementation belongs.

Possible layers:

UI Layer

- React components
- hooks

State Layer

- Redux Toolkit slices
- selectors
- async thunks

Application Layer

- services
- business logic
- orchestration

Persistence Layer

- TypeORM repositories
- entities

Electron Layer

- IPC handlers
- main process services

Do not mix responsibilities across layers.

---

## 3. Search for Existing Patterns

Before writing code, search the repository for:

- similar features
- similar services
- similar Redux slices
- similar database operations
- existing utilities

Prefer **reusing existing abstractions** instead of creating new ones.

Match the style used in the project.

---

## 4. Determine the Integration Points

Identify where the new code must connect to the system.

Examples:

React → Redux slice  
Redux thunk → Service  
Service → Repository  
Repository → Database

For Electron applications:

Renderer → IPC → Main process → Services

List the integration points before implementing.

---

## 5. Define Types and Contracts

Define the types used in the feature.

Examples:

- input DTOs
- Redux state shape
- service interfaces
- entity fields

Ensure:

- no `any`
- correct nullability
- explicit return types

If external data is used, validate it before use.

---

## 6. Implement the Feature

Write the implementation following project conventions.

Ensure:

- small focused functions
- readable logic
- clear naming
- explicit types

Prefer composition over complex functions.

Avoid:

- large monolithic components
- mixing UI and business logic
- leaking persistence details into UI.

---

## 7. Handle Errors and Edge Cases

Verify:

- async operations handle failure
- invalid inputs are validated
- database errors are handled
- UI has safe fallback states

Never silently swallow errors.

---

## 8. Integrate with State (Redux Toolkit)

If the feature affects application state:

Ensure:

- reducers are pure
- side effects exist only in thunks
- selectors are used for derived state

Avoid:

- large global state objects
- storing derived values in state.

---

## 9. Integrate with Persistence (TypeORM)

When interacting with the database:

Ensure:

- repository pattern is used
- relations are loaded correctly
- transactions are used when necessary

Avoid:

- complex queries inside UI logic
- leaking entities into UI layer.

---

## 10. Write Tests (Vitest)

For new logic ensure tests exist for:

- reducers
- services
- business logic
- edge cases

Tests should verify behavior, not implementation details.

---

# Output Format

Always structure the response as follows.

---

## Implementation Plan

Short explanation of how the feature will be implemented.

---

## Architecture Integration

Describe where the code fits into the architecture.

---

## Files to Create or Modify

List the files that must be added or changed.

---

## Implementation

Provide the code necessary to implement the feature.

---

## Tests

Provide Vitest tests for critical logic if appropriate.

---

# Rules

Do NOT:

- invent architecture not present in the repository
- introduce new frameworks
- bypass existing services or patterns

Always:

- follow existing patterns
- reuse utilities when possible
- keep functions small and readable
- maintain strict TypeScript typing
