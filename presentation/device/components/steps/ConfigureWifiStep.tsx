import { useState } from 'react';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const WIFI_SERVICE_UUID = '12345678-1234-1234-1234-123456789000';
const WIFI_CREDENTIALS_CHAR_UUID = '12345678-1234-1234-1234-123456789001';
const WIFI_RESPONSE_CHAR_UUID = '12345678-1234-1234-1234-123456789001';
const WIFI_RESPONSE_TIMEOUT_MS = 300000;

interface ConfigureWifiStepProps {
    onNext: (deviceId: string, device: Device) => void;
    onBack: () => void;
    device: Device | null;
}

type WifiResponsePayload = {
    deviceId?: string;
    macAddress?: string;
    mac_address?: string;
    device_id?: string;
};

const extractDeviceId = (decodedPayload: string): string | null => {
    const parsed = JSON.parse(decodedPayload) as WifiResponsePayload;
    const candidate = parsed.deviceId ?? parsed.macAddress ?? parsed.mac_address ?? parsed.device_id;

    if (typeof candidate !== 'string') {
        return null;
    }

    const normalized = candidate.trim();
    return normalized.length > 0 ? normalized : null;
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

const IllustrationContainer = styled.View<{ backgroundColor: string }>`
  width: 100%;
  height: 180px;
  border-radius: 16px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const Title = styled(Text)`
  font-weight: bold;
  text-align: center;
`;

const Subtitle = styled(Text)`
  text-align: center;
  margin-bottom: 12xpx;
  line-height: 22px;
`;

const ButtonsContainer = styled.View`
  width: 100%;
  gap: 12px;
  margin-top: 16px;
`;

const StyledInput = styled(TextInput)`
  width: 100%;
  margin-bottom: 12px;
`;

export default function ConfigureWifiStep({ onNext, onBack, device }: ConfigureWifiStepProps) {
    const theme = useTheme();
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isWaitingResponse, setIsWaitingResponse] = useState(false);

    const ensureConnectedAndDiscovered = async (currentDevice: Device): Promise<Device> => {
        const connected = await currentDevice.isConnected();
        const activeDevice = connected
            ? currentDevice
            : await (async () => {
                const reconnected = await currentDevice.connect();
                await reconnected.discoverAllServicesAndCharacteristics();
                return reconnected;
            })();

        try {
            await activeDevice.requestMTU(512);
        } catch {
            // MTU negotiation is best-effort; proceed with whatever MTU was agreed.
        }

        return activeDevice;
    };

    const writeCredentials = async (targetDevice: Device, payloadBase64: string) => {
        await targetDevice.writeCharacteristicWithoutResponseForService(
            WIFI_SERVICE_UUID,
            WIFI_CREDENTIALS_CHAR_UUID,
            payloadBase64,
        );
    };

    const handleContinue = async () => {
        if (!device) {
            return;
        }

        try {
            setIsSending(true);

            let activeDevice = await ensureConnectedAndDiscovered(device);
            const isConnected = await activeDevice.isConnected();
            console.log('¿Conectado?', isConnected);

            if (!isConnected) {
                console.error('Dispositivo desconectado');
                setIsSending(false);
                return;
            }

            const payload = JSON.stringify({ ssid, password });
            const base64 = Buffer.from(payload).toString('base64');

            console.log('Largo payload/base64:', payload.length, base64.length);

            // 1. Suscribirse ANTES de escribir para no perder la notificación
            const responsePromise = new Promise<string>((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    subscription.remove();
                    reject(new Error('Timeout esperando respuesta del dispositivo.'));
                }, WIFI_RESPONSE_TIMEOUT_MS);

                const subscription = activeDevice.monitorCharacteristicForService(
                    WIFI_SERVICE_UUID,
                    WIFI_RESPONSE_CHAR_UUID,
                    (error, characteristic) => {
                        if (error) {
                            clearTimeout(timeoutId);
                            subscription.remove();
                            reject(error);
                            return;
                        }

                        if (characteristic?.value) {
                            clearTimeout(timeoutId);
                            subscription.remove();
                            const decoded = Buffer.from(characteristic.value, 'base64').toString('utf8');
                            console.log('Respuesta BLE recibida:', decoded);
                            resolve(decoded);
                        }
                    },
                );
            });

            // 2. Escribir credenciales después de estar suscriptos
            try {
                await writeCredentials(activeDevice, base64);
            } catch (firstWriteError) {
                console.warn('Primer write falló. Reintentando tras reconectar...', firstWriteError);
                activeDevice = await ensureConnectedAndDiscovered(device);
                await writeCredentials(activeDevice, base64);
            }

            console.log('Credenciales enviadas:', JSON.stringify({ ssid, password }));
            setIsSending(false);
            setIsWaitingResponse(true);

            // 3. Parsear deviceId/macAddress y pasar al siguiente step junto con el device activo
            const decoded = await responsePromise;
            const parsedDeviceId = extractDeviceId(decoded);
            const fallbackDeviceId = typeof activeDevice.id === 'string' ? activeDevice.id.trim() : '';
            const nextDeviceId = parsedDeviceId ?? (fallbackDeviceId.length > 0 ? fallbackDeviceId : null);

            if (!parsedDeviceId && nextDeviceId) {
                console.warn('Respuesta BLE sin deviceId/macAddress. Usando activeDevice.id como fallback:', nextDeviceId);
            }

            if (!nextDeviceId) {
                throw new Error(`Respuesta BLE sin identificador de dispositivo valido: ${decoded}`);
            }

            onNext(nextDeviceId, activeDevice);
        } catch (error) {
            console.error('Error enviando credenciales o esperando respuesta:', error);
        } finally {
            setIsWaitingResponse(false);
            setIsSending(false);
        }
    };

    return (
        <Container style={{ backgroundColor: theme.colors.background }}>
            <IllustrationContainer backgroundColor={theme.colors.surfaceVariant}>
                <MaterialCommunityIcons
                    name="wifi"
                    size={80}
                    color={theme.colors.primary}
                />
            </IllustrationContainer>

            <Title variant="headlineSmall" style={{ color: theme.colors.onBackground }}>
                Configurá el WiFi
            </Title>

            <Subtitle variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Ingresá los datos de tu red WiFi.
            </Subtitle>

            <StyledInput
                label="Nombre de red (SSID)"
                mode="outlined"
                value={ssid}
                onChangeText={setSsid}
                left={<TextInput.Icon icon="wifi" />}
            />

            <StyledInput
                label="Contraseña"
                mode="outlined"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                left={<TextInput.Icon icon="lock" />}
                right={
                    <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />

            <ButtonsContainer>
                <Button
                    mode="contained"
                    icon="arrow-right"
                    onPress={handleContinue}
                    disabled={!ssid || !password || isWaitingResponse}
                    loading={isSending || isWaitingResponse}
                >
                    {isWaitingResponse ? 'Esperando dispositivo...' : 'Continuar'}
                </Button>

                <Button
                    mode="text"
                    onPress={onBack}
                    labelStyle={{ color: theme.colors.onSurfaceVariant }}
                >
                    Volver
                </Button>
            </ButtonsContainer>
        </Container>
    );
}
