# AI Design Collaboration Log

## Hero section

**Tool:** ChatGPT

**Exact prompt:**

> Design the content and Tailwind CSS v4 utility structure for a high-end SaaS
> landing-page hero. It must include an eyebrow, one balanced h1, a concise
> subheadline, primary and secondary CTAs, trust copy, and an abstract product
> dashboard visual. Use a mobile-first stacked layout that becomes two columns
> on large screens. Suggest real copy for a workflow product named FlowPilot.

**Raw direction received:** ChatGPT proposed a gradient headline, two-column
hero, dashboard card with three metrics, two CTA buttons, and a “trusted by”
logo strip beneath the buttons.

**Changes made after review:**

1. Removed the generic logo strip and used useful no-credit-card setup copy.
2. Replaced the gradient headline with a single brand-colour phrase to improve
   contrast and keep the visual hierarchy calmer.
3. Rebuilt the dashboard illustration from semantic text and decorative blocks
   instead of inaccessible image-only content.
4. Added `text-balance`, a maximum reading width, and responsive type sizes.

**Findings:** The two-column concept was strong; the suggested social proof was
unsupported; and the first dashboard suggestion depended too heavily on
decorative gradients without conveying product meaning.

## Pricing section

**Tool:** ChatGPT

**Exact prompt:**

> Propose three SaaS pricing tiers for FlowPilot and a responsive Tailwind CSS
> v4 container-query layout. Each tier needs a name, price, short audience
> description, at least three features, and a CTA. Mark exactly one tier as
> recommended. The grid must use @container with @md and @lg variants.

**Raw direction received:** ChatGPT suggested Free, Pro, and Enterprise tiers,
recommended Pro, and placed the recommended tier in a bright solid card.

**Changes made after review:**

1. Renamed “Pro” to “Momentum” so the tier fits the product voice.
2. Replaced vague feature claims with concrete collaborator, automation,
   reporting, security, and support differences.
3. Added `@md:grid-cols-2` and `@lg:grid-cols-3` to the container-query grid.
4. Let the third tier span both columns at the middle container width so an
   orphaned card does not look accidental.

**Findings:** The three-tier hierarchy was useful; the first copy was too
generic to support a buying decision; and the recommended card needed stronger
contrast in both light and dark themes.

## Final design review

ChatGPT was used as a design partner for alternatives, not as an unchecked
generator. The final information architecture, accessible names, responsive
states, theme implementation, and all reviewed copy were implemented by hand.
