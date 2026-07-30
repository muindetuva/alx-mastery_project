# AI Styling Prompt and Review

## Exact prompt

> Create a reusable glassmorphism theme for a portfolio written in Sass. Use
> existing variables for the primary colour, surface colour, text colour,
> dark background, and dark text. Provide a `.glass-panel` class and a dark
> theme variant. Keep the effect readable, subtle, and suitable for cards and
> a sticky header. Return only Sass.

## Raw AI output

```scss
.glass-panel {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  backdrop-filter: blur(12px);
}

.dark-theme .glass-panel {
  background: rgba(18, 18, 28, 0.7);
  border-color: rgba(255, 255, 255, 0.12);
}
```

## Reviewed adaptations

The raw suggestion hard-coded every colour and used a blue-heavy shadow that
did not match the project palette. I replaced those values with variables from
`_variables.scss`, adjusted the border opacity for stronger contrast, and used
relative `rem` sizing. I also added a deliberate dark-theme shadow so the
effect remains visible without reducing text readability. The reviewed version
is stored in `scss/_theme.scss`, with its browser-ready equivalent in
`css/styles.css`.
