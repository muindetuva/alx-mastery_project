# AI Prompt and Review Log

## Markdown content architecture

**Tool:** ChatGPT

**Exact prompt:**

> Design a typed content-loading layer for a strict TypeScript Next.js App
> Router publication. Articles are local content/article-*.md files with YAML
> title, date, author, excerpt, coverImage, and tags. Use gray-matter and remark
> with remark-html. Provide Article and ArticleSummary types, getAllArticles
> sorted newest first, and an async getArticleBySlug that safely returns null
> for an unknown slug. Keep file-system access server-only.

**Raw direction received:** ChatGPT suggested a shared content directory, a
single `Article` interface with optional HTML, synchronous front-matter reads,
and async Markdown transformation in the detail lookup.

**Customizations after review:**

1. Split `ArticleSummary` from `Article` so listing components never receive a
   misleading optional content field.
2. Added a strict `article-*.md` filename filter so unrelated Markdown files
   cannot become public routes.
3. Sanitized requested slugs before building a file-system path.
4. Returned `null` for missing content so the page can invoke Next's
   `notFound()` behavior.
5. Exported `getBySlug` as a compatibility alias while keeping the clearer
   `getArticleBySlug` name.

## Image optimization review

**Tool:** ChatGPT

**Exact prompt:**

> Audit a Next.js article hub's image strategy. Give 3–5 concrete optimization
> suggestions covering next/image, dimensions, responsive sizes, loading
> priority, AVIF/WebP configuration, remote patterns, and loading UI. Explain
> which images should not receive priority.

**Suggestions received:**

1. Replace ordinary image elements with `next/image`.
2. Provide intrinsic width and height to reserve layout space.
3. Add a realistic `sizes` expression for cards and full-width article heroes.
4. Prioritize only the first above-the-fold card and the article hero.
5. Enable AVIF and WebP formats and constrain any remote sources.

**Implemented changes:** All five suggestions were implemented. Cards accept a
typed `priority` prop, below-the-fold images retain lazy defaults, article
heroes use a bounded 1152-pixel desktop size, and `next.config.ts` limits the
only allowed remote hostname even though the current content uses a reused
local image. A route-level `loading.tsx` reserves the article layout while a
route is loading.

## Rendering review

**Tool:** ChatGPT

**Exact prompt:**

> Review a Next.js content architecture with static Markdown articles, a live
> ticker, and a JSON ticker API. Assign SSG, SSR, or ISR to each surface. Avoid
> a build-time request from the live page to its own API, preserve explicit
> no-store behavior, and make freshness visible in the interface.

**Customizations after review:**

1. Used a shared server-only ticker module for both the page and API route.
2. Kept the live page `force-dynamic` and called `noStore()` instead of
   performing a fragile self-fetch during `next build`.
3. Applied a sixty-second ISR window to both article listing and detail pages.
4. Added visible generated or last-updated timestamps to every freshness-aware
   surface.

## Final human review

AI was used to compare options and expose failure modes. Content, types,
metadata, accessibility, rendering boundaries, build behavior, and all claims
about deployment and auditing were reviewed by hand. No deployment URL,
Lighthouse execution, or performance score has been invented.
