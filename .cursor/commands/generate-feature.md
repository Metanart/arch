Generate feature skeleton for STL Organizer.

Before writing code:

1. Classify feature type:
   - UI
   - Domain
   - Infrastructure

2. Provide high-level plan:
   - Layers involved
   - Data flow
   - Risks
   - Cancellation implications (if any)

Then generate:

For UI feature:

- feature folder structure
- container
- view
- hooks
- types
- index barrel
- minimal Redux integration (if needed)

For Domain feature:

- domain service
- types
- pure functions
- testable scheduling logic
- repository usage (if needed)

For Infrastructure feature:

- worker contract
- IPC type definition
- coordinator integration
- safe error propagation

Rules:

- Respect project architecture rules.
- No cross-layer shortcuts.
- No `any`.
- Explicit return types.
- Small, testable units.
