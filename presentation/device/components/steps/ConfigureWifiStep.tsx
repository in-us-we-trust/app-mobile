import { useState } from 'react';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const UART_SERVICE_UUID = '0000181c-0000-1000-8000-00805f9b34fb';
const UART_RX_CHAR_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

interface ConfigureWifiStepProps {
    onNext: () => void;
    onBack: () => void;
    device: Device | null;
}

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
  margin-bottom: 32px;
`;

const Title = styled(Text)`
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
`;

const Subtitle = styled(Text)`
  text-align: center;
  margin-bottom: 32px;
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
    const [showPassword, setShowPassword] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleContinue = async () => {
        if (!device) {
            onNext();
            return;
        }

        try {
            setIsSending(true);

            //TODO: REMOVER
            const isConnected = await device.isConnected();
            console.log('¿Conectado?', isConnected);

            if (!isConnected) {
                console.error('Dispositivo desconectado');
                setIsSending(false);
                return;
            }

            const payload = JSON.stringify({ ssid, password });
            const base64 = Buffer.from(payload).toString('base64');

            await device.writeCharacteristicWithoutResponseForService(
                UART_SERVICE_UUID,
                UART_RX_CHAR_UUID,
                base64
            );

            console.log('Credenciales enviadas:', JSON.stringify({ ssid, password }));

            onNext();
        } catch (error) {
            console.error('Error enviando credenciales:', error);
            onNext();
        } finally {
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
                Ingresá los datos de tu red WiFi para conectar el timbre a internet.
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
                    disabled={!ssid || !password}
                    loading={isSending}
                >
                    Continuar
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