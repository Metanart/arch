# Architecture Rules

Maintain clear separation of concerns.
Each module must have a single responsibility.
Avoid large multi-purpose modules.

# Layering

Respect architectural layers.
Do not mix responsibilities across layers.
Typical layers:

- presentation
- application
- domain
- infrastructure
  Dependencies must point inward toward the domain layer.
  Higher layers must not depend on lower implementation details.

# Module Boundaries

Modules must expose clear public interfaces.
Avoid accessing internal module implementation.
Communicate through defined APIs.
Avoid tight coupling between modules.

# Dependency Direction

Dependencies must follow architecture boundaries.
Do not introduce circular dependencies.
Prefer dependency inversion for cross-layer interaction.
Depend on abstractions, not concrete implementations.

# State Management

Keep state ownership explicit.
Avoid hidden shared state.
Pass required data explicitly between modules.

# Composition Over Inheritance

Prefer composition over inheritance.
Avoid deep inheritance hierarchies.
Favor small reusable components.

# Interface Stability

Public interfaces must remain stable.
Avoid breaking APIs used by other modules.
If a change is required, introduce a new interface instead of modifying existing behavior.

# Feature Isolation

Features should be implemented in isolated modules.
Avoid spreading feature logic across unrelated parts of the system.
Group related logic together.

# Reuse Existing Architecture

Follow existing project structure.
Reuse existing abstractions and utilities.
Do not introduce new architectural patterns without clear justification.

# Side Effects

Isolate side effects.
Business logic should remain deterministic where possible.
External systems must be accessed through dedicated adapters.

# Configuration

Configuration must be centralized.
Avoid hardcoded environment-specific values.
Use configuration providers or environment variables.

# Cross-Cutting Concerns

Handle cross-cutting concerns through dedicated mechanisms:

- logging
- validation
- error handling
- configuration
  Avoid scattering these concerns across business logic.

# Scalability

Design modules to evolve independently.
Avoid architectural decisions that tightly bind unrelated parts of the system.
