# ADR-0002: Use Cloudflare D1 over PostgreSQL for Database Storage

## Status
Accepted (2026-09-09)

## Context
When building my software engineering portfolio and developer blog platform, I need a primary database to manage blog metadata and basic application metrics.

Most of my professional backend experience relies on PostgreSQL, but this personal project operates under a strict $0/month operational budget. Working within tight cost constraints is also a common real-world scenario for freelance/client work, so treating it as a practical constraint here doubles as useful practice.

## Decision
I will use Cloudflare D1 (built on SQLite) as the primary relational database instead of PostgreSQL.

## Alternatives Evaluated

### 1. PostgreSQL (via Supabase free tier)
* **Pros**: Deep familiarity from professional backend experience; robust features (JSONB, complex extensions, advanced locking).
* **Cons**: Network latency from edge functions (cold starts or cross-region connections — Cloudflare Hyperdrive can reduce this but doesn't eliminate it); free tiers often pause on inactivity or cap rows/storage, adding maintenance overhead.

### 2. Self-hosted PostgreSQL on a VPS
* **Pros**: Complete control over configuration and data.
* **Cons**: Violates the $0/month budget; adds ongoing server maintenance and patching overhead, which conflicts with the September 30 MVP deadline.

### 3. Cloudflare D1 (Selected)
* **Pros**: Native integration with Cloudflare Workers/Pages, zero round-trip edge access; generous free tier (5,000,000 reads / 100,000 writes per day); relational SQLite interface; no cold-start pauses.
* **Cons**: Limited concurrent write throughput; lacks advanced PostgreSQL data types and extensions; 500 MB storage limit per database and 10 databases per account on the free tier ([Limits · Cloudflare D1 docs](https://developers.cloudflare.com/d1/platform/limits/)).

## Consequences
* **Positive**: Fits entirely within Cloudflare's free tier at this project's scale.
* **Positive**: Queries run alongside the edge worker handling the request, eliminating network round-trips to a remote database.
* **Positive**: Simple schema management via D1 migrations — no connection pooling (pgBouncer) or instance lifecycle to manage.
* **Negative**: SQLite dialect limits — no native JSON processing or ENUM types the way PostgreSQL has them, and it doesn't draw on my existing PostgreSQL-specific experience.
* **Negative**: D1 is optimized for read-heavy workloads (a good fit for a portfolio/blog) and isn't suited to high-throughput write streams.
* **Risk**: The 500 MB per-database storage limit means `TEXT`/`BLOB` usage needs to be deliberate.
* **Risk**: Since September 1, 2026, Cloudflare actively enforces the free tier's daily limits (5M reads / 100K writes) — queries fail with an error until the next UTC day instead of silently degrading, so this is worth monitoring once there's real traffic ([D1 enforces free tier daily query limits · Cloudflare Changelog](https://developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/)).