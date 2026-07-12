/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-container": "#00873a",
        "surface-variant": "#d9e3f6",
        "primary": "#006b2c",
        "on-surface-variant": "#3e4a3d",
        "outline-variant": "#bdcaba",
        "on-error-container": "#93000a",
        "tertiary-fixed-dim": "#c6c6c7",
        "surface-bright": "#f8f9ff",
        "on-tertiary-fixed": "#1a1c1c",
        "tertiary-fixed": "#e2e2e2",
        "tertiary-container": "#737575",
        "on-background": "#121c2a",
        "error": "#ba1a1a",
        "surface-dim": "#d0dbed",
        "on-tertiary-container": "#fcfcfc",
        "inverse-primary": "#62df7d",
        "secondary-fixed-dim": "#ffba46",
        "on-primary-container": "#f7fff2",
        "secondary-container": "#feb63c",
        "secondary-fixed": "#ffddb0",
        "on-surface": "#121c2a",
        "surface-container": "#e6eeff",
        "on-primary": "#ffffff",
        "on-error": "#ffffff",
        "surface-container-high": "#dee9fc",
        "inverse-surface": "#27313f",
        "on-secondary-container": "#6e4900",
        "primary-fixed": "#7ffc97",
        "tertiary": "#5a5c5c",
        "primary-fixed-dim": "#62df7d",
        "secondary": "#805600",
        "on-primary-fixed": "#002109",
        "background": "#f8f9ff",
        "on-secondary-fixed": "#281800",
        "error-container": "#ffdad6",
        "on-secondary": "#ffffff",
        "outline": "#6e7b6c",
        "surface-tint": "#006e2d",
        "surface-container-highest": "#d9e3f6",
        "on-secondary-fixed-variant": "#614000",
        "on-tertiary": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "inverse-on-surface": "#eaf1ff",
        "surface-container-low": "#eff4ff",
        "surface": "#f8f9ff",
        "on-tertiary-fixed-variant": "#454747",
        "on-primary-fixed-variant": "#005320"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "lg": "40px",
        "gutter": "24px",
        "md": "24px",
        "sm": "16px",
        "xl": "80px",
        "base": "8px",
        "margin-desktop": "auto",
        "max-width": "1280px",
        "margin-mobile": "16px"
      },
      fontFamily: {
        "hero-lg": ["Plus Jakarta Sans"],
        "section-title": ["Plus Jakarta Sans"],
        "body-md": ["Inter"],
        "label-sm": ["Inter"],
        "hero-lg-mobile": ["Plus Jakarta Sans"]
      },
      fontSize: {
        "hero-lg": ["48px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "section-title": ["24px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-sm": ["14px", { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "500" }],
        "hero-lg-mobile": ["32px", { lineHeight: "1.2", fontWeight: "700" }]
      }
    }
  },
  plugins: [],
};
