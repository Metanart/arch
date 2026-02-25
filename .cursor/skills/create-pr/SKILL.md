---
name: create-pr
description: Create a GitHub PR using the existing draft in .cursor/pr/PR_BODY.md. Does not regenerate the description.
disable-model-invocation: true
---

# Create PR

## When to Use

- After `/draft-pr` when you are ready to open a PR.

## Preconditions

- `.cursor/pr/PR_BODY.md` exists (generated or edited by the user).
- `gh` CLI is installed and authenticated.

## Instructions

1. Determine current branch name.
2. Ensure `.cursor/pr/PR_BODY.md` exists.
   - If it doesn't, stop and tell the user to run `/draft-pr` first.
3. (Optional) Validate that the file contains the required headings:
   - Summary / Changes / Technical Details / Risks / Test Plan
4. Create PR via GitHub CLI:
   - base: main
   - title: branch name
   - body: from `.cursor/pr/PR_BODY.md`
5. Print the created PR URL.

## Preferred command

- Use `gh pr create --base main --title "<branch>" --body-file ".cursor/pr/PR_BODY.md"`
