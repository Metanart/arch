---
name: refactor
description: Improve existing code quality in a TypeScript application using React, Redux Toolkit, Electron, TypeORM, and Vitest without changing behavior.
---

# Refactor Skill

## Purpose

This skill improves existing code while preserving its behavior.

The goal is to:

- improve readability
- simplify complex logic
- enforce architectural boundaries
- remove duplication
- improve type safety
- make code easier to maintain

Refactoring must **not change application behavior**.

This skill should be used when:

- improving messy or complex code
- cleaning up large functions
- improving TypeScript types
- removing duplication
- aligning code with project architecture

---

# Refactoring Procedure

Follow the steps in order.

Never start modifying code before understanding it.

---

## 1. Understand the Current Behavior

Analyze the existing code.

Determine:

- what the code does
- what inputs it receives
- what outputs it produces
- what side effects occur

Identify:

- functions
- modules
- dependencies
- data transformations

The behavior must be preserved after refactoring.

---

## 2. Identify Code Smells

Look for common problems such as:

### Structural Issues

- very large functions
- deeply nested logic
- mixed responsibilities

### Duplication

- repeated logic across files
- repeated utility functions

### Naming Problems

- unclear variable names
- misleading function names

### TypeScript Issues

- `any` usage
- unsafe type assertions
- implicit return types

### Architectural Violations

- UI components containing business logic
- persistence logic inside React components
- Redux slices performing side effects

---

## 3. Determine Safe Refactoring Targets

Focus on changes that improve the code without altering behavior.

Examples:

- extract functions
- simplify conditionals
- improve variable naming
- isolate side effects
- improve type definitions

Avoid refactoring code that:

- is poorly understood
- has unclear side effects
- interacts with external systems unless necessary.

---

## 4. Plan the Refactoring

Before modifying the code, determine:

- what will change
- what files are affected
- how behavior will remain identical

Prefer **small incremental improvements** over large rewrites.

---

## 5. Apply the Refactoring

Perform the improvements.

Examples:

### Extract Functions

Break large functions into smaller ones.

### Improve Naming

Replace vague names with descriptive ones.

### Simplify Logic

Reduce nesting and complex conditionals.

### Improve Type Safety

Add explicit types and remove unsafe patterns.

### Enforce Architecture

Move logic to the correct layer when necessary.

---

## 6. Preserve Behavior

Ensure that:

- function inputs remain the same
- return values remain the same
- side effects remain the same
- external APIs remain unchanged

The refactoring must not change application behavior.

---

## 7. Verify Test Coverage

If tests exist:

- ensure they still pass

If critical logic lacks tests:

- recommend adding tests before refactoring.

---

# Stack-Specific Refactoring Guidelines

## React

Improve:

- component size
- separation of concerns
- hook usage
- render logic clarity

Avoid mixing UI and business logic.

---

## Redux Toolkit

Ensure:

- reducers remain pure
- async logic is in thunks
- selectors are used for derived state.

---

## TypeORM

Improve:

- repository usage
- query clarity
- entity typing

Avoid leaking entities into UI layers.

---

## Electron

Maintain clear separation between:

Renderer → IPC → Main Process.

Avoid moving Node logic into renderer code.

---

# Output Format

Always structure the output as follows.

---

## Refactoring Goals

Explain what problems are being addressed.

---

## Identified Issues

List the problems in the current code.

---

## Refactoring Plan

Describe the changes that will be made.

---

## Refactored Code

Provide the improved implementation.

---

# Rules

Do NOT:

- change application behavior
- introduce new frameworks
- perform large rewrites without justification

Always:

- keep refactors small and focused
- improve readability
- maintain architecture boundaries
- preserve existing interfaces
