# SE-09 — Modern Web Languages

This project is an accessible, responsive portfolio that combines semantic
HTML, modular Sass, compiled-equivalent CSS, vanilla JavaScript, and JSON data.

## Files

- `index.html` — semantic portfolio structure and accessible content.
- `scss/` — variables, mixins, theme, and main Sass source files.
- `css/styles.css` — browser-ready styles corresponding to the Sass source.
- `js/script.js` — navigation, filtering, themes, and form behaviour.
- `data/projects.json` — portfolio project data loaded at runtime.
- `images/` — local project imagery with explicit dimensions and alt text.
- `ai-prompt.md` — the styling prompt, raw response, and reviewed adaptations.
- `lighthouse-report.html` — truthful local accessibility/performance audit.

## Run locally

Serve this directory with a local HTTP server so `fetch()` can load the JSON:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/SE-09-modern_web_languages/`.

## Implementation notes

The responsive styles are authored in Sass and maintained in
`css/styles.css` as compiled-equivalent CSS. The page supports keyboard-safe
navigation, dark-theme persistence, client-side project filtering, and
accessible form feedback without third-party libraries.
