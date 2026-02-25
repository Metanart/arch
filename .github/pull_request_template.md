# PR Title

<!--
Format:
<type>(<scope>): short imperative summary

Types:
- feat
- fix
- refactor
- perf
- chore
- test
- docs

Scope examples:
scanner | task-queue | worker | db | ui | main | preload | ipc | config | build
-->

---

## Summary

Brief explanation of what this PR changes.

Rules:

- 3–6 sentences max
- Describe WHAT changed, not why it’s amazing
- No marketing language
- No assumptions not present in the diff

---

## Problem

Describe the issue being solved.

If applicable:

- Reference issue number
- Describe incorrect behavior
- Describe limitation in previous implementation

If not applicable:

- State: "No specific issue. Internal improvement."

---

## Changes

List concrete changes introduced in this PR.

- Added:
- Updated:
- Removed:
- Renamed:
- Moved:

Be explicit. Use file/module names where relevant.

---

## Technical Details

Explain implementation specifics.

Include only facts visible from the diff:

- New entities / schema changes
- Updated TypeScript types
- Worker behavior modifications
- Queue logic changes
- IPC contract updates
- Performance implications
- Error handling changes

If database schema changed:

- Mention migration
- Mention backward compatibility

If task system changed:

- Mention TaskType impact
- Mention weight logic changes
- Mention concurrency behavior

---

## Architecture Impact

Indicate which layers are affected:

- [ ] UI (React)
- [ ] Application / Services
- [ ] Worker layer
- [ ] Task queue system
- [ ] Database schema
- [ ] IPC bridge
- [ ] Build system
- [ ] Config

Explain any cross-layer changes.

---

## Breaking Changes

- [ ] No breaking changes
- [ ] Breaking changes (describe below)

If breaking:

- Explain migration steps
- Mention affected modules
- Mention required config updates

---

## Performance Considerations

- Does this affect task throughput?
- Does it modify worker concurrency?
- Does it increase memory usage?
- Does it add DB queries?

If none:

> No measurable performance impact expected.

---

## Error Handling

Describe:

- New error types introduced
- Changes to existing error handling
- Impact on retry / task failure logic

If none:

> No changes to error handling logic.

---

## Test Plan

How this was validated:

- [ ] Manual testing
- [ ] Unit tests added
- [ ] Existing tests updated
- [ ] Migration tested
- [ ] Worker behavior verified
- [ ] Large directory scan tested
- [ ] Edge cases tested

Describe specific scenarios tested.

---

## Checklist

- [ ] Code compiles
- [ ] No TypeScript errors
- [ ] ESLint passes
- [ ] No console logs left
- [ ] No unhandled promises
- [ ] DB migrations verified (if applicable)
- [ ] IPC contracts aligned
- [ ] No hidden breaking changes

---

## Notes for AI Agent

When generating this PR:

1. Use only information present in the git diff.
2. Do not invent motivations or performance claims.
3. Do not describe code that is not visible in the diff.
4. Keep sentences short and factual.
5. Avoid speculative language.
6. Do not use marketing phrases.
7. If unsure — omit.

Output markdown only.
