# ADR-0007: Mandatory Top-Level `/[locale]` Folder Routing from Day One

## Status
Accepted (2026-09-08)

## Context
Building on ADR-0005 (`next-intl` adoption), the initial MVP release of the portfolio targets a single active locale (English). Modern internationalization routing strategies offer two layout choices: flattening routes initially (`/contact`, `/blog`) and introducing localized path prefixed later, or enforcing a parameterized top-level-route segment (`/[locale]/contact`, `/[locale]/blog`) from project inception. Postponing route-level localization until Spanish content is introduced creates severe migration friction—breaking canonical URLs, invalidating indexed search engine paths, requiring bulk file tree refactoring, and altering client-side link behaviors. I need to select a folder-based routing architecture that accommodates single-language delivery today with prefixless default URLs while preventing destructive structural refactoring when additional languages are launched.

## Decision
Enfoce `/[locale]` folder layout at the root of the Next.js `apps/web/app` directory from Day One across all public-facing pages and dynamic routes, configured with `localePrefix: 'as-needed'` and `defaultLocale: 'en'`.

## Alternatives evaluated
### 1. Top-Level `/[locale]` Folder Layout with `as-needed` Prefixing (Selected)
* **Pros**: Establishes clean, canonical root URLs for the default language (`/contact`, `/blog`) without prefix clutter during phase one, while ensuring the underlying filesystem structure (`app/[locale]/...`) remains completely stable when adding additional languages (`/es/contact`, `/es/blog`). Prevents future file tree relocations, and simplifies middleware locale handling.
* **Cons**: Forces a slightly deeper folder nesting level (`app/[locale]/...`) during initial development and requires wrapping internal `next/link` navigations with `next-intl` localized path helpers from the start.

### 2. Flat Folder Structure (`app/contact/page.tsx`) with Future Migration
* **Pros**: Cleaner root file tree during MVP development, slightly simpler initial page component paths, and no explicit `locale` route params to handle in page props during phase one.
* **Cons**: Requires a high-risk structural refactor when introducing Spanish support; forces bulk relocation of all Next.js route components into a `[locale]` dynamic segment, breaking existing incoming backlinks and SEO indexing without complex 301 redirect maps, and forces sweeping updates across metadata generators and dynamic route handlers.

### 3. Always-Prefixed Top-Level Folder Layout (`localePrefix: 'always'`)
* **Pros**: Explicitly forces `/en/contact` and `/en/blog` URLs, making locale boundaries unambiguous in every route string.
* **Cons**: Creates ugly, redundant path prefixes for the primary/default locale (`/en`), impacting branding, domain cleanliness, and URL conciseness.

### 4. Subdomain-Based Routing (`es.moralesbuilds.dev`, `en.moralesbuilds.dev`)
* **Pros**: Keeps page folder structure flat without requiring `/[locale]` path prefixes in the App Router tree.
* **Cons**: Complicates Cloudflare DNS, SSL certificate management, and Next.js middleware domain routing; fragments domain authority/SEO ranking across subdomains instead of consolidating authority under a single domain root.

## Consequences
* **Positive**: Eliminates future breaking changes to the project's file structure and public URL taxonomy. Serves clean default URLs (`/`, `/blog`, `/contact`) for English visitors today while maintaining zero-friction expansion for `/es/...` routes in future releases.
* **Negative**: Requires disciplined self-adherence to next-intl's navigation utilities (`Link`, `redirect`, `usePathname` and translation hooks (`useTranslations` / `getTranslations`) across the codebase, rather than relying on standard next/link imports.