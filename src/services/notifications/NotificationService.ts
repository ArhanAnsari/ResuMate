import * as Notifications from "expo-notifications";

export class NotificationService {
  static async requestPermissions() {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === "granted";
    } catch {
      // expo-notifications remote push is not available in Expo Go SDK 53+.
      // Local notification scheduling still works in a dev/production build.
      return false;
    }
  }

  static async scheduleNotification(title: string, body: string, seconds = 1) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          vibrate: [0, 250, 250, 250],
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds,
          repeats: false,
        },
      });
    } catch {
      // Silently swallow in environments where notifications aren't supported.
    }
  }
}
// Note: The global notification handler is configured once in app/_layout.tsx (guarded for Expo Go).
