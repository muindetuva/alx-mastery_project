---
title: "Designing Observable Freshness"
date: "2026-06-26"
author: "Kwesi Boateng"
excerpt: "A guide to choosing static, regenerated, and request-time rendering by making freshness requirements visible."
coverImage: "/covers/content-hub.png"
tags:
  - SSR
  - SSG
  - Product Design
---

Users rarely ask whether a page was statically generated. They ask whether its information is trustworthy. Rendering strategy should begin with that expectation: how fresh must this value be, and what happens if the upstream source is unavailable?

## Separate stories from signals

Long-form articles are durable stories. They can be generated ahead of time and regenerated after edits. A live ticker is a signal whose value depends on the current request. Treating both surfaces identically either wastes runtime work or presents stale data as live.

## Explain the state

A visible update timestamp is a small but important product feature. It helps readers interpret the number and helps engineers validate caching behavior. If a live source fails, preserve the page shell and explain the degraded state instead of returning an empty experience.

The best rendering architecture is not the one with the most modes. It is the one where every mode corresponds to a clear user promise.
