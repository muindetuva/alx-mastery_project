# UI Design and Development

This project is a high-end SaaS landing page for **FlowPilot**, a fictional
workflow platform. It uses semantic HTML, Tailwind CSS v4, the Vite build
pipeline, container queries, and vanilla JavaScript.

## Features

- Responsive hero, feature, pricing, testimonial, and contact sections.
- Accessible mobile navigation and icon-only theme controls.
- Three pricing tiers laid out with CSS container-query variants.
- Persistent light/dark theme stored in `localStorage`.
- Modular Tailwind v4 source with a custom palette and utility.

## Development

```sh
npm install
npm run dev
```

Create a production build with:

```sh
npm run build
```

The CSS build script compiles `src/input.css` to `src/output.css` before Vite
creates the production bundle.

## Documentation

- `ai-prompt.md` records AI prompts and all reviewed design changes.
- `audit.md` records the local source audit and implementation decisions.
