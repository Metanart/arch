# React General Rules
Prefer functional components.
Avoid class components.
Keep components small and focused.
Each component should have a single responsibility.

# Component Structure
Separate UI from business logic.
Prefer composition over inheritance.
Avoid large monolithic components.
Extract reusable components when logic or UI repeats.

# Props
Use explicit props interfaces.
Avoid excessive prop drilling.
Prefer stable prop shapes.
Do not mutate props.

# State
Keep state minimal.
Store only data required for rendering.
Derive computed values instead of storing them in state.
Avoid duplicated state.

# Hooks
Call hooks only at the top level.
Do not call hooks inside loops, conditions, or nested functions.
Extract complex hook logic into custom hooks.

# Effects
Use effects only for side effects.
Avoid unnecessary effects.
Keep dependency arrays correct and explicit.
Avoid effects that update state without clear conditions.

# Rendering
Render must remain pure.
Do not perform side effects during render.
Avoid expensive computations inside render.

# Lists
Use stable keys for list rendering.
Do not use array index as key when list order may change.

# Context
Use context for shared global state only.
Avoid excessive context usage.
Split large contexts into smaller focused contexts.

# Reusability
Extract shared logic into custom hooks.
Avoid duplicating stateful logic across components.

# Component API
Keep component APIs simple and predictable.
Prefer explicit props over implicit behavior.
Avoid overly generic components.

# Code Consistency
Follow repository conventions for component structure.
Follow existing naming conventions.
Keep component files consistent with the codebase.