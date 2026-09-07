/**
 * Design tokens transcribed verbatim from the Banjoosa design handoff README.
 * Both apps/web and apps/admin extend Tailwind's theme with this object so
 * colors/fonts/spacing/shadows never get hardcoded ad hoc in components.
 */
const colors = {
  ink: "#1a1512",
  brand: {
    red: "#e33127",
    "red-dark": "#b8241c",
    yellow: "#ffd21f",
  },
  cream: "#fff8e8",
  card: "#f4e6c8",
  body: "#4a423a",
  meta: "#6b6257",
};

const fontFamily = {
  display: ["'Luckiest Guy'", "cursive"],
  ui: ["'Barlow Condensed'", "sans-serif"],
  body: ["Archivo", "Helvetica", "sans-serif"],
};

/** Flat "sticker" offset shadows — no blur, per handoff. */
const boxShadow = {
  sticker: "6px 6px 0 #1a1512",
  "sticker-lg": "8px 8px 0 #1a1512",
  "sticker-xl": "12px 12px 0 rgba(26,21,18,0.4)",
  "sticker-soft": "5px 5px 0 rgba(26,21,18,0.2)",
  "sticker-soft-lg": "6px 6px 0 rgba(26,21,18,0.18)",
};

const borderRadius = {
  card: "6px",
  "card-lg": "8px",
};

module.exports = {
  colors,
  fontFamily,
  boxShadow,
  borderRadius,
  extend: {
    colors,
    fontFamily,
    boxShadow,
    borderRadius,
    maxWidth: {
      page: "1200px",
    },
  },
};
