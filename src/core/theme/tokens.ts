export const Colors = {
  primary: {
    DEFAULT: "#4F46E5", // Indigo-600
    light: "#818CF8", // Indigo-400
    dark: "#3730A3", // Indigo-800
    glow: "#6366F1", // Indigo-500
    foreground: "#FFFFFF",
  },
  premium: {
    DEFAULT: "#7C3AED", // Violet-600
    light: "#A78BFA", // Violet-400
    dark: "#5B21B6", // Violet-800
    foreground: "#FFFFFF",
  },
  secondary: {
    DEFAULT: "#10B981", // Emerald-500
    light: "#34D399",
    dark: "#059669",
    foreground: "#FFFFFF",
  },
  background: {
    light: "#F8FAFC", // Slate-50
    dark: "#0A0F1E", // Near-black with blue tint
  },
  surface: {
    light: "#FFFFFF",
    dark: "#111827", // Gray-900
    card: {
      light: "#FFFFFF",
      dark: "#1C2333",
    },
    elevated: {
      light: "#F1F5F9",
      dark: "#1E293B",
    },
  },
  text: {
    primary: {
      light: "#0F172A",
      dark: "#F1F5F9",
    },
    secondary: {
      light: "#64748B",
      dark: "#94A3B8",
    },
    muted: {
      light: "#94A3B8",
      dark: "#475569",
    },
  },
  border: {
    light: "#E2E8F0",
    dark: "#1E293B",
    focus: {
      light: "#4F46E5",
      dark: "#6366F1",
    },
  },
  status: {
    success: "#10B981",
    successBg: { light: "#ECFDF5", dark: "#022C22" },
    error: "#EF4444",
    errorBg: { light: "#FEF2F2", dark: "#2D0A0A" },
    warning: "#F59E0B",
    warningBg: { light: "#FFFBEB", dark: "#2D1600" },
    info: "#4F46E5",
    infoBg: { light: "#EEF2FF", dark: "#1E1B4B" },
  },
  gradient: {
    hero: ["#4F46E5", "#7C3AED"],
    card: ["rgba(79,70,229,0.08)", "rgba(124,58,237,0.04)"],
    ai: ["#EC4899", "#8B5CF6", "#3B82F6"],
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 12,
  },
  premium: {
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
};
