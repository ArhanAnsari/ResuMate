import { useToast } from "@/src/context/ToastContext";
import { APP_CONFIG } from "@/src/core/config/app";
import { useAuthStore } from "@/src/store/useAuthStore";
import { usePlanStore, type PlanTier } from "@/src/store/usePlanStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Plan definitions ────────────────────────────────────────────────────────

type BillingCycle = "monthly" | "annual";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PlanConfig {
  id: PlanTier;
  name: string;
  tagline: string;
  monthlyPrice: string;
  annualPrice: string;
  annualMonthly: string; // per-month when billed annually
  savingsLabel: string;
  accentColor: string;
  bgClass: string;
  borderClass: string;
  badge?: string;
  features: PlanFeature[];
}

const PLANS: PlanConfig[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Get started at no cost",
    monthlyPrice: "$0",
    annualPrice: "$0",
    annualMonthly: "$0",
    savingsLabel: "",
    accentColor: "#64748B",
    bgClass: "bg-slate-100 dark:bg-slate-900",
    borderClass: "border-slate-200 dark:border-slate-700",
    features: [
      { text: "Up to 3 resumes", included: true },
      { text: "2 basic templates", included: true },
      { text: "PDF export", included: true },
      { text: "5 AI requests / month", included: true },
      { text: "Word (.docx) export", included: false },
      { text: "ATS Score analysis", included: false },
      { text: "Cover Letter generator", included: false },
      { text: "All 8 templates", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For serious job seekers",
    monthlyPrice: "$4.99",
    annualPrice: "$39.99",
    annualMonthly: "$3.33",
    savingsLabel: "Save 33%",
    accentColor: "#4F46E5",
    bgClass: "bg-indigo-50 dark:bg-indigo-950",
    borderClass: "border-indigo-400 dark:border-indigo-500",
    badge: "Most Popular",
    features: [
      { text: "Unlimited resumes", included: true },
      { text: "All 8 templates", included: true },
      { text: "PDF + Word export", included: true },
      { text: "50 AI requests / month", included: true },
      { text: "ATS Score analysis", included: true },
      { text: "Cover Letter generator", included: true },
      { text: "Priority AI processing", included: false },
      { text: "Early access features", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Everything, no limits",
    monthlyPrice: "$9.99",
    annualPrice: "$79.99",
    annualMonthly: "$6.67",
    savingsLabel: "Save 44%",
    accentColor: "#7C3AED",
    bgClass: "bg-violet-50 dark:bg-violet-950",
    borderClass: "border-violet-400 dark:border-violet-500",
    features: [
      { text: "Unlimited resumes", included: true },
      { text: "All 8 templates", included: true },
      { text: "PDF + Word export", included: true },
      { text: "200 AI requests / month", included: true },
      { text: "ATS Score analysis", included: true },
      { text: "Cover Letter generator", included: true },
      { text: "Priority AI processing", included: true },
      { text: "Early access features", included: true },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureRow({
  text,
  included,
  accent,
}: {
  text: string;
  included: boolean;
  accent: string;
}) {
  return (
    <View className="flex-row items-center gap-2.5 mb-2">
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: included ? accent + "20" : "#94A3B820",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name={included ? "checkmark" : "close"}
          size={11}
          color={included ? accent : "#94A3B8"}
        />
      </View>
      <Text
        className={`text-sm flex-1 ${
          included
            ? "text-slate-800 dark:text-slate-200"
            : "text-slate-400 dark:text-slate-600 line-through"
        }`}
      >
        {text}
      </Text>
    </View>
  );
}

function PlanCard({
  plan,
  billingCycle,
  currentPlan,
  isLoading,
  onSelect,
}: {
  plan: PlanConfig;
  billingCycle: BillingCycle;
  currentPlan: PlanTier;
  isLoading: boolean;
  onSelect: (plan: PlanConfig) => void;
}) {
  const isCurrent = plan.id === currentPlan;
  const isDowngrade =
    (currentPlan === "premium" && plan.id !== "premium") ||
    (currentPlan === "pro" && plan.id === "free");
  const price =
    billingCycle === "annual" ? plan.annualMonthly : plan.monthlyPrice;
  const billedLabel =
    billingCycle === "annual" && plan.id !== "free"
      ? `$${plan.annualPrice}/year`
      : null;

  return (
    <View
      className={`rounded-2xl border-2 p-5 mb-4 ${plan.bgClass} ${plan.borderClass}`}
      style={
        isCurrent
          ? { borderColor: plan.accentColor, borderWidth: 2 }
          : undefined
      }
    >
      {/* Card header */}
      <View className="flex-row items-center justify-between mb-1">
        <View className="flex-row items-center gap-2">
          <Text
            className="text-xl font-extrabold"
            style={{ color: plan.accentColor }}
          >
            {plan.name}
          </Text>
          {isCurrent && (
            <View
              className="px-2 py-0.5 rounded-full"
              style={{ backgroundColor: plan.accentColor }}
            >
              <Text className="text-white text-xs font-bold">Current</Text>
            </View>
          )}
        </View>
        {plan.badge && !isCurrent && (
          <View
            className="px-2.5 py-1 rounded-full"
            style={{ backgroundColor: plan.accentColor }}
          >
            <Text className="text-white text-xs font-bold">{plan.badge}</Text>
          </View>
        )}
      </View>

      <Text className="text-slate-500 dark:text-slate-400 text-sm mb-4">
        {plan.tagline}
      </Text>

      {/* Price */}
      <View className="flex-row items-end gap-1 mb-1">
        <Text
          className="text-4xl font-extrabold"
          style={{ color: plan.accentColor }}
        >
          {price}
        </Text>
        {plan.id !== "free" && (
          <Text className="text-slate-500 dark:text-slate-400 mb-1.5">/mo</Text>
        )}
      </View>
      {billedLabel && (
        <View className="flex-row items-center gap-1.5 mb-1">
          <Text className="text-slate-500 dark:text-slate-400 text-xs">
            {billedLabel}
          </Text>
          {plan.savingsLabel ? (
            <View
              className="px-1.5 py-0.5 rounded"
              style={{ backgroundColor: plan.accentColor + "20" }}
            >
              <Text
                className="text-xs font-bold"
                style={{ color: plan.accentColor }}
              >
                {plan.savingsLabel}
              </Text>
            </View>
          ) : null}
        </View>
      )}
      {!billedLabel && billingCycle === "monthly" && plan.savingsLabel && (
        <Text className="text-slate-400 text-xs mb-1">
          Switch to annual to {plan.savingsLabel.toLowerCase()}
        </Text>
      )}

      {/* Divider */}
      <View className="h-px bg-slate-200 dark:bg-slate-700 my-4" />

      {/* Features */}
      <View className="mb-4">
        {plan.features.map((f, i) => (
          <FeatureRow
            key={i}
            text={f.text}
            included={f.included}
            accent={plan.accentColor}
          />
        ))}
      </View>

      {/* CTA Button */}
      {isCurrent ? (
        <View
          className="py-3 rounded-xl items-center"
          style={{ backgroundColor: plan.accentColor + "20" }}
        >
          <Text
            className="font-bold text-sm"
            style={{ color: plan.accentColor }}
          >
            ✓ Your Current Plan
          </Text>
        </View>
      ) : isDowngrade ? (
        <View className="py-3 rounded-xl items-center bg-slate-100 dark:bg-slate-800">
          <Text className="font-semibold text-sm text-slate-400">
            Downgrade
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => onSelect(plan)}
          disabled={isLoading}
          className="py-3 rounded-xl items-center"
          style={{ backgroundColor: plan.accentColor }}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-white font-bold text-sm">
              {plan.id === "free"
                ? "Get Started Free"
                : `Upgrade to ${plan.name}`}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function PlanScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    currentPlan,
    isLoading,
    offerings,
    initPurchases,
    purchasePackage,
    restorePurchases,
  } = usePlanStore();
  const { showToast } = useToast();

  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (user?.$id) {
      initPurchases(user.$id);
    }
  }, [user]);

  const handleSelectPlan = async (plan: PlanConfig) => {
    if (plan.id === "free") return;

    // Find the matching RevenueCat package
    const currentOffering = offerings?.current;
    if (!currentOffering) {
      showToast("Store unavailable. Please try again later.", "error");
      return;
    }

    // Match by billing cycle — RevenueCat packages: ANNUAL, MONTHLY, etc.
    const pkg = currentOffering.availablePackages.find((p) => {
      const isAnnual = billingCycle === "annual";
      const packageType = p.packageType;
      // Look for the right plan via product identifier convention
      const id = p.product.identifier.toLowerCase();
      const planMatch = id.includes(plan.id);
      const cycleMatch = isAnnual
        ? id.includes("annual")
        : id.includes("monthly");
      return planMatch && cycleMatch;
    });

    if (!pkg) {
      showToast(
        "Package not found. Make sure RevenueCat is configured.",
        "error",
      );
      return;
    }

    setPurchasing(true);
    const success = await purchasePackage(pkg);
    setPurchasing(false);

    if (success) {
      showToast(`🎉 Welcome to ${plan.name}!`, "success");
    }
  };

  const handleRestorePurchases = async () => {
    await restorePurchases();
    if (currentPlan !== "free") {
      showToast("Purchases restored!", "success");
    } else {
      showToast("No active purchases found.", "info");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2 rounded-xl active:bg-slate-100 dark:active:bg-slate-800"
        >
          <Ionicons name="arrow-back" size={22} color="#64748B" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-xl font-extrabold text-slate-900 dark:text-white">
            Choose Your Plan
          </Text>
          <Text className="text-xs text-slate-400 mt-0.5">
            Cancel or change anytime
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Current plan badge */}
        <View className="items-center mb-5">
          <View className="flex-row items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-1.5 rounded-full shadow-sm">
            <Ionicons
              name="shield-checkmark"
              size={14}
              color={
                currentPlan === "premium"
                  ? "#7C3AED"
                  : currentPlan === "pro"
                    ? "#4F46E5"
                    : "#64748B"
              }
            />
            <Text className="text-slate-600 dark:text-slate-300 text-sm font-semibold capitalize">
              {currentPlan} Plan Active
            </Text>
          </View>
        </View>

        {/* Billing toggle */}
        <View className="flex-row bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-1 mb-6 self-center">
          <TouchableOpacity
            onPress={() => setBillingCycle("monthly")}
            className={`px-6 py-2.5 rounded-xl ${
              billingCycle === "monthly" ? "bg-indigo-600" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                billingCycle === "monthly"
                  ? "text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setBillingCycle("annual")}
            className={`px-6 py-2.5 rounded-xl flex-row items-center gap-1.5 ${
              billingCycle === "annual" ? "bg-indigo-600" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                billingCycle === "annual"
                  ? "text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Annual
            </Text>
            {billingCycle !== "annual" && (
              <View className="bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded">
                <Text className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  Save 33%+
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Plan cards */}
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billingCycle={billingCycle}
            currentPlan={currentPlan}
            isLoading={purchasing}
            onSelect={handleSelectPlan}
          />
        ))}

        {/* Restore purchases */}
        {Platform.OS !== "android" && (
          <TouchableOpacity
            onPress={handleRestorePurchases}
            disabled={isLoading}
            className="items-center py-3 mt-2"
          >
            <Text className="text-indigo-500 text-sm font-semibold">
              {isLoading ? "Restoring…" : "Restore Purchases"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Legal */}
        <View className="flex-row justify-center gap-4 mt-4 mb-2">
          <TouchableOpacity
            onPress={() => Linking.openURL(APP_CONFIG.LINKS.TERMS)}
          >
            <Text className="text-slate-400 text-xs">Terms of Use</Text>
          </TouchableOpacity>
          <Text className="text-slate-300 dark:text-slate-700 text-xs">•</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(APP_CONFIG.LINKS.PRIVACY)}
          >
            <Text className="text-slate-400 text-xs">Privacy Policy</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-center text-slate-300 dark:text-slate-700 text-xs mt-1">
          Subscriptions auto-renew unless cancelled 24h before period end.
          {"\n"}Managed in your{" "}
          {Platform.OS === "ios" ? "Apple ID" : "Google Play"} account settings.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
