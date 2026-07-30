# Signal Content Hub Architecture

```mermaid
flowchart TD
    Content[Markdown files\ncontent/article-*.md] --> Library[Typed article library\nlib/articles.ts]
    Library --> Home[Home page\nSSG]
    Library --> Listing[Article listing\nISR: 60 seconds]
    Library --> Detail[Article detail\nSSG + ISR: 60 seconds]

    TickerData[Shared ticker data\nlib/ticker.ts] --> Live[Live ticker page\nSSR + no-store]
    TickerData --> API[GET /api/ticker\nDynamic JSON + no-store]

    Home --> Images[next/image\nAVIF + WebP]
    Listing --> Images
    Detail --> Images

    Home --> Vercel[Vercel\nintended deployment target]
    Listing --> Vercel
    Detail --> Vercel
    Live --> Vercel
    API --> Vercel
```

## Rendering boundaries

- **SSG:** stable home content and every known Markdown article path are
  generated at build time.
- **ISR:** the article listing and details revalidate after sixty seconds so
  editorial updates do not require a full rebuild.
- **SSR:** the ticker opts out of storage and renders a fresh timestamp on each
  request.
- **Shared server data:** the live page and API use `lib/ticker.ts`, preventing
  a build-time fetch to an application server that is not running yet.
- **Deployment:** Vercel is shown only as the intended target. This local-only
  curriculum run did not deploy the application.
