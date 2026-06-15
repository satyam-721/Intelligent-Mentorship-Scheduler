/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
        "surface-bright": "#373a37",
        "primary-fixed-dim": "#95d4b2",
        "on-tertiary-fixed-variant": "#703537",
        "tertiary-fixed-dim": "#ffb3b4",
        "tertiary-fixed": "#ffdad9",
        "surface-tint": "#95d4b2",
        "on-primary-container": "#a9e9c6",
        "surface-container-highest": "#323633",
        "surface-container-lowest": "#0c0f0d",
        "on-surface-variant": "#bfc9c1",
        "inverse-on-surface": "#2e312f",
        "on-error": "#690005",
        "tertiary": "#ffb3b4",
        "secondary-container": "#015235",
        "on-secondary-fixed": "#002113",
        "error-container": "#93000a",
        "on-primary-fixed": "#002113",
        "surface-container-low": "#191c1a",
        "primary-container": "#2e6b4f",
        "on-tertiary-fixed": "#390a0f",
        "error": "#ffb4ab",
        "on-primary": "#003824",
        "surface-container-high": "#272b28",
        "primary": "#95d4b2",
        "on-secondary": "#003823",
        "on-secondary-container": "#7fc39f",
        "surface": "#111412",
        "on-surface": "#e1e3df",
        "tertiary-container": "#8e4d4f",
        "primary-fixed": "#b0f1cd",
        "on-error-container": "#ffdad6",
        "on-tertiary": "#541f22",
        "outline": "#8a938c",
        "background": "#111412",
        "inverse-primary": "#2c694d",
        "outline-variant": "#404943",
        "on-background": "#e1e3df",
        "secondary-fixed": "#acf2cb",
        "secondary": "#90d5b0",
        "surface-variant": "#323633",
        "on-secondary-fixed-variant": "#015235",
        "surface-dim": "#111412",
        "on-tertiary-container": "#ffcfcf",
        "secondary-fixed-dim": "#90d5b0",
        "surface-container": "#1d201e",
        "inverse-surface": "#e1e3df",
        "on-primary-fixed-variant": "#0e5137"
      },
      "borderRadius": {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      "spacing": {
        "unit": "4px",
        "xs": "4px",
        "xl": "32px",
        "3xl": "64px",
        "lg": "24px",
        "margin-desktop": "32px",
        "md": "16px",
        "sm": "8px",
        "2xl": "48px",
        "margin-mobile": "16px",
        "gutter": "16px"
      },
      "fontFamily": {
        "body-md": ["Space Grotesk", "sans-serif"],
        "headline-md": ["EB Garamond", "serif"],
        "display": ["EB Garamond", "serif"],
        "label-md": ["Sora", "sans-serif"],
        "headline-lg-mobile": ["EB Garamond", "serif"],
        "headline-lg": ["EB Garamond", "serif"],
        "label-sm": ["Sora", "sans-serif"],
        "body-lg": ["Space Grotesk", "sans-serif"]
      },
      "fontSize": {
        "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "500"}],
        "display": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "600"}],
        "label-md": ["14px", {"lineHeight": "1.4", "letterSpacing": "0.02em", "fontWeight": "500"}],
        "headline-lg-mobile": ["24px", {"lineHeight": "1.2", "fontWeight": "600"}],
        "headline-lg": ["32px", {"lineHeight": "1.2", "fontWeight": "600"}],
        "label-sm": ["12px", {"lineHeight": "1.4", "fontWeight": "400"}],
        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}]
      },
      "keyframes": {
        "shimmer": {
          "100%": {
            "transform": "translateX(100%)"
          }
        }
      },
      "animation": {
        "shimmer": "shimmer 1.5s infinite"
      }
    },
  },
  plugins: [],
}
