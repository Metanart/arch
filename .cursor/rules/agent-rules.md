# AI Agent Rules

Limit changes to task scope.

Do not modify unrelated files.

If change affects >3 modules:
explain impact first.

Prefer small incremental changes.

If diff >300 lines:
split into smaller steps.

Do not modify infrastructure unless requested:

- build configs
- CI/CD
- deployment
- environment configs
- lockfiles

Do not add dependencies without justification.
Prefer existing libraries.

Before modifying code:

1. identify entrypoints
2. locate core modules
3. trace data flow

Follow existing architecture:

- folder structure
- naming conventions
- abstractions

Avoid large refactors unless requested.

Do not swallow errors.
Preserve existing error handling.

Avoid breaking public APIs.

Follow repository code style.

Update tests if behavior changes.

Avoid obvious performance regressions.

Update docs if behavior changes.

State assumptions explicitly.
Do not guess.

Implement only requested functionality.
Avoid speculative improvements.
