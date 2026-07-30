# UI Design and Development Audit

## AI-assisted versus hand-built work

ChatGPT helped generate early directions for the hero and pricing sections.
The exact prompts, raw directions, findings, and at least three reviewed changes
for each section are recorded in `ai-prompt.md`. The semantic HTML structure,
accessibility pass, Tailwind v4 integration, JavaScript behavior, dark theme,
and final responsive decisions were built and reviewed by hand.

## AI section findings

### Hero

1. The suggested two-column composition gave the page a useful focal point.
2. The suggested customer-logo strip implied unsupported social proof and was
   removed.
3. The decorative dashboard needed meaningful labels to communicate product
   value rather than acting as visual noise.

### Pricing

1. Three tiers made comparison straightforward.
2. Generic feature wording did not explain real plan differences and was
   rewritten.
3. A high-contrast recommended tier worked only after dark-mode colors and
   the middle container width were considered.

## Repeated utilities and `@apply`

I used `@apply` only for two stable, repeated abstractions:
`.section-shell` and `.glass-card`. Keeping one-off layout and state utilities
in the HTML preserves Tailwind's visible design logic. Moving every repeated
string into component CSS would hide useful context and recreate a traditional
class abstraction layer without a clear payoff.

## Utility-first CSS versus SCSS

Utility-first CSS made responsive states, hover feedback, spacing, and dark
variants visible beside each element. SCSS is stronger when a project needs
complex calculations, deeply shared component APIs, or generated selectors.
For this page, Tailwind v4 theme tokens and custom utilities supplied the small
amount of reuse needed without a second preprocessor.

## Local responsive source verification

Only locally available source and build tools were used. No external browser,
validator, Lighthouse service, or deployment check is claimed.

- **Below 480 px:** Navigation uses its accessible toggle, CTAs stack, and the
  hero dashboard remains a single column. Fixed an early draft where the header
  CTA crowded the two icon controls by hiding it below the `sm` breakpoint.
- **At 768 px:** Desktop navigation appears, feature/testimonial grids become
  two columns, and the pricing container uses two columns. Fixed the third
  pricing card by spanning it across both columns at this width.
- **At 1024 px:** Hero content becomes two columns, features use four cards,
  testimonials use three columns, and pricing uses three equal columns. Fixed
  the contact layout so the introduction and form share the available width.

## Production safeguards

- Tailwind is built locally through Vite; there is no CDN dependency.
- JavaScript toggles only complete, statically present class names. It does not
  concatenate dynamic Tailwind classes.
- Icon-only controls have accessible labels and menu state is exposed with
  `aria-expanded`.
- Theme preference is restored from `localStorage` using the `theme` key.
