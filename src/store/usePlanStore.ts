import { APP_CONFIG } from "@/src/core/config/app";
import { Platform } from "react-native";
import Purchases, {
    CustomerInfo,
    LOG_LEVEL,
    PurchasesOfferings,
    PurchasesPackage,
} from "react-native-purchases";
import { create } from "zustand";

export type PlanTier = "free" | "pro" | "premium";

interface PlanState {
  currentPlan: PlanTier;
  isLoading: boolean;
  error: string | null;
  offerings: PurchasesOfferings | null;

  initPurchases: (userId?: string) => Promise<void>;
  refreshPlan: () => Promise<void>;
  fetchOfferings: () => Promise<void>;
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<void>;
}

function resolvePlan(info: CustomerInfo): PlanTier {
  const active = info.entitlements.active;
  if (active[APP_CONFIG.REVENUECAT.ENTITLEMENTS.PREMIUM]) return "premium";
  if (active[APP_CONFIG.REVENUECAT.ENTITLEMENTS.PRO]) return "pro";
  return "free";
}

export const usePlanStore = create<PlanState>((set, get) => ({
  currentPlan: "free",
  isLoading: false,
  error: null,
  offerings: null,

  initPurchases: async (userId?: string) => {
    try {
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      const apiKey =
        Platform.OS === "ios"
          ? APP_CONFIG.REVENUECAT.IOS_API_KEY
          : APP_CONFIG.REVENUECAT.ANDROID_API_KEY;

      Purchases.configure({ apiKey, appUserID: userId });

      // Fetch current plan and offerings in parallel
      const [info, offerings] = await Promise.all([
        Purchases.getCustomerInfo(),
        Purchases.getOfferings(),
      ]);

      set({
        currentPlan: resolvePlan(info),
        offerings,
      });
    } catch (error: any) {
      console.error("[RevenueCat] Init error:", error);
      // Non-fatal — app works in free tier if RC is misconfigured
    }
  },

  refreshPlan: async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      set({ currentPlan: resolvePlan(info) });
    } catch (error: any) {
      console.error("[RevenueCat] Refresh error:", error);
    }
  },

  fetchOfferings: async () => {
    set({ isLoading: true, error: null });
    try {
      const offerings = await Purchases.getOfferings();
      set({ offerings, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  purchasePackage: async (pkg: PurchasesPackage): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      set({ currentPlan: resolvePlan(customerInfo), isLoading: false });
      return true;
    } catch (error: any) {
      // User cancelled — not an error worth surfacing
      if (error.userCancelled) {
        set({ isLoading: false });
        return false;
      }
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  restorePurchases: async () => {
    set({ isLoading: true, error: null });
    try {
      const info = await Purchases.restorePurchases();
      set({ currentPlan: resolvePlan(info), isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
