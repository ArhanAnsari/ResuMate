import { create } from "zustand";

// ResuMate is now 100% free — all features are available to every user.
export type PlanTier = "free";

interface PlanState {
  currentPlan: PlanTier;
}

export const usePlanStore = create<PlanState>(() => ({
  currentPlan: "free",
}));
