---
name: reviewer
description: Perform deep code review for React / TypeScript / Electron projects using Redux Toolkit, TypeORM and Vitest.
---

# Code Review Skill

## Purpose

This skill performs a structured code review for TypeScript applications built with:

- React
- Redux Toolkit
- Electron
- TypeORM
- Vitest

The goal is to detect:

- architectural issues
- incorrect patterns
- performance problems
- state management mistakes
- unsafe database usage
- missing tests
- maintainability issues

This skill should be used when:

- reviewing a pull request
- reviewing staged changes
- auditing a module
- validating AI-generated code

---

# Review Procedure

Follow the steps **in order**.

Do not skip steps.

---

## 1. Understand Context

First determine:

- the purpose of the change
- the feature being implemented
- the architectural layer

Identify which part of the application this code belongs to:

- UI layer (React components)
- state layer (Redux Toolkit)
- persistence layer (TypeORM)
- application/service layer
- Electron main/renderer boundary
- tests (Vitest)

If the context is unclear, infer it from surrounding files.

---

## 2. Architecture Review

Verify that the code respects architectural boundaries.

Check for violations such as:

- UI components accessing database logic
- React components containing business logic
- Redux slices containing side-effects
- Electron renderer accessing Node APIs directly
- services depending on UI modules

Preferred structure:

UI → State → Services → Persistence

Flag violations explicitly.

---

## 3. TypeScript Safety

Check for:

- `any` usage
- unsafe type assertions
- missing return types
- incorrect generics
- nullable values not handled
- inconsistent domain types

Verify that:

- domain models are typed
- DTOs differ from entities
- external data is validated

---

## 4. React Review

Check for:

Component quality

- components too large
- missing separation between container/presentation
- unnecessary re-renders
- missing memoization where appropriate

Hooks usage

- hooks inside conditions
- incorrect dependency arrays
- derived state stored instead of computed

State

- local state used instead of Redux when shared
- Redux used when local state would be sufficient

---

## 5. Redux Toolkit Review

Check slices for:

- reducers containing side effects
- incorrect immutability usage
- overly large slices
- non-normalized state
- selectors missing memoization

Verify:

- async logic placed in `createAsyncThunk` or middleware
- selectors used instead of direct state access

---

## 6. TypeORM Review

Verify database correctness.

Check for:

- N+1 queries
- eager loading misuse
- transactions missing where required
- entities leaking into API layer
- incorrect relation usage

Validate that:

- repositories are used properly
- queries are explicit and readable
- migrations exist when schema changes

---

## 7. Electron Boundaries

Check for security and architecture issues:

Renderer process must not:

- access filesystem directly
- call Node APIs
- bypass IPC

Preferred flow:

Renderer → IPC → Main Process → Services

Flag violations.

---

## 8. Error Handling

Verify that:

- async operations handle failures
- errors are not silently swallowed
- database operations are guarded
- UI errors produce safe fallback states

Look for:

- missing try/catch
- unhandled promise chains

---

## 9. Testing (Vitest)

Check if tests exist for:

- reducers
- services
- complex logic
- database operations

Tests should:

- avoid testing implementation details
- focus on behavior
- cover edge cases

Flag missing tests.

---

## 10. Performance

Look for:

React

- unnecessary renders
- large component trees

Redux

- large state updates
- selectors recalculating unnecessarily

Database

- inefficient queries
- repeated queries inside loops

---

# Review Output Format

Always produce output in this structure:

## Summary

Brief description of the change and overall quality.

---

## Critical Issues

Architecture or correctness problems.

---

## Design Issues

Structural or maintainability problems.

---

## Code Quality Issues

Smaller improvements or refactoring suggestions.

---

## Performance Concerns

Potential inefficiencies.

---

## Testing Gaps

Missing or insufficient tests.

---

## Suggested Improvements

Concrete suggestions or example refactors.

---

# Rules

Do NOT:

- rewrite the entire code
- generate large refactors unless necessary
- invent project architecture not visible in the code

Always:

- reference specific lines or patterns
- explain why an issue matters
- suggest minimal fixes when possible
