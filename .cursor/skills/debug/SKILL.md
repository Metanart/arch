---
name: debug
description: Investigate and diagnose bugs in a TypeScript application using React, Redux Toolkit, Electron, TypeORM, and Vitest.
---

# Debug Skill

## Purpose

This skill is used to investigate and diagnose bugs in the application.

The goal is to:

- identify the root cause of the issue
- trace how incorrect behavior occurs
- explain the failure mechanism
- suggest minimal fixes

This skill focuses on **analysis and diagnosis**, not blind code rewriting.

Typical use cases:

- unexpected UI behavior
- incorrect Redux state updates
- failing tests
- runtime exceptions
- incorrect database results
- broken workflows

---

# Debug Procedure

Follow the steps in order.

Do not propose fixes before identifying the root cause.

---

## 1. Understand the Reported Problem

Determine:

- what behavior is expected
- what behavior actually occurs
- where the issue appears

Examples:

- UI rendering issue
- incorrect state update
- missing database data
- failing async workflow
- Electron IPC error

Extract the observable symptoms.

---

## 2. Identify the Entry Point

Locate where the issue starts.

Possible entry points:

- React component
- Redux action
- async thunk
- service method
- IPC handler
- repository query

If the bug appears in the UI, begin tracing from the component.

If it appears in data persistence, begin from the repository or service layer.

---

## 3. Reconstruct the Execution Path

Trace the execution path that leads to the bug.

Typical flow:

User interaction  
→ React component  
→ Redux action  
→ thunk / middleware  
→ service  
→ repository  
→ database

For Electron:

Renderer  
→ IPC  
→ Main process  
→ service  
→ persistence

Identify the functions involved at each step.

---

## 4. Inspect State Transitions

Verify how application state changes.

Check:

Redux Toolkit:

- reducers
- async thunks
- selectors

Look for:

- incorrect state mutations
- stale state
- missing updates
- race conditions

Confirm whether state transitions match expected behavior.

---

## 5. Inspect Data Transformations

Check how data changes across layers.

Verify:

- input validation
- DTO transformations
- entity mapping
- serialization / deserialization

Look for:

- missing fields
- undefined values
- incorrect typing
- transformation errors.

---

## 6. Inspect Async Behavior

Many bugs occur in asynchronous workflows.

Check for:

- missing `await`
- promise chains without error handling
- race conditions
- stale closures in React hooks

Verify that async operations complete in the correct order.

---

## 7. Inspect Database Operations (TypeORM)

If persistence is involved:

Check:

- repository queries
- relations loading
- transactions
- entity state

Look for:

- N+1 queries
- missing relations
- incorrect query filters
- failed writes.

---

## 8. Inspect Electron Boundaries

If the application uses Electron:

Verify that:

Renderer process:

- does not access Node APIs directly
- communicates via IPC

Main process:

- handles IPC correctly
- returns expected data.

Look for:

- incorrect IPC channels
- missing handlers
- serialization issues.

---

## 9. Identify the Root Cause

After tracing the system behavior:

Explain precisely:

- what code causes the bug
- why the incorrect behavior occurs
- under what conditions it happens

The root cause must be based on evidence in the code.

---

## 10. Propose Minimal Fix

After identifying the root cause:

Suggest the smallest change that resolves the issue.

Avoid large refactors unless they are necessary.

Explain why the fix works.

---

# Output Format

Always structure the response as follows.

---

## Problem Summary

Short explanation of the reported issue.

---

## Entry Point

Where the faulty behavior begins.

---

## Execution Path

Step-by-step trace of the code involved in the workflow.

---

## Observed Issues

List the problematic parts of the implementation.

---

## Root Cause

Explain the underlying reason the bug occurs.

---

## Suggested Fix

Provide the minimal change required to fix the issue.

---

# Rules

Do NOT:

- guess the cause without tracing the code
- propose large rewrites
- modify unrelated parts of the system

Always:

- trace the full execution path
- explain the bug mechanism
- justify proposed fixes
