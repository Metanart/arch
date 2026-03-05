---
name: create-tests
description: Create tests for a TypeScript application using Vitest. Supports testing React components, Redux Toolkit logic, services, and TypeORM persistence.
---

# Create Tests Skill

## Purpose

This skill generates tests for existing code.

The goal is to:

- verify application behavior
- detect regressions
- cover important logic paths
- ensure reliability of services and workflows

Tests should validate **observable behavior**, not internal implementation.

This skill should be used when:

- adding tests to existing modules
- increasing test coverage
- testing business logic
- verifying Redux behavior
- testing database operations

---

# Test Creation Procedure

Follow the steps in order.

Do not generate tests before understanding the code.

---

## 1. Understand the Code Under Test

Determine:

- what module is being tested
- what responsibilities it has
- what inputs it receives
- what outputs it produces
- what side effects occur

Examples:

React component  
Redux slice  
Service function  
Repository  
Worker  
IPC handler

---

## 2. Identify Observable Behavior

Tests must verify **behavior**, not implementation details.

Examples of observable behavior:

React

- UI rendering
- state changes after user interaction
- component output

Redux

- reducer state transitions
- async thunk lifecycle
- selector results

Services

- returned values
- state mutations
- interactions with dependencies

Persistence

- database records created or updated
- queries returning expected results

---

## 3. Identify Dependencies

Determine what dependencies must be mocked or isolated.

Examples:

- repositories
- external APIs
- filesystem
- IPC calls

Avoid mocking the system under test itself.

Mock only external dependencies.

---

## 4. Define Test Cases

Create tests for:

### Normal behavior

Typical usage scenario.

### Edge cases

Examples:

- empty inputs
- invalid inputs
- boundary conditions

### Error handling

Verify how the system behaves when failures occur.

---

## 5. Structure the Test File

Follow a clear structure.

Typical pattern:

```
describe("module or function", () => {})

describe("normal behavior", () => {})

describe("edge cases", () => {})

describe("error handling", () => {})

```

Use descriptive test names.

---

## 6. Write the Tests

Ensure that tests:

- are deterministic
- do not depend on external state
- run independently
- are easy to read

Avoid:

- testing internal implementation
- excessive mocking
- brittle assertions.

---

## 7. Verify Coverage of Critical Logic

Ensure tests exist for:

- business logic
- state transitions
- async workflows
- error paths

Simple UI components may require fewer tests.

Complex services require more.

---

# Testing Guidelines for This Stack

## React

Prefer testing **behavior**.

Examples:

- user interaction
- rendered output
- conditional UI

Avoid testing internal state.

---

## Redux Toolkit

Test:

- reducers
- async thunks
- selectors

Reducers should be tested as pure functions.

---

## Services

Test:

- input/output behavior
- side effects
- error conditions.

---

## TypeORM

For persistence logic:

Prefer testing with:

- isolated database
- mocked repositories

Ensure queries behave correctly.

---

## Electron

Test IPC handlers by verifying:

- correct message handling
- expected response values.

---

# Output Format

Always structure the output as follows.

---

## Test Strategy

Explain what behavior will be tested.

---

## Test Cases

List the scenarios covered.

---

## Test Implementation

Provide the Vitest test code.

---

# Rules

Do NOT:

- rewrite the module under test
- test private implementation details
- introduce unnecessary mocks

Always:

- focus on observable behavior
- cover edge cases
- write readable tests
