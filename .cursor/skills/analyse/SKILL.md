---
name: analyse
description: >
  Use when analyzing a repository, feature area, module, route, state flow,
  IPC flow, or data flow before planning or implementation. Handles
  architecture tracing, dependency discovery, pattern discovery, and
  integration-point discovery. Do NOT use for code generation,
  implementation, refactoring, or broad speculative planning.
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Analyse

Use this skill to understand existing code before planning or implementation.

## Workflow

1. Identify the analysis target.
   Determine whether the request is about:

- feature area
- module
- route
- state flow
- service flow
- repository flow
- IPC boundary
- business process

1. Find the entry points.
   Locate the starting files, routes, screens, reducers, thunks, services, repositories, handlers, commands, or IPC endpoints related to the request.

2. Identify the relevant layers.
   Determine which layers are involved:

- UI
- state
- application
- persistence
- Electron renderer
- Electron main
- infrastructure

1. Trace the real flow through the system.
   Follow the actual path used by the code.
   Examples:

- UI -> hook -> Redux -> thunk -> service -> repository
- renderer -> IPC -> main -> service
- route -> loader -> service -> repository

1. Find existing patterns.
   Identify similar modules, abstractions, naming conventions, boundaries, and integration patterns already used in the repository.

2. Identify dependencies and boundaries.
   List:

- upstream callers
- downstream dependencies
- shared utilities
- external systems
- state ownership
- persistence boundaries
- IPC boundaries

1. Identify constraints.
   Describe constraints relevant to the analyzed area:

- layer boundaries
- state shape
- data contracts
- SSR or browser constraints
- persistence model
- required abstractions to reuse

1. Stop at explanation.
   Do not generate code.
   Do not propose implementation unless explicitly requested.
   Focus on repository evidence and accurate explanation.

## Output

### Summary

What this part of the system does.

### Entry Points

Relevant starting files or modules.

### Layers

Which layers are involved.

### Flow

Step-by-step flow through the system.

### Key Files

Most relevant files and their roles.

### Existing Patterns

Patterns or abstractions already used.

### Dependencies and Boundaries

Important callers, dependencies, ownership, and boundaries.

### Constraints

Important technical constraints.

### Notes

Important observations, ambiguities, or risks discovered during analysis.
