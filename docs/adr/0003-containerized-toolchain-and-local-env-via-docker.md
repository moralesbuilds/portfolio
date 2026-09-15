# ADR-0003: Containerized Toolchain and Local Environment via Docker & Docker Compose

## Status
Accepted (2026-08-31)

## Context
While the production target for the portfolio application is Cloudflare's serverless edge infrastructure (`workerd`), maintaining consistency across local development environments, CI/CD pipelines, and end-to-end (E2E) test runs requires an isolated toolchain runtime. Local setups often suffer from Node.js/pnpm version drifts, missing OS-level dependencies, or environment configuration discrepancies across developer machines. I need a strategy to standardize the local developer experience and test environments without adding unnecessary overhead to daily edge deployment workflows.

## Decision
Adopt **Docker and Docker Compose** as a containerized toolchain for local development execution, onboarding isolation, and orchestrated full-stack E2E testing environments.

## Alternatives evaluated

### 1. Docker & Docker Compose (Selected)
* **Pros**: Guarantees exact runtime parity across machines, eliminates "works on my machine" issues for new contributors, and enables orchestrated multi-container E2E testing (simulating the entire app, mock edge bindings, and test runners) in isolated environments.
* **Cons**: Introduces container virtualization overhead (e.g. file system sync latency on Windows WSL2 or macOS), requires Docker Desktop/Engine installed locally, and adds `Dockerfile` and `compose.yml` maintenance overhead.

### 2. Native Host-Only Development
* **Pros**: Maximum execution speed, zero virtualization/file-sync overhead, faster hot module replacement (HMR), and simplest setup for a single developer.
* **Cons**: Leaves local development susceptible to environment drifts (different Node/pnpm versions across environments) and increases onboarding friction for external contributors who must manually configure pre-requisites.

## Consequences
* **Positive**: Provides a reproducible environment for running tests, scripts, and full-stack E2E test suites with zero manual installations of underlying host libraries. 
* **Positive**: Streamlines onboarding by allowing anyone to spin up the localt ecosystem via a single `docker compose up` command.
* **Negative**: Incurs minor maintenance cost for maintaining Docker configurations alongside root project files, and can be slower than host-native execution during rapid iterative coding cycles.
