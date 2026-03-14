---
name: reviewer
description: >
  Use when reviewing a pull request, staged changes, generated code, or a
  modified module in a TypeScript repository before merge. Handles context
  identification, boundary review, rule-based issue detection, severity
  classification, and actionable review output. Do NOT use for implementation,
  repository exploration without a concrete review target, or broad technical
  planning.
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Review
Use this skill to review scoped code changes against repository patterns, boundaries, and rules.

## Workflow
1. Identify review target.
Determine whether the review applies to:
- pull request
- staged diff
- generated code
- specific module
- specific file set

2. Identify change context.
Determine:
- purpose of the change
- affected behavior
- affected layers
- affected boundaries
- main integration path

3. Review against existing patterns.
Compare the change to nearby modules, established abstractions, and existing repository structure.
Flag deviations only when they create correctness, maintenance, or integration problems.

4. Review against repository rules.
Evaluate the change against active architecture, language, framework, security, performance, refactoring, and testing rules.
Do not restate the rules.
Use them to identify concrete issues.

5. Classify findings by severity.
Use:
- Critical Issues
- Design Issues
- Code Quality Issues
- Performance Concerns
- Testing Gaps

6. Prefer actionable findings.
Reference concrete files, lines, or patterns.
Explain why the issue matters.
Suggest the smallest reasonable fix.

7. Stay within review scope.
Do not rewrite the feature.
Do not propose large speculative redesign unless the current approach is unsafe or fundamentally incompatible with repository architecture.

## Output
### Summary
What changed and overall review assessment.

### Critical Issues
Correctness, safety, or boundary violations.

### Design Issues
Architecture, coupling, ownership, or maintainability problems.

### Code Quality Issues
Readability, consistency, or smaller structural problems.

### Performance Concerns
Potential regressions or inefficient patterns.

### Testing Gaps
Missing, weak, or outdated test coverage.

### Suggested Improvements
Minimal concrete fixes.