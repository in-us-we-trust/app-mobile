import { useState } from 'react';
import { Alert, Clipboard } from 'react-native';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Text, Card, Button, Chip, ActivityIndicator, Banner } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { usePushNotifications, PushNotification as AppNotification } from '@/presentation/notifications/hooks/usePushNotifications';

const Container = styled.View`
  flex: 1;
`;

const Content = styled.View`
  padding: 16px;
  gap: 12px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const TokenText = styled.Text`
  font-family: monospace;
  font-size: 11px;
  color: #333;
  margin-bottom: 12px;
  line-height: 18px;
`;

const SectionTitle = styled.View`
  margin-top: 8px;
  margin-bottom: 4px;
`;

const NotifBody = styled.Text`
  margin-top: 4px;
  color: #444;
`;

const DataText = styled.Text`
  margin-top: 6px;
  color: #888;
  font-family: monospace;
  font-size: 11px;
`;

const EmptyText = styled.Text`
  color: #888;
  text-align: center;
  padding-vertical: 8px;
`;

const LoadingText = styled.Text`
  color: #666;
`;

export default function NotificationsScreen() {
    const theme = useTheme();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    const { token, notification, error } = usePushNotifications((newToken) => {
        console.log('Token listo:', newToken);
        // TODO: enviar al backend → api.savePushToken(newToken)
    });

    if (notification && !notifications.find((n) => n.receivedAt === notification.receivedAt)) {
        setNotifications((prev) => [notification, ...prev]);
    }

    const copyToken = () => {
        if (token) {
            Clipboard.setString(token);
            Alert.alert('Copiado', 'Token copiado al portapapeles');
        }
    };

    return (
        <Container style={{ backgroundColor: theme.colors.background }}>
            <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>

                <Card>
                    <Card.Title title="Push Token" subtitle="Usalo para probar desde tu backend o FCM" />
                    <Card.Content>
                        {!token && !error && (
                            <Row>
                                <ActivityIndicator size="small" />
                                <LoadingText>Registrando dispositivo...</LoadingText>
                            </Row>
                        )}

                        {error && (
                            <Banner visible icon="alert-circle" actions={[]}>
                                {error}
                            </Banner>
                        )}

                        {token && (
                            <>
                                <TokenText selectable>{token}</TokenText>
                                <Button mode="contained" icon="content-copy" onPress={copyToken}>
                                    Copiar token
                                </Button>
                            </>
                        )}
                    </Card.Content>
                </Card>

                <SectionTitle>
                    <Text variant="titleMedium">Notificaciones recibidas</Text>
                </SectionTitle>

                {notifications.length === 0 && (
                    <Card>
                        <Card.Content>
                            <EmptyText>
                                Todavía no llegó ninguna notificación. Mandá una desde tu backend usando el token de arriba.
                            </EmptyText>
                        </Card.Content>
                    </Card>
                )}

                {notifications.map((notif, i) => (
                    <Card key={i}>
                        <Card.Content>
                            <Row>
                                <Text variant="titleSmall">{notif.title ?? '(sin título)'}</Text>
                                <Chip compact>{notif.receivedAt.toLocaleTimeString()}</Chip>
                            </Row>
                            {notif.body && <NotifBody>{notif.body}</NotifBody>}
                            {Object.keys(notif.data).length > 0 && (
                                <DataText>data: {JSON.stringify(notif.data)}</DataText>
                            )}
                        </Card.Content>
                    </Card>
                ))}

            </ScrollView>
        </Container>
    );
}
