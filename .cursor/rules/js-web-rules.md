# JavaScript Web Runtime Rules

Follow general JavaScript rules.
Apply these rules to browser environments.

# DOM Interaction

Avoid direct DOM manipulation when framework abstractions exist.
Query DOM nodes once and reuse references.
Do not perform unnecessary DOM reads or writes.

# Event Handling

Attach event listeners deliberately.
Remove listeners when no longer needed.
Avoid registering listeners inside frequently executed code paths.

# Timers

Clear timers when no longer required.
Avoid long-running or uncontrolled intervals.
Prefer requestAnimationFrame for visual updates.

# Browser APIs

Check browser API availability before use.
Provide fallbacks when required.
Avoid relying on non-standard browser APIs.

# Storage

Use browser storage intentionally:

- localStorage
- sessionStorage
- IndexedDB
  Avoid storing large datasets in synchronous storage APIs.

# Network Requests

Handle network errors explicitly.
Avoid duplicate requests.
Cancel or ignore outdated requests when possible.

# Security

Do not trust browser input.
Validate and sanitize external data.
Avoid exposing sensitive information in client code.

# Performance Awareness

Avoid unnecessary reflows and layout thrashing.
Batch DOM updates where possible.
Avoid large synchronous computations on the main thread.

# Global Scope

Avoid polluting the global scope.
Encapsulate logic in modules.
Do not rely on implicit globals.
