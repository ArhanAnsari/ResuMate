/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./shared/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // === PRIMARY (Indigo) ===
        primary: "#4F46E5",
        "primary-light": "#818CF8",
        "primary-dark": "#3730A3",
        "primary-glow": "#6366F1",

        // === PREMIUM (Violet) ===
        premium: "#7C3AED",
        "premium-light": "#A78BFA",
        "premium-dark": "#5B21B6",

        // === SECONDARY (Emerald) ===
        secondary: "#10B981",
        "secondary-light": "#34D399",
        "secondary-dark": "#059669",

        // === SURFACES ===
        background: "#F8FAFC",
        "background-dark": "#0A0F1E",
        surface: "#FFFFFF",
        "surface-dark": "#111827",
        card: "#FFFFFF",
        "card-dark": "#1C2333",

        // === TEXT ===
        foreground: "#0F172A",
        "foreground-dark": "#F1F5F9",
        muted: "#64748B",
        "muted-dark": "#94A3B8",

        // === BORDERS ===
        border: "#E2E8F0",
        "border-dark": "#1E293B",

        // === SEMANTIC ===
        error: "#EF4444",
        success: "#10B981",
        warning: "#F59E0B",
        info: "#4F46E5",
        destructive: "#EF4444",
        "destructive-foreground": "#FFFFFF",
        input: "#E2E8F0",
        ring: "#4F46E5",

        // Legacy compat
        "muted-foreground": "#64748B",
        "accent-foreground": "#0F172A",
        "card-foreground": "#0F172A",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
        xxxl: "64px",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      fontFamily: {
        regular: ["System"],
        medium: ["System"],
        semibold: ["System"],
        bold: ["System"],
      },
    },
  },
  plugins: [],
};
