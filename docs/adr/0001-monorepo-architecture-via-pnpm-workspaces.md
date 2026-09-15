# ADR-0001: Monorepo architecture via pnpm Workspaces

## Status
Accepted (2026-08-31)

## Context
The portfolio starts as a single Next.js application targeting Cloudflare's edge platform. However, the roadmap includes auxiliary edge Workers, and specialized API handlers. We need to decide whether to place the initial app at the repository root or establish a monorepo structure from day one.

## Decision
Adopt a `pnpm` workspaces monorepo architecture from the beginning, placing the primary frontend application in `apps/web` and reserving `packages/` for shared configuration and utilities.

## Alternatives Evaluated

### 1. Single Root-Level Repository
* **Pros**: Simpler initial setup with straightforward file paths.
* **Cons**: Adding future Workers, frontend apps or microservices would require migrating files, rewriting CI/CD paths, disrupting git history, and risking broken paths in development environments like WSL2 or Cloudflare's workers deployment.

### 2. pnpm Workspaces (Selected)
* **Pros**: Strict dependency resolution via content-addressable storage, fast disk-space-efficient installs, and native `workspace:*` symlinking.
* **Cons**: It lacks built-in task orchestration, graph execution, and build caching on its own.

### 3. npm / Yarn Workspaces
* **Pros**: Native workspace management.
* **Cons**: Lacks non-hoisted `node_modules` layout which prevents phantom dependency bugs across packages, has slower dependency installation times.

### 4. Nx or Lerna:
* **Pros**: High feature set.
* **Cons**: Introduces excessive configuration overhead for a lightweight TypeScript edge project compared to pairing pnpm workspaces.

### 5. Multi-Repo Setup
* **Pros**: Complete isolation per service.
* **Cons**: Creates code fragmentation, makes cross-component changes hard to track for reviewers, and duplicates boilerplate configurations.

## Consequences
* **Positive**: Enables seamless addition of future services under `apps/` without refactoring existing code.
* **Positive**: Facilitates shared `TypeScript/ESLint` rules in `packages/`.
* **Positive**: Keep Pull Requests unified for code reviewers.
* **Positive**: Avoids costly future migration debt.
* **Negative**: Incurs upfront configuration overhead (`pnpm-workspace.yaml`, and nested packages files) for a project currently containing only a single application. While this add initial ceremony compared to a single root-level setup, it avoids the far more complext and risky task of migrating a mature project to a monorepo once the multi-app complexity arises.
* **Negative**: Introduces immediate structural friction and cognitive overload navigating nested directories.