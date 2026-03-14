# React Web Rules
Keep React browser code client-safe and hydration-safe.
Use these rules with js-general-rules, js-web-rules, and react-general-rules.

# DOM Access
Avoid direct DOM manipulation.
Use state and props to control UI.
Use refs only for imperative DOM access.
Do not store UI state in refs.

# Browser APIs
Access window, document, localStorage, sessionStorage, or navigator only in effects or event handlers.
Do not access browser globals during render.
Guard code that can break hydration.

# Events
Prefer React event props.
Avoid manual addEventListener unless required.
Attach manual listeners in effects.
Remove listeners during cleanup.

# Navigation
Use the application router for internal navigation.
Do not use window.location for internal route changes.

# Forms
Prefer controlled inputs when state is required.
Do not mix controlled and uncontrolled inputs.

# Hydration Safety
Keep rendered output deterministic.
Do not use Math.random, Date.now, or browser-only values during render.
Generate non-deterministic values after mount.

# Layout and Effects
Use useLayoutEffect for immediate layout reads after DOM updates.
Use useEffect when layout timing is not critical.
Keep DOM-dependent logic out of render.

# Rendering Performance
Avoid unstable props in frequently rendered trees.
Avoid inline functions in large lists when they cause rerenders.
Extract heavy subtrees.
Use virtualization for large lists.
Do not render thousands of DOM nodes at once without need.

# Timers and Persistence
Clear timeouts and intervals during cleanup.
Prefer requestAnimationFrame for visual updates.
Access browser storage only after mount.
Handle missing or invalid stored data.

# Third-Party DOM Libraries
Isolate DOM libraries inside dedicated components.
Manage lifecycle in effects.
Clean up on unmount.
Do not let external libraries mutate DOM outside React control.