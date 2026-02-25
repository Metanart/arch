---
name: react-performance-analysis
description: Analyze and fix React performance issues with a focus on unnecessary re-renders, unstable callbacks, inline objects, key misuse, and memo misuse. Use when the user asks to speed up a React UI, investigate sluggish rendering, reduce renders, or review React components/hooks for performance regressions.
---

# React performance analysis

## Goal

Find and fix **avoidable React renders** and **wasted work per render** without changing architecture or adding dependencies.

## When to use

- UI feels sluggish, typing is laggy, scrolling stutters, or React DevTools shows frequent renders.
- The user mentions: **re-render**, **render loop**, **callback identity**, **useCallback**, **useMemo**, **React.memo**, **keys**, **inline props**.
- Reviewing a diff that likely changed render frequency (prop drilling, lists, memoization changes).

## Operating principles

- **Measure first**: Confirm the hot path with React DevTools Profiler before changing code.
- **Fix the cause, not the symptom**: Stabilize props/state flow; avoid blanket memoization.
- **Don’t add new libraries** unless explicitly requested.
- **React 18 + StrictMode note**: Dev-only double-invocations can look like “extra renders”. Always confirm in production build / non-StrictMode context before claiming wins.

## Inputs to request (if missing)

- Repro steps and the “slow” screen(s).
- Framework/runtime: React SPA, Next.js, Electron renderer, etc.
- Whether StrictMode is enabled in dev.
- A short Profiler capture (commit list + flamegraph) or a screenshot.

## Workflow

### Step 1: Identify the hotspot (Profiler-first)

1. Use **React DevTools → Profiler**.
2. Record the interaction that feels slow.
3. In the slow commit(s), identify:
   - Components with **high “Render duration”**
   - Components that **render on every commit** but visually don’t change
   - **Large lists** or “provider-heavy” trees

Deliverable: name the top 3 components by wasted time and why they re-render.

### Step 2: Classify the cause of re-renders

Use this decision tree:

- **Parent re-renders frequently**
  - Child re-renders because props change identity (callbacks/objects) or because it isn’t memoized (sometimes correct).
- **Props change every render but values are logically the same**
  - Unstable callback: `onClick={() => ...}` or `useCallback` with changing deps.
  - Inline object/array: `style={{...}}`, `options={{...}}`, `items={[...]}`.
- **List churn**
  - Key misuse: using array index or non-stable key causing remounts.
- **Memo misuse**
  - Overusing `useMemo`/`useCallback`/`React.memo`, or using them with incorrect deps leading to stale values or no benefit.

### Step 3: Diagnose with targeted checks

#### A) Unnecessary re-renders

Check for:
- **State changes too high in the tree**: state in a page/layout causes many children to re-render.
- **Context over-broadcasting**: one context value changes often and forces many consumers to re-render.
- **Derived values recomputed each render**: expensive computations in render.

Fix patterns (prefer minimal):
- Move state **down** to the smallest owner that needs it.
- Split context into multiple contexts (rarely needed; do only with evidence).
- Precompute expensive derived data with `useMemo` only when it measurably helps.

#### B) Unstable callbacks

Red flags:
- Handlers defined inline inside render and passed down multiple levels.
- `useCallback` used but deps change every render (so identity still changes).

Fix patterns:
- If the callback is passed to memoized children or used as effect dep, stabilize it:
  - Use `useCallback` with the **minimal correct deps**.
- If the callback does not cross component boundaries or isn’t a dep, don’t force `useCallback`.

Sanity checks:
- Never “cheat” deps to silence warnings; correctness beats stability.
- Prefer functional state updates to reduce deps: `setX(prev => ...)` can remove `x` from deps.

#### C) Inline objects / arrays

Red flags:
- Props like `options={{ a: 1 }}` or `style={{ width: 10 }}` passed to `memo` children.
- Arrays/objects created in render and used as deps elsewhere.

Fix patterns:
- Hoist constants outside the component when truly static.
- Use `useMemo` for objects/arrays **only** when:
  - the prop crosses into memoized components, or
  - it’s a dependency for effects/memos, and
  - the object creation contributes to churn or expensive recalcs.

Avoid:
- `useMemo(() => ({...}), [])` for values that should change—this creates correctness bugs.

#### D) Key misuse (lists)

Red flags:
- `key={index}` for dynamic lists (insert/remove/reorder).
- Keys derived from non-unique display text.
- Changing keys between renders (causes remounts, lost input state).

Fix patterns:
- Use stable, unique identifiers from data (`id`, stable path, etc.).
- If data lacks stable ids, create them at ingestion time (once), not per render.

Validation:
- After fix, ensure focus/input state doesn’t reset on updates and Profiler shows fewer mounts.

#### E) Memo misuse (`React.memo`, `useMemo`, `useCallback`)

Red flags:
- `React.memo` everywhere but props are unstable, so it never bails out.
- `useMemo` used for trivial computations (more overhead than benefit).
- Custom equality functions in `React.memo` that are complex or incorrect.

Fix patterns:
- Add memoization only where:
  - renders are frequent and expensive, and
  - props can be made stable, and
  - it improves Profiler “wasted” time.
- Prefer **simplifying prop shapes** (pass primitives/ids) over deep comparisons.

Trade-offs to highlight:
- Memoization can **increase memory** and **complexity** and can hide correctness issues (stale closures).

### Step 4: Verify improvements

- Re-run Profiler capture with identical repro steps.
- Compare:
  - number of commits
  - render duration for hotspot components
  - mounts/unmounts in lists
- If changes are ambiguous in dev, validate with a production build.

## Output format (use this report)

```markdown
## React performance report

### Repro
- Screen:
- Interaction:
- Dev/Prod:
- StrictMode:

### Profiler findings
- Hot component 1:
  - Evidence:
  - Why it re-renders:
- Hot component 2:
...

### Root causes (mapped)
- [ ] unnecessary re-renders
- [ ] unstable callbacks
- [ ] inline objects/arrays
- [ ] key misuse
- [ ] memo misuse

### Fixes applied (minimal set)
- Change:
  - Before:
  - After:
  - Trade-off:

### Verification
- Before capture:
- After capture:
- Notes:
```

## Fast grep-style heuristics (code review)

Use quick scans to find likely culprits (then confirm with Profiler):
- `key={index}` or `key={i}`
- `onClick={() =>` / `onChange={(e) =>`
- `style={{` / `options={{` / `config={{`
- `React.memo(` with props that include objects/functions
- `useMemo(` / `useCallback(` added broadly without evidence

