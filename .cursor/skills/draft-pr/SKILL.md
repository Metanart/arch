---
name: draft-pr
description: Draft a GitHub pull request body by analyzing the git diff against main and writing a structured markdown description to .cursor/temp/PR_BODY.md for later use by create-pr. Use when the user asks to draft or improve a PR description from the current branch changes.
disable-model-invocation: true
---

# Draft PR Description

## When to Use

- When the user wants to draft or refine a PR description for the current branch.
- When preparing to run `/create-pr` and you want a high-quality body prefilled from the diff.

## Preconditions

- Git repository is initialized and the current working directory is at the repo root.
- There is at least one commit difference between the current branch and the base branch (default: `origin/main` or `main`).

## Instructions

1. **Determine base branch**
   - Prefer `origin/main` if it exists.
   - Otherwise fall back to `main`.

2. **Collect changes**
   - Compute the diff from the base branch to the current HEAD (e.g. `git diff origin/main...HEAD`).
   - Use the full diff (not just `--stat`) so you can see added/removed behavior.

3. **Derive content only from the diff**
   - Do **not** invent changes or tests that are not visible in the diff.
   - Infer intent conservatively from filenames, paths, and code changes.

4. **Align with PR template when present**
   - If the repo has a PR template such as `.github/pull_request_template.md` or `.github/PULL_REQUEST_TEMPLATE.md`, mirror its headings and structure as closely as possible.
   - If no template is present, use this default structure:
     - **Summary**: 1–3 short bullets describing the overall goal and impact.
     - **Changes**: Bulleted list grouped by feature/area (e.g. "API", "UI", "Infra").
     - **Technical Details**: Non-obvious implementation details, migrations, algorithms, or cross-cutting concerns.
     - **Risks**: Potential regressions, rollout concerns, and mitigations. If risks are minimal, state that explicitly.
     - **Test Plan**: Concrete tests that were run or will be run (unit, integration, manual flows). If tests are missing, call that out honestly instead of fabricating.

5. **Tone and style**
   - Prefer concise, factual sentences over marketing language.
   - Use present tense ("Add X", "Refactor Y") and consistent formatting (markdown lists, code spans for identifiers).

6. **Write output file**
   - Ensure the `.cursor/temp` directory exists; create it if needed.
   - Write the markdown body to `.cursor/temp/PR_BODY.md`, overwriting any previous contents.

7. **Return information to the user**
   - Print the absolute or repo-relative path to `.cursor/temp/PR_BODY.md`.
   - Tell the user they can open and edit this file before running `/create-pr`, and that rerunning `/draft-pr` will regenerate it from the latest diff.
