# Shell Commands
Use only the commands listed here unless explicitly asked to explore alternatives.

# Package Manager
Use pnpm only.
Do not use npm, yarn, or bun.

# Working Directory
Run commands from repository root unless a command explicitly requires another directory.

# Install
Use:
- `pnpm install`

Do not use:
- `npm install`
- `yarn install`
- `bun install`

# Development
Use:
- `pnpm dev`
- `pnpm dev:watch`
- `pnpm start`

Meaning:
- `pnpm dev` starts electron-vite dev mode
- `pnpm dev:watch` starts dev mode with watch
- `pnpm start` runs preview

# Formatting
Use:
- `pnpm format`

# Lint
Use:
- `pnpm lint`
- `pnpm lint:fix`

Prefer:
- `pnpm lint` for validation
- `pnpm lint:fix` only when explicitly fixing lint issues

# Type Check
Use:
- `pnpm typecheck`
- `pnpm typecheck:server`
- `pnpm typecheck:client`
- `pnpm typecheck:bridge`

Prefer targeted typecheck when working in one app only.
Use full `pnpm typecheck` when validating cross-app changes.

# Build
Use:
- `pnpm build`
- `pnpm build:typecheck`

Prefer:
- `pnpm build` for normal build validation
- `pnpm build:typecheck` when build validation must include typecheck

# Platform Builds
Use only when explicitly requested:
- `pnpm build:unpack`
- `pnpm build:win`
- `pnpm build:mac`
- `pnpm build:linux`

Do not run platform packaging commands by default.

# Tests
No canonical test script is defined in package.json.

Do not guess:
- `pnpm test`
- `pnpm test:watch`

If tests must be run, prefer explicit Vitest invocation only if the repository already contains working Vitest config and test files.

Allowed fallback:
- `pnpm vitest`

Use targeted Vitest execution when possible:
- `pnpm vitest run <path-to-test-file>`
- `pnpm vitest <path-to-test-file>`

If Vitest command fails, report the failure.
Do not guess alternative test commands.

# Workspace Rules
This repository uses pnpm workspaces:
- `apps/*`
- `packages/*`

Prefer root scripts when they already exist.
Prefer targeted checks when only one app or package is affected.

Do not invent workspace filters unless the package name is confirmed from the repository.

# Safe Validation Order
After code changes, prefer this order:
1. targeted typecheck
2. targeted test run if test setup is confirmed
3. root lint
4. root build only when needed

Do not run heavy commands by default if a narrower validation command is sufficient.

# Forbidden Commands
Do not use:
- `npm`
- `yarn`
- `bun`
- guessed test scripts that are not defined
- destructive git commands
- deploy commands
- release commands

# Failure Policy
If a listed command fails:
- do not guess alternatives
- do not switch package managers
- do not invent new scripts
- report the exact failing command and output