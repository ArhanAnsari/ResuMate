/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // Blue 600
        primaryDark: '#1E40AF',
        secondary: '#64748B', // Slate 500
        background: '#F8FAFC', // Slate 50
        surface: '#FFFFFF',
        text: '#0F172A', // Slate 900
        textSecondary: '#475569', // Slate 600
        textTertiary: '#94A3B8', // Slate 400
        border: '#E2E8F0', // Slate 200
        error: '#EF4444',
        success: '#22C55E',
        warning: '#F59E0B',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      fontFamily: {
        regular: ['System'],
        medium: ['System'],
        semibold: ['System'],
        bold: ['System'],
      }
    },
  },
  plugins: [],
}

