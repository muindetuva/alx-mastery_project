# SE-12 — High-Performance Content Hub

Signal is a Next.js App Router content hub that demonstrates deliberate static
generation, request-time rendering, and incremental regeneration in one typed
project.

## Stack

- Next.js App Router and React
- Strict TypeScript with the `@/*` path alias
- Tailwind CSS
- Markdown content with `gray-matter`, `remark`, and `remark-html`
- ESLint with Next.js core-web-vitals and TypeScript rules

## Rendering decisions

| Surface | Strategy | Why |
|---|---|---|
| Home | SSG | Stable editorial entry point can be generated ahead of time. |
| Article paths | SSG + ISR | `generateStaticParams` makes known Markdown articles static; `revalidate = 60` refreshes edits without rebuilding the entire site. |
| Article listing | ISR | The collection stays cacheable while discovering new content on a sixty-second revalidation window. |
| Live ticker | SSR | `force-dynamic` and `noStore()` provide a fresh timestamp and current values on every request. |
| Ticker API | Dynamic route | The JSON endpoint explicitly returns `Cache-Control: no-store`. |

The live page uses the same local ticker data module as the API route instead of
fetching its own origin during `next build`. This avoids a build-time self-fetch
failure while preserving request-time, no-store semantics.

## Run locally

```sh
npm install
npm run dev
```

Validate the production pipeline with:

```sh
npm run build
npm run lint
```

## Content

Markdown articles live in `content/article-*.md`. Each file provides title,
date, author, excerpt, cover image, and tags through YAML front matter.
`lib/articles.ts` exposes typed sorted listing and slug lookup functions.

## Image optimization

Article covers use `next/image` with explicit dimensions, responsive `sizes`,
and priority only for the first visible card or article hero. Next.js is
configured for AVIF and WebP output. The local source image was reused from an
existing curriculum asset to avoid unnecessary generation.

## Deployment

Vercel is the intended deployment target for this Next.js application, but
deployment was **not performed** during this local-only curriculum run. There
is no live production URL to report. No external Lighthouse run was performed
and no Lighthouse score is claimed; `lighthouse-report.html` truthfully records
the local build and source audit instead.

## Further documentation

- `ai-prompt.md` — AI prompts, raw suggestions, and reviewed changes.
- `architecture-diagram.md` — Mermaid diagram of rendering and data flow.
- `lighthouse-report.html` — nonempty local source/build audit artifact.
