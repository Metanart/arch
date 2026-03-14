---
name: create-pr
description: >
  Use when opening a GitHub pull request from the current branch using the
  existing PR body in .cursor/temp/PR_BODY.md. Handles precondition checks,
  branch detection, PR creation via gh CLI, and returning the created PR URL.
  Do NOT use for drafting PR content or analyzing the diff.
disable-model-invocation: true
---

# Create PR
Use this skill after the PR body already exists.

## Workflow
1. Determine the current branch name.

2. Check preconditions:
- .cursor/temp/PR_BODY.md exists
- gh CLI is installed
- gh CLI is authenticated

3. If .cursor/temp/PR_BODY.md is missing, stop and tell the user to run /draft-pr first.

4. Create the PR with:
`gh pr create --base main --title "<branch>" --body-file ".cursor/temp/PR_BODY.md" --assignee @me`

5. Return the created PR URL.

## Output
### Result
Created PR URL or blocking precondition failure.