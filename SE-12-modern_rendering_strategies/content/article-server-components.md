---
title: "Server Components as a Content Boundary"
date: "2026-07-02"
author: "Roberto Silva"
excerpt: "Using server components to keep content transformation near its source and client JavaScript focused on real interaction."
coverImage: "/covers/content-hub.png"
tags:
  - React
  - Server Components
  - Content
---

Article pages are a natural fit for server components. Markdown parsing, file access, and metadata generation can remain on the server, while the browser receives finished HTML instead of a bundle containing the publishing pipeline.

## Draw the boundary around behavior

Do not add a client boundary simply because a component is visually complex. Typography, article cards, and image layouts can all be rendered on the server. Reserve client components for stateful filters, input, or browser-specific APIs.

This boundary improves more than bundle size. It reduces the number of loading states a reader can encounter and keeps sensitive data access away from the client.

## Keep data functions explicit

A small typed library between content files and pages gives both sides a stable contract. Pages should not know how front matter is parsed, and the parser should not know how a card is designed. That separation makes future storage changes much less disruptive.
