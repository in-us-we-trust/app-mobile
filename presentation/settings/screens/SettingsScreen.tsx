import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Linking, ScrollView, View } from 'react-native';
import styled from 'styled-components/native';
import { List, Switch, Divider, Text, Button, Card, Snackbar } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { deletePushTokenAction, registerPushTokenAction } from '@/core/notifications/push-token-actions';
import { SecureStorageAdapter } from '@/helpers/adapters/secure-storage.adapter';

type PermissionStatus = 'granted' | 'denied' | 'undetermined';
const PUSH_TOKEN_DEVICE_ID_KEY = 'PUSH_TOKEN_DEVICE_ID';

const Container = styled.View`
  flex: 1;
`;

const SectionLabel = styled.Text`
  margin-horizontal: 16px;
  margin-top: 24px;
  margin-bottom: 8px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-size: 12px;
`;

const StyledCard = styled(Card)`
  margin-horizontal: 16px;
  border-radius: 12px;
`;

const WarningContent = styled.View`
  padding: 12px 16px;
`;

const WarningText = styled.Text`
  color: #888;
  font-size: 13px;
  margin-bottom: 10px;
`;

export default function SettingsScreen() {
    const theme = useTheme();
    const [notifStatus, setNotifStatus] = useState<PermissionStatus>('undetermined');
    const [snackVisible, setSnackVisible] = useState(false);
    const [tokenRegistrationError, setTokenRegistrationError] = useState<string | null>(null);
    const appState = useRef(AppState.currentState);
    const permissionStatusRef = useRef<PermissionStatus>('undetermined');
    const registeredPushDeviceIdRef = useRef<number | null>(null);

    useEffect(() => {
        checkPermission();

        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                checkPermission();
            }
            appState.current = nextAppState;
        });

        return () => subscription.remove();
    }, []);

    const checkPermission = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        const nextStatus = status as PermissionStatus;
        const previousStatus = permissionStatusRef.current;

        if (previousStatus === 'granted' && nextStatus === 'denied') {
            await deleteDevicePushToken();
        }

        setNotifStatus(nextStatus);
        permissionStatusRef.current = nextStatus;

        if (nextStatus === 'granted') {
            await registerDevicePushToken();
        }
    };

    const getStoredPushDeviceId = async (): Promise<number | null> => {
        const storedId = await SecureStorageAdapter.getItem(PUSH_TOKEN_DEVICE_ID_KEY);
        if (!storedId) return null;

        const parsedId = Number(storedId);
        return Number.isFinite(parsedId) ? parsedId : null;
    };

    const deleteDevicePushToken = async () => {
        try {
            const appDeviceId =
                registeredPushDeviceIdRef.current ?? (await getStoredPushDeviceId());

            if (!appDeviceId) return;

            await deletePushTokenAction(appDeviceId);
            registeredPushDeviceIdRef.current = null;
            await SecureStorageAdapter.deleteItem(PUSH_TOKEN_DEVICE_ID_KEY);
            setTokenRegistrationError(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'No se pudo eliminar el token push';
            setTokenRegistrationError(message);
            setSnackVisible(true);
        }
    };

    const registerDevicePushToken = async () => {
        try {
            if (!Device.isDevice) return;

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            const deviceToken = await Notifications.getDevicePushTokenAsync();

            const registeredPushToken = await registerPushTokenAction({
                deviceName: Device.modelName ?? Device.deviceName ?? 'Unknown',
                platform: Platform.OS.toUpperCase(),
                pushToken: String(deviceToken.data),
            });

            registeredPushDeviceIdRef.current = registeredPushToken.id;
            await SecureStorageAdapter.setItem(
                PUSH_TOKEN_DEVICE_ID_KEY,
                String(registeredPushToken.id),
            );

            setTokenRegistrationError(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'No se pudo registrar el token push';
            setTokenRegistrationError(message);
            setSnackVisible(true);
        }
    };

    const handleNotifToggle = async () => {
        if (notifStatus === 'granted' || notifStatus === 'denied') {
            await Linking.openSettings();
        } else {
            const { status } = await Notifications.requestPermissionsAsync();
            setNotifStatus(status as PermissionStatus);
            if (status === 'denied') setSnackVisible(true);
            if (status === 'granted') await registerDevicePushToken();
        }
    };

    const notifEnabled = notifStatus === 'granted';

    const notifSubtitle = {
        granted: 'Activadas',
        denied: 'Desactivadas — tocá para ir a Configuración',
        undetermined: 'Tocá para activar',
    }[notifStatus];

    return (
        <Container style={{ backgroundColor: theme.colors.background }}>
            <ScrollView>
                <SectionLabel>Notificaciones</SectionLabel>

                <StyledCard>
                    <List.Item
                        title="Notificaciones push"
                        description={notifSubtitle}
                        left={(props) => (
                            <List.Icon {...props} icon={notifEnabled ? 'bell' : 'bell-off'} />
                        )}
                        right={() => (
                            <Switch value={notifEnabled} onValueChange={handleNotifToggle} />
                        )}
                        onPress={handleNotifToggle}
                    />
                    {notifStatus === 'denied' && (
                        <View>
                            <Divider />
                            <WarningContent>
                                <WarningText>
                                    Denegaste el permiso anteriormente. Para activarlas tenés que hacerlo desde la Configuración del sistema.
                                </WarningText>
                                <Button
                                    mode="outlined"
                                    icon="cog"
                                    onPress={() => Linking.openSettings()}
                                    style={{ alignSelf: 'flex-start' }}
                                >
                                    Abrir Configuración
                                </Button>
                            </WarningContent>
                        </View>
                    )}
                </StyledCard>
                <SectionLabel>Aplicación</SectionLabel>
                <StyledCard>
                    <List.Item
                        title="Versión"
                        description="1.0.0"
                        left={(props) => <List.Icon {...props} icon="information" />}
                    />
                </StyledCard>

            </ScrollView>

            <Snackbar
                visible={snackVisible}
                onDismiss={() => setSnackVisible(false)}
                duration={4000}
                action={{ label: 'Configuración', onPress: () => Linking.openSettings() }}
            >
                {tokenRegistrationError ?? 'Permiso denegado. Podés activarlo desde Configuración.'}
            </Snackbar>
        </Container>
    );
}
