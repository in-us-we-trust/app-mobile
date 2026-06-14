import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Linking, ScrollView, View } from 'react-native';
import styled from 'styled-components/native';
import { List, Switch, Divider, Text, Button, Card, Snackbar } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import * as Notifications from 'expo-notifications';

type PermissionStatus = 'granted' | 'denied' | 'undetermined';

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
    const appState = useRef(AppState.currentState);

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
        setNotifStatus(status as PermissionStatus);
    };

    const handleNotifToggle = async () => {
        if (notifStatus === 'granted' || notifStatus === 'denied') {
            await Linking.openSettings();
        } else {
            const { status } = await Notifications.requestPermissionsAsync();
            setNotifStatus(status as PermissionStatus);
            if (status === 'denied') setSnackVisible(true);
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

                <SectionLabel>Cuenta</SectionLabel>
                <StyledCard>
                    <List.Item
                        title="Perfil"
                        left={(props) => <List.Icon {...props} icon="account" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                    />
                    <Divider />
                    <List.Item
                        title="Cambiar contraseña"
                        left={(props) => <List.Icon {...props} icon="lock" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                    />
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
                Permiso denegado. Podés activarlo desde Configuración.
            </Snackbar>
        </Container>
    );
}
