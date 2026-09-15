# ADR-0004: Selection of Cloudflare Deployment Adapter for Next.js

## Status
Accepted (2026-08-31)

## Context
Deploying Next.js App Router applications to Cloudflare Workers requires a compilation step that bridges Next.js server primitives (Server Components, Route Handlers, Incremental Static Regeneration) to Cloudflare's `workerd` runtime environment. I needed to select a deployment adapter that provides production reliability, active maintenance, and full feature coverage.

## Decision
Adopt `@opennextjs/cloudflare` as the deployment adapter for compiling and hosting the `apps/web` Next.js application on Cloudflare Workers.

## Alternatives Evaluated

### 1. [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) (Selected)
* **Pros**: Production ready, officially backed by Cloudflare engineers, and actively maintained.
* **Pros**: Translates Next.js build output into a native Cloudflare Worker bundle while preserving App Router features, cache handlers, and edge bindings.
* **Cons**: Introduces a specialized build wrapper (`opennextjs-cloudflare build`), relies on specific caching bindings (KV/R2) for full ISR support, and requires managing local `wrangler.jsonc` configurations alongside Next.js configs.

### 2. [`vinext`](https://vinext.io)
* **Pros**: A Vite-driven implementation designed to run Next.js apps on Vite and edge runtimes, offering fast cold starts and fast HMR/build times leveraging the Vite ecosystem.
* **Cons**: Backed and built by Cloudflare itself as an experimental reimplementation of the Next.js API surface on Vite; despite first-class Workers integration, Cloudflare's own docs flag it as high-risk for production (largely AI-generated code without full human review), alongside lacking complete Next.js App Router feature parity.

### 3. Legacy [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages)
* **Pros**: Established history as the former standard way to deploy Next.js to Cloudflare.
* **Cons**: Officially deprecated in favor of `@opennextjs/cloudflare` due to fundamental structural limitations in supporting modern App Router caching mechanisms, middleware patterns, and server features.

## Consequences
* **Positive**: Guarantees production stability, full feature parity for Next.js App Router, and direct access to Cloudflare edge infrastructure (KV, D1, R2) with active maintenance from Cloudflare's core engineering team.
* **Negative**: Adds a specialized build step to the deployment pipeline and requires maintaining Wrangler configuration files within `apps/web`.
