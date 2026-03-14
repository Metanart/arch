---
name: trace-side-effects
description: >
  Use when tracing what side effects are triggered by a user action, request,
  state change, backend operation, queue message, worker job, or integration
  event. Handles trigger discovery, synchronous and asynchronous side-effect
  tracing, queue and worker tracing, downstream integration tracing, and
  causal-chain mapping. Do NOT use for implementation, refactoring, or general
  architecture review.
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Trace Side Effects
Use this skill to trace what actions, jobs, notifications, or external effects are triggered by a concrete event.

## Workflow
1. Define the trigger.
Identify the exact event to trace:
- user action
- UI event
- API request
- mutation
- state change
- service call
- DB write
- queue message
- worker execution
- webhook
- scheduled task

2. Find the first execution boundary.
Locate where the trigger first enters executable logic:
- event handler
- component callback
- thunk
- action handler
- route handler
- controller
- service method
- IPC handler
- worker entry point
- queue consumer

3. Trace the immediate effects.
Identify what happens directly after the trigger.
Look for:
- state updates
- repository writes
- service calls
- IPC calls
- network requests
- queue publishes
- event emits
- cache invalidation
- analytics events
- logging
- notifications

4. Trace asynchronous downstream effects.
Follow any non-immediate chain triggered by the event:
- queue enqueue
- background job
- worker execution
- retry flow
- scheduled task
- webhook
- email send
- push notification
- analytics pipeline
- external API call

5. Distinguish synchronous vs asynchronous effects.
For each side effect, mark whether it happens:
- in the same request or execution path
- after a queue boundary
- in a worker
- in a separate integration flow
- eventually, not immediately

6. Identify effect boundaries.
For each step, identify the boundary crossed:
- UI -> state
- renderer -> IPC -> main
- request -> service
- service -> repository
- service -> queue
- queue -> worker
- worker -> external provider
- app -> analytics
- app -> email provider

7. Identify trigger conditions.
For each side effect, determine:
- what condition enables it
- whether it is always triggered
- whether it depends on flags, state, permissions, or validation
- whether it depends on success of previous steps

8. Identify payloads and contracts.
For each side effect, capture:
- payload sent
- key fields used
- message shape
- event name
- queue/job contract
- provider request contract

9. Identify failure handling and retry behavior.
Check whether the side effect path includes:
- retry logic
- dead-letter behavior
- fallback behavior
- swallowed failures
- partial success
- compensating action
- logging only
- user-visible error handling

10. Stop at tracing.
Do not refactor.
Do not redesign the flow.
Do not generate code.
Focus on the actual causal chain used by the repository.

## Output
### Trigger
What event is being traced.

### Entry Point
Where the execution path starts.

### Immediate Effects
What happens directly after the trigger.

### Downstream Side Effects
Async or indirect effects triggered later.

### Causal Chain
Step-by-step chain from trigger to all relevant effects.

### Boundaries
Important boundaries crossed between layers or systems.

### Conditions
What controls whether each effect happens.

### Payloads and Contracts
Important payloads, events, messages, or request shapes.

### Failure and Retry Behavior
How failures, retries, and partial success are handled.

### Key Files
Most relevant files and their roles.

### Risks and Ambiguities
Unclear, hidden, duplicated, fragile, or poorly owned side effects.