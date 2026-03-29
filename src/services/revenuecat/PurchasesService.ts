import { Platform } from "react-native";
import Purchases, {
    CustomerInfo,
    LOG_LEVEL
} from "react-native-purchases";

const API_KEY_IOS = "test_RvqSPPncOyOmMmpxoJxpzlwPprX"; // Replace with a specific iOS key if different
const API_KEY_ANDROID = "test_RvqSPPncOyOmMmpxoJxpzlwPprX"; // Replace with a specific Android key if different

const ENTITLEMENT_ID = "ResuMate Pro";

export const PurchasesService = {
  /**
   * Initialize RevenueCat SDK
   */
  async init() {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG); // Helpful during development

    if (Platform.OS === "ios") {
      Purchases.configure({ apiKey: API_KEY_IOS });
    } else if (Platform.OS === "android") {
      Purchases.configure({ apiKey: API_KEY_ANDROID });
    }
  },

  /**
   * Get Current Customer Info to check for Pro status
   */
  async getCustomerInfo(): Promise<CustomerInfo> {
    try {
      return await Purchases.getCustomerInfo();
    } catch (error) {
      console.error("Error fetching customer info", error);
      throw error;
    }
  },

  /**
   * Check if user has active Pro entitlement
   */
  async checkIsPro(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      return (
        typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined"
      );
    } catch (error) {
      return false;
    }
  },

  /**
   * Restore Purchases
   */
  async restorePurchases(): Promise<CustomerInfo> {
    try {
      return await Purchases.restorePurchases();
    } catch (error) {
      console.error("Restore purchases failed:", error);
      throw error;
    }
  },
};
