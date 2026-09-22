# ADR-0009: Dual Licensing Strategy — MIT for Code, CC BY 4.0 for Content

## Status
Accepted (2026-09-15)

## Context
The portfolio repository is public on GitHub and contains only source code (`apps/web`, `packages/`, configuration, and scripts) — original written content (blog posts, case studies, site copy) is deliberately kept out of the repository to keep it clean for reviewers and is instead stored and served through Cloudflare D1 and R2 (see ADR-0007), independent of the
codebase. Code and prose are legally distinct categories of copyrightable work and are conventionally licensed differently — software licenses like MIT are designed around distribution and modification rights, while content licenses like CC BY 4.0 are designed around attribution on sharing and adaptation. Applying a single license across both would either under-protect the published content (MIT does not require attribution when prose is republished elsewhere) or create friction for the code (Creative Commons explicitly discourages using CC licenses for software, and most dependency-scanning tools do not recognize them as valid software licenses).
I needed a licensing approach that lets the codebase serve as a freely reusable portfolio/example piece while protecting attribution for original writing published on the live site.

## Decision
Adopt a dual-licensing model: the **MIT License** governs all source code in this repository. **CC BY 4.0** governs all original written content and images published on moralesbuilds.dev (blog posts, case studies, site copy) — this content is not stored as files in the repository (see ADR-0005) but is covered by a separate license notice (`LICENSE-CONTENT.md`)
and, where practical, a visible attribution notice on the published pages themselves. Third-party assets (fonts, icons, stock imagery) retain their own original licenses and are excluded from both.

## Alternatives evaluated

### 1. Single MIT License for everything
* **Pros**: Simplest setup, one file, no ambiguity about scope.
* **Cons**: Does not require attribution when published content is republished or quoted elsewhere, weakening the personal-branding and SEO value of sharing original writing.

### 2. Single CC BY 4.0 License for everything
* **Pros**: Simple, one file, built-in attribution requirement.
* **Cons**: Creative Commons explicitly recommends against applying CC licenses to software; lacks the software-specific rights (e.g., sublicensing) developers expect, and is not recognized by most dependency and license-scanning tools, which could make the code look unusable or flagged in other projects' audits.

### 3. All Rights Reserved (no license)
* **Pros**: Maximum default legal protection.
* **Cons**: Contradicts the purpose of a public portfolio repo — recruiters and other developers commonly expect to read or fork example code freely; also blocks legitimate sharing of published content that would otherwise benefit from attribution-driven visibility.

### 4. Dual License — MIT (code) + CC BY 4.0 (content) (Selected)
* **Pros**: Each category of work uses the license it was actually designed for — MIT maximizes code reuse and adoption (a positive portfolio signal), while CC BY 4.0 protects attribution for original writing published on the site, regardless of where that content is technically stored. Matches common practice in technical blogs/documentation sites that separate code samples from prose.
* **Cons**: Two license references to maintain, and since the content itself never appears in the repository, the CC BY notice needs to be visible somewhere a content reader would actually see it (e.g., the site footer), not only in a repo file that code reviewers happen to open.

## Consequences
* **Positive**: Codebase becomes freely reusable and forkable, lowering friction for recruiters or other developers inspecting it, while published content stays properly attributed if shared or republished elsewhere.
* **Negative**: Requires a clear "License" section in the README (and this ADR) explaining the split, plus adding a visible CC BY notice on the published site itself — not just in the repository — since the content it protects never lives there.
