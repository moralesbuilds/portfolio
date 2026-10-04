---
name: "project-name"
locale: "en"
slug: "project-name"
title: "Project Name"
summary: "A one-line summary of what the project is and what problem it solves."
is_featured: true
tags: ["Nextjs", "Cloudflare", "Typescript"]
repository_url: "https://github.com/username/project-name"
---

## Context

Describe in two or three sentences where the project came from: who needed it, what the situation was before, and why it was worth solving. This is the paragraph that decides whether someone keeps reading, so skip the jargon and get straight to the problem.

## The Problem

- First concrete pain point, ideally measurable ("reports took 3 days to generate").
- Second pain point, or an important constraint (budget, deadline, a one-person team).
- What was **not** possible with the tools that already existed.

## The Solution

Explain what you built and how it addresses the problem above. A high-level description is enough; technical details come further down.

1. **Key decision 1:** what was chosen and why (for example, "Cloudflare Workers to avoid maintaining servers").
2. **Key decision 2:** an alternative you ruled out and the reason.
3. **Key decision 3:** something you deliberately kept simple.

## Results

| Metric                  | Before   | After     |
| ----------------------- | -------- | --------- |
| Load time               | 4.2 s    | 0.9 s     |
| Monthly hosting cost    | $40 USD  | $0 USD    |
| Deployments per week    | 1        | 10+       |

> If you don't have numbers, describe the change qualitatively. An honest, specific result is worth more than an invented figure.

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Cloudflare Workers, D1
- **Tooling:** Vitest, Playwright, GitHub Actions

## Architecture

A diagram or a code block helps show how the pieces fit together:

```text
Client ──▶ Next.js (Edge) ──▶ Worker API ──▶ D1
                                   │
                                   └──▶ R2 (static assets)
```

And if there's a code snippet that represents the approach well, include a short one:

```ts
export async function GET(request: Request, env: Env) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM projects WHERE featured = 1 ORDER BY date DESC LIMIT 3"
  ).all();

  return Response.json(results);
}
```

## Challenges and Lessons Learned

- **Challenge:** what went wrong or was harder than expected, and how you solved it.
- **Lesson:** what you would do differently if you started today.

## Next Steps

- [ ] Pending feature 1
- [ ] Pending feature 2
- [x] Something already completed

## Links

- [View repository](https://github.com/username/project-name)
- [Live demo](https://example.com)
