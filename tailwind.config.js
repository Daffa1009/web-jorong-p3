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
        // ─── Primary: Cyprus ───────────────────────────────────────
        primary: {
          DEFAULT: "#004643",
          50:  "#E6EFEE",
          100: "#CCDFDD",
          200: "#99BFBB",
          300: "#669F99",
          400: "#337F77",
          500: "#004643",
          600: "#003835",
          700: "#002A28",
          800: "#001C1B",
          900: "#000E0D",
        },
        // ─── Gold accent ───────────────────────────────────────────
        gold: {
          DEFAULT: "#F2A65A",
          light:   "#F7C48A",
          dark:    "#D4854A",
        },
        // ─── Backgrounds & Surfaces ────────────────────────────────
        surface:     "#FFFFFF",
        background:  "#FAFAFA",
        // ─── Text ──────────────────────────────────────────────────
        "text-primary":   "#0D1B1E",
        "text-secondary": "#4A6572",
        "text-muted":     "#8FA3AC",
        // ─── Border ────────────────────────────────────────────────
        border: "#E2E8EA",
        // ─── Semantic ──────────────────────────────────────────────
        success: "#004643",
        error:   "#C0392B",

        // ─── Legacy aliases (kept so existing JSX still resolves) ──
        // These map the old Material-Design token names to new values
        // so we don't need to touch every class in the JSX files.
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low":    "#F5F8F9",
        "surface-container":        "#EEF3F4",
        "surface-container-high":   "#E6EDEF",
        "surface-container-highest":"#DDEAEB",
        "surface-dim":              "#FAFAFA",
        "surface-bright":           "#FFFFFF",
        "surface-variant":          "#E6EFEE",
        "surface-tint":             "#004643",
        "on-surface":               "#0D1B1E",
        "on-surface-variant":       "#4A6572",
        "on-background":            "#0D1B1E",
        "on-primary":               "#FFFFFF",
        "on-secondary":             "#FFFFFF",
        "on-tertiary":              "#FFFFFF",
        "on-error":                 "#FFFFFF",
        "on-primary-container":     "#FFFFFF",
        "on-secondary-container":   "#0D1B1E",
        "on-tertiary-container":    "#0D1B1E",
        "on-secondary-fixed":       "#0D1B1E",
        "on-secondary-fixed-variant":"#4A6572",
        "on-primary-fixed":         "#FFFFFF",
        "on-primary-fixed-variant": "#003835",
        "on-tertiary-fixed":        "#0D1B1E",
        "on-tertiary-fixed-variant":"#4A6572",
        "on-error-container":       "#C0392B",
        "inverse-surface":          "#0D1B1E",
        "inverse-on-surface":       "#FFFFFF",
        "inverse-primary":          "#99BFBB",
        "primary-container":        "#003835",
        "primary-fixed":            "#CCDFDD",
        "primary-fixed-dim":        "#99BFBB",
        "secondary-container":      "#F7C48A",
        "secondary-fixed":          "#F7C48A",
        "secondary-fixed-dim":      "#F2A65A",
        "secondary":                "#F2A65A",
        "tertiary":                 "#4A6572",
        "tertiary-container":       "#8FA3AC",
        "tertiary-fixed":           "#E2E8EA",
        "tertiary-fixed-dim":       "#8FA3AC",
        "outline":                  "#8FA3AC",
        "outline-variant":          "#E2E8EA",
        "error":                    "#C0392B",
        "error-container":          "#FDDEDE",
      },

      fontFamily: {
        sans:    ["Plus Jakarta Sans", "Inter", "sans-serif"],
        heading: ["Plus Jakarta Sans", "sans-serif"],
        // Legacy custom font tokens
        "hero-lg":          ["Plus Jakarta Sans"],
        "section-title":    ["Plus Jakarta Sans"],
        "body-md":          ["Inter"],
        "label-sm":         ["Inter"],
        "hero-lg-mobile":   ["Plus Jakarta Sans"],
      },

      fontSize: {
        "hero-lg":        ["48px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "800" }],
        "section-title":  ["24px", { lineHeight: "1.4", fontWeight: "700" }],
        "body-md":        ["16px", { lineHeight: "1.7", fontWeight: "400" }],
        "label-sm":       ["14px", { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "500" }],
        "hero-lg-mobile": ["32px", { lineHeight: "1.2", fontWeight: "800" }],
        "label-md":       ["16px", { lineHeight: "1.5", fontWeight: "500" }],
      },

      borderRadius: {
        DEFAULT: "0.25rem",
        lg:   "0.5rem",
        xl:   "12px",
        "2xl": "16px",
        "3xl": "24px",
        full: "9999px",
      },

      boxShadow: {
        soft:   "0 2px 8px rgba(0,70,67,0.08)",
        medium: "0 4px 16px rgba(0,70,67,0.12)",
        large:  "0 8px 32px rgba(0,70,67,0.16)",
        card:   "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,70,67,0.08)",
      },

      spacing: {
        lg:               "40px",
        gutter:           "24px",
        md:               "24px",
        sm:               "16px",
        xl:               "80px",
        base:             "8px",
        "margin-desktop": "auto",
        "max-width":      "1280px",
        "margin-mobile":  "16px",
      },
    },
  },
  plugins: [],
};
