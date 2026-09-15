# ADR-0006: Decoupled blog content storage strategy via Cloudflare R2 and D1

## Status
Accepted (2026-09-07)

## Context
The portfolio includes a multilingual blog engine targeting an initial launch on September 26, 2026. Beyond requiring fast queries for listing, filtering, and localized metadata lookups (e.g., slug, title, publishedAt, locale, author), the platform must support dynamic, out-of-band content publishing and quick typo corrections without triggering a full repository rebuild or CI/CD deployment pipeline. At the same time, Cloudflare D1's free tier imposes a 500 MB database storage limit, making it inefficient to store full raw MDX payloads as text columns directly inside SQL tables. We needed a storage architecture that satisfies independent content publishing while scaling cost-effectively without exhausting D1 limits.

## Decision
Adopt a hybrid storage model where structured blog metadata is stored and indexed in **Cloudflare D1**, while the raw post content (`.mdx` files) is stored in **Cloudflare R2** object storage.

## Alternatives evaluated
### 1. Versioned Local MDX Files (`/content` directory in repo)
* **Pros**: Simplest setup, zero database overhead, and native static generation support via filesystem reads.
* **Cons**: Tightly couples content publishing to application rebuilds/re-deploys, making quick edits or dynamic content updates impossible without triggering full CI/CD deployment pipelines

### 2. Full Content Storage in Cloudflare D1
* **Pros**: Single source of truth for queries, simple SQL operations, and atomic transactions for metadata and content.
* **Cons**: Rapidly consumes D1's 500 MB free-tier storage limit, increases database row payload size, and degrades index query performance for listing pages.

### 3. Unified Content in Cloudflare R2
* **Pros**: Significantly greater storage capacity compared to D1 with zero egress fees.
* **Cons**: Poor metadata querying support; listing, sorting, and filtering posts by tags, locale, or publication date requires parsing object keys or fetching every object manifest on each request.

### 4. Hybrid Storage via Cloudflare D1 + R2 (Selected)
* **Pros**: Maximizes D1 storage efficiency by keeping SQL payloads lightweight, allows content updates in R2 without triggering application re-deploys, and provides zero-egress cost storage via R2.
* **Pros**: Maintains fast metadata filtering via D1 indices while serving rendered MDX on demand.
* **Cons**: Introduces a dual-storage dependency requiring transactional coordination between D1 records and R2 objects during content updates or deletions.

## Consequences
* **Positive**: Keeps SQL queries performant, avoids hitting D1 free-tier storage caps, enables dynamic content updates without triggering repository rebuilds, and leverages R2 for cost-effective static blob storage
* **Negative**: **Developer Tooling & Testing Friction**: Local testing requires emulating and managing two separate Cloudflare service bindings via Wrangler, complicating local seed scripts and integration test setups compared to reading from a local filesystem.
* **Negative**: **Increased Network Hop Latency**: Rendering a single blog post page requires two distinct asynchronous network calls at the edge runtime—first querying D1 to fetch the metadata and verify existence/access, followed by an R2 fetch call to stream the raw MDX content.
* **Risk**: **Dual-Storage Synchronization Risk**: Lack of native cross-service atomic transaction between D1 and R2 creates potential data inconsistency. If an R2 upload succeeds but a D1 insertion fails (or vice versa), the storage system risks holding orphan MDX files or dangling metadata pointers.
  * *Mitigation strategy*: Enforce a write-order sequence (upload blob to R2 first, then commit D1 metadata) wrapped in error-handling rollback scripts.
