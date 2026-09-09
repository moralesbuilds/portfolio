# ADR-0001: Use next-intl for internationalization

## Status
Accepted (2026-09-08)

## Context
I am building a portfolio which also doubles as a personal website where people can learn more about how I work and reach out to me.
I'm from Colombia. My native language is Spanish, and I want to offer my site in Spanish alongside English without having to develop a second website, change the site content later, or restructure the project's folders down the road when the project starts growing in size.

## Decision
I will use [next-intl](https://next-intl.dev/) to support multiple languages starting with English and later with Spanish.

## Consequences
* **Positive**: Adding support for new languages starting with Spanish will be easier once the initial next-intl plumbing is done.
* **Positive**: All UI text has to live in centralized locale files instead of being hardcoded across components, which helps long-term maintenance.
* **Negative**: The development effort is steeper when starting up with the project, especially with one supported locale at the moment.
* **Risk**: Adopting next-intl's folder structure makes some future structural changes harder to implement. For example, if we need to stop using next-intl or switch to another library with an incompatible folder structure, migrating existing routes and content will require significant rework.
