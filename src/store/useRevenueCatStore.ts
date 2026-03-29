import { create } from "zustand";

// RevenueCat integration removed — ResuMate is now 100% free.
interface RCState {
  isPro: boolean;
}

export const useRevenueCatStore = create<RCState>(() => ({
  isPro: false,
}));
