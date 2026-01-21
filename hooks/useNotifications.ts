import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export function useNotifications() {
  const initNotificationHandler = async () => {
    if (Platform.OS === 'web') return;
    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    } catch (error) {
      console.warn('Failed to set notification handler:', error);
    }
  };

  async function requestPermissions() {
    if (Platform.OS === 'web') return false;

    // Initialize handler when requesting permissions (or initiating usage)
    await initNotificationHandler();

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
       console.warn('Failed to get notification permissions:', error);
       return false;
    }
  }

  async function scheduleNotification(seconds: number, title: string, body: string) {
    if (Platform.OS === 'web') return;

    try {
      // Ensure handler is set
      await initNotificationHandler();

      // Cancel any existing to avoid stacking if called multiple times
      await Notifications.cancelAllScheduledNotificationsAsync();

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: Math.max(1, seconds), // Minimum 1 second
          repeats: false,
        } as any, // Type cast to avoid potential type issues with different expo versions
      });
    } catch (error) {
      console.warn('Failed to schedule notification:', error);
    }
  }

  async function cancelNotifications() {
    if (Platform.OS === 'web') return;
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
        console.warn('Failed to cancel notifications:', error);
    }
  }

  return {
    requestPermissions,
    scheduleNotification,
    cancelNotifications,
  };
}
