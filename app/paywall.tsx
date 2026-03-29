import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RevenueCatUI from "react-native-purchases-ui";
import { useRevenueCatStore } from "../src/store/useRevenueCatStore";

export default function PaywallScreen() {
  const router = useRouter();
  const { checkStatus } = useRevenueCatStore();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
      <RevenueCatUI.Paywall
        onPurchaseCompleted={async ({ customerInfo }) => {
          const isPro =
            typeof customerInfo.entitlements.active["ResuMate Pro"] !==
            "undefined";
          if (isPro) {
            await checkStatus();
            Alert.alert("Success!", "Welcome to ResuMate Pro!");
            router.dismiss(); // Navigate back to the app
          }
        }}
        onPurchaseError={({ error }) => {
          if (!error.userCancelled) {
            Alert.alert("Purchase Failed", error.message);
          }
        }}
        onRestoreCompleted={async ({ customerInfo }) => {
          const isPro =
            typeof customerInfo.entitlements.active["ResuMate Pro"] !==
            "undefined";
          if (isPro) {
            await checkStatus();
            Alert.alert(
              "Restored",
              "Your ResuMate Pro access has been restored.",
            );
            router.dismiss();
          } else {
            Alert.alert(
              "No Purchases Found",
              "We couldn't find any active subscriptions.",
            );
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 8,
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
  },
});
