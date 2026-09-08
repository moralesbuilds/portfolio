## Scope

## Project structure
This document outlines the current routing layer, application architecture, and content data model for the application.

### Routing layer
```text
src/app/[locale]/
├── page.tsx            # Homepage
└── blog/
    ├── page.tsx        # Blog post index & listing
    └── [slug]/page.tsx # Individual blog post view
```

### Application layer
```text
src/
├── features/
│   └── blog/           # Core logic for blog listing, and posts
│       ├── actions/    # Next.js Server Actions for the blog feature
│       ├── components/ # React components exclusive to the blog feature
│       └── services/   # Data fetching queries and mutations
└── components/         # Shared UI components across the application
```

## Content structure

Blog posts are stored as MDX files in a Cloudflare R2 bucket, with dedicated files per article and locale (e.g., my-first-post.en.mdx). Each MDX file corresponds to a record in a Cloudflare D1 database table matching the BlogPost data model.

## Data model: Blog post

```ts
type BlogPost = {
  slug: string;         // Unique URL identifier
  title: string;        // Post headline
  summary: string;      // Short description of the post content.
  filename: string;     // Corresponding MDX file path in Cloudflare R2
  publishedAt: string;  // ISO 8601 publication timestamp
  locale: string;     // Locale code (e.g., "en", "es")
  author: string;       // Author name or identifier
};
```

## Conventions and minor decisions
- Localized Routing: All public pages reside inside src/app/[locale]/ to ensure strict locale prefixing across all routes.
- R2 Naming Pattern: MDX files in R2 must follow the exact syntax {slug}.{locale}.mdx to maintain consistency between D1 metadata records and storage keys.
- Feature Encapsulation: Domain-specific UI, Server Actions, and services are strictly grouped under src/features/[feature_name]/ to avoid cluttering global shared folders.

## Open items / Out of scope
- Search System: Full-text or vector search engine implementation across published MDX posts.
- Comment Engine: User feedback, authentication, or third-party comment integration.
- The built-in interface/tooling to upload MDX files to R2 and insert records into D1. For the first phase, content files and database records will be added manually.
- R2 + D1 storage decision — formal ADR pending (tracked for a future PR)