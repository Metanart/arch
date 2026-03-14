# Refactoring Rules

Preserve observable behavior unless change is explicitly requested.
Preserve inputs, outputs, public APIs, and required side effects.

# Scope

Prefer small incremental changes.
Keep diffs minimal.
Do not change unrelated code.
Do not add new functionality during refactoring.

# Readability

Improve readability before adding new logic.
Simplify structure.
Extract functions.
Rename unclear variables.
Remove duplication.

# Function Complexity

Split large functions into smaller focused units.
Isolate responsibilities.
Prefer early returns.
Reduce nesting.
Extract repeated logic.

# Duplication

Extract shared logic into reusable functions or utilities.
Avoid copy-paste code.

# Naming

Use names that reflect intent.
Avoid unclear abbreviations.
Do not rename in ways that change behavior.

# Dead Code

Remove unused variables, unused functions, and unreachable branches.
Do not remove code if usage cannot be determined safely.

# Type Safety

Remove unnecessary any.
Add missing types.
Improve weak types.
Do not weaken type safety.

# Tests

Keep existing tests passing.
Do not remove tests unless invalid.
Update tests only when behavior or signatures change.

# Module Boundaries

Respect existing module boundaries.
Do not increase coupling.
Avoid unnecessary dependencies.

# Reusable Logic

Extract repeated logic into shared utilities.
Extract hooks only for React-specific reusable stateful logic.
Keep reusable logic framework-agnostic when possible.

# Error Handling

Add explicit error handling where missing.
Do not introduce silent failures.
Keep error behavior predictable.

# Process

Understand existing behavior before changing structure.
Refactor before extending.
Do not modify code blindly.
