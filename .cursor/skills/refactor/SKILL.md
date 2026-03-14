---
name: refactor
description: >
  Use when improving existing code structure without changing behavior.
  Handles behavior-preserving refactoring, scope definition, safe target
  selection, preserved-behavior checks, and minimal code improvement.
  Do NOT use for new feature implementation, broad repository exploration,
  speculative redesign, or behavior-changing rewrites.
---

# Refactor

Use this skill to improve existing code while preserving its observable behavior.

## Workflow

1. Define the refactor target.
   Identify:

- module
- function
- component
- hook
- service
- repository
- workflow segment

1. Confirm preserved behavior.
   State what must remain unchanged:

- inputs
- outputs
- side effects
- public API
- integration path

1. Identify refactorable problems.
   Focus on concrete issues in scope:

- large functions
- mixed responsibilities
- duplication
- unclear naming
- deep nesting
- weak structure
- weak type shape
- misplaced logic

1. Select a safe refactor scope.
   Choose the smallest area that can be improved without changing behavior.
   Avoid poorly understood paths and unnecessary expansion.

2. Define the refactor approach.
   Describe the intended improvement:

- extract function
- rename for clarity
- split responsibilities
- simplify control flow
- isolate side effects
- move logic to the correct module
- improve local type structure

1. Apply the refactor.
   Keep the change local and behavior-preserving.
   Follow existing repository patterns and integration boundaries.

2. Verify preserved behavior.
   Check that the original behavior remains intact.
   If tests exist, update only what is required by the refactor.

3. Stop at scoped improvement.
   Do not expand into feature work.
   Do not introduce unrelated cleanup.

## Output

### Refactor Target

What code is being improved.

### Preserved Behavior

What must remain unchanged.

### Issues

Problems found in the current implementation.

### Approach

How the refactor will improve the code.

### Refactored Code

Updated implementation.

### Notes

Risks, assumptions, or validation points.

Problems found in the current implementation.

### Approach

How the refactor will improve the code.

### Refactored Code

Updated implementation.

### Notes

Risks, assumptions, or validation points.
