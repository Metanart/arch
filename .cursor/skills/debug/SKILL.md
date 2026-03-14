---
name: debug
description: >
  Use when investigating a specific bug, failing behavior, runtime error,
  state inconsistency, async issue, persistence issue, or IPC issue in an
  existing TypeScript application. Handles symptom analysis, entry-point
  discovery, execution-path tracing, root-cause identification, and minimal-fix
  proposal. Do NOT use for broad repository exploration, feature planning,
  speculative redesign, or unrelated refactoring.
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Debug
Use this skill to diagnose a concrete failure before proposing a fix.

## Workflow
1. Restate the problem.
Identify:
- expected behavior
- actual behavior
- reproduction path
- visible symptoms

2. Find the entry point.
Start from the closest concrete boundary:
- component
- event handler
- thunk
- service
- repository
- IPC handler
- failing test
- thrown error

3. Trace the execution path.
Follow the real path that leads to the failure.
Examples:
- UI -> hook -> Redux -> thunk -> service -> repository
- renderer -> IPC -> main -> service
- test -> setup -> module under test -> dependency

4. Inspect state, data, and async flow where relevant.
Check only the paths involved in the bug:
- state transitions
- DTO or entity transformations
- async ordering
- missing awaits
- stale closures
- invalid assumptions
- persistence reads or writes
- IPC request or response flow

5. Identify the failure point.
Locate the exact code path where behavior diverges from expectation.

6. Explain the root cause.
State:
- what code causes the bug
- why it fails
- under what conditions it fails

Base the conclusion on code evidence.

7. Propose the minimal fix.
Suggest the smallest change that resolves the issue without expanding scope.

8. Stop at diagnosis.
Do not rewrite unrelated parts.
Do not broaden into general refactoring.

## Output
### Problem Summary
Expected vs actual behavior.

### Entry Point
Where the faulty path begins.

### Execution Path
Step-by-step trace through the relevant code.

### Failure Point
Where behavior first becomes incorrect.

### Root Cause
Why the bug occurs.

### Minimal Fix
Smallest change that should resolve it.

### Notes
Important constraints, risks, or ambiguities.