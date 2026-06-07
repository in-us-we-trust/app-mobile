import { useEffect, useRef, useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuración global: cómo manejar notificaciones cuando la app está en foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type PushNotification = {
  title: string | null | undefined;
  body: string | null | undefined;
  data: Record<string, unknown>;
  receivedAt: Date;
};

export function usePushNotifications(onTokenReady?: (token: string) => void) {
  const [token, setToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<PushNotification | null>(null);
  const [error, setError] = useState<string | null>(null);

  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotifications()
      .then((expoPushToken) => {
        if (expoPushToken) {
          setToken(expoPushToken);
          onTokenReady?.(expoPushToken);
        }
      })
      .catch((err: Error) => {
        setError(err.message);
      });

    // Listener: notificación recibida con la app en foreground
    notificationListener.current = Notifications.addNotificationReceivedListener((notif) => {
      setNotification({
        title: notif.request.content.title,
        body: notif.request.content.body,
        data: (notif.request.content.data ?? {}) as Record<string, unknown>,
        receivedAt: new Date(),
      });
    });

    // Listener: usuario toca la notificación (desde background o killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const content = response.notification.request.content;
      console.log('Notificación tocada:', content);
      // Acá podés navegar a una pantalla específica según content.data
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return { token, notification, error };
}

async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    throw new Error('Las push notifications solo funcionan en dispositivo físico');
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    throw new Error('Permisos de notificación denegados por el usuario');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Para builds locales con expo run:ios / run:android,
  // el token es el FCM/APNs token directo, no el Expo Push Token.
  // Usamos getDevicePushTokenAsync para obtener el token nativo.
  const deviceToken = await Notifications.getDevicePushTokenAsync();

  return deviceToken.data as string;
}
