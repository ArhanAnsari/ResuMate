import Purchases from "react-native-purchases";
import { create } from "zustand";
import { PurchasesService } from "../services/revenuecat/PurchasesService";

interface RCState {
  isPro: boolean;
  checkStatus: () => Promise<void>;
  setupListener: () => void;
}

export const useRevenueCatStore = create<RCState>((set) => ({
  isPro: false,
  checkStatus: async () => {
    try {
      const isPro = await PurchasesService.checkIsPro();
      set({ isPro });
    } catch (e) {
      console.error(e);
      set({ isPro: false });
    }
  },
  setupListener: () => {
    // Listen for changes in customer info (e.g., subscription expired, or new purchase synced)
    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      const isPro =
        typeof customerInfo.entitlements.active["ResuMate Pro"] !== "undefined";
      set({ isPro });
    });
  },
}));
