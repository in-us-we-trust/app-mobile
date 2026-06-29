import { useState } from 'react';
import { Button, Text, TextInput, useTheme, ActivityIndicator } from 'react-native-paper';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Device } from 'react-native-ble-plx';
import { useLinkDevice } from '@/presentation/device/hooks/useLinkDevice';

interface LinkStepProps {
    deviceId: string | null;
    device: Device | null;
    onNext: () => void;
    onBack: () => void;
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
  margin-bottom: 8px;
`;

const Title = styled(Text)`
  font-weight: bold;
  text-align: center;
`;

const Subtitle = styled(Text)`
  text-align: center;
  margin-bottom: 16px;
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

export default function LinkStep({ deviceId, device, onNext, onBack }: LinkStepProps) {
    const theme = useTheme();
    const { status, linkDevice } = useLinkDevice();
    const [deviceName, setDeviceName] = useState('Timbre puerta principal');

    const handleLink = async () => {
        await linkDevice(deviceId, device, deviceName);
    };

    const icon = {
        idle: 'link-variant',
        linking: 'link-variant',
        success: 'check-circle',
        error: 'alert-circle',
    }[status];

    const iconColor = {
        idle: theme.colors.primary,
        linking: theme.colors.primary,
        success: theme.colors.primary,
        error: theme.colors.error,
    }[status];

    return (
        <Container style={{ backgroundColor: theme.colors.background }}>
            <IllustrationContainer backgroundColor={theme.colors.surfaceVariant}>
                {status === 'linking' ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                ) : (
                    <MaterialCommunityIcons name={icon as any} size={80} color={iconColor} />
                )}
            </IllustrationContainer>

            <Title variant="headlineSmall" style={{ color: theme.colors.onBackground }}>
                {status === 'idle' && 'Vincular dispositivo'}
                {status === 'linking' && 'Vinculando...'}
                {status === 'success' && '¡Dispositivo vinculado!'}
                {status === 'error' && 'Error al vincular'}
            </Title>

            <Subtitle variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {status === 'idle' && 'Poné un nombre a tu timbre para identificarlo fácilmente.'}
                {status === 'linking' && 'Estamos conectando tu timbre, esperá un momento.'}
                {status === 'success' && 'Tu timbre fue vinculado correctamente. Ya podés usarlo.'}
                {status === 'error' && 'No pudimos vincular el timbre. Intentalo de nuevo.'}
            </Subtitle>

            {/* Input de nombre — visible solo en idle y error */}
            {(status === 'idle' || status === 'error') && (
                <StyledInput
                    label="Nombre del dispositivo"
                    mode="outlined"
                    value={deviceName}
                    onChangeText={setDeviceName}
                    left={<TextInput.Icon icon="doorbell" />}
                />
            )}

            <ButtonsContainer>
                {status === 'idle' && (
                    <>
                        <Button
                            mode="contained"
                            icon="link-variant"
                            onPress={handleLink}
                            disabled={!deviceName.trim()}
                        >
                            Vincular
                        </Button>
                        <Button
                            mode="text"
                            onPress={onBack}
                            labelStyle={{ color: theme.colors.onSurfaceVariant }}
                        >
                            Volver
                        </Button>
                    </>
                )}

                {status === 'success' && (
                    <Button mode="contained" icon="check" onPress={onNext}>
                        Ir al dispositivo
                    </Button>
                )}

                {status === 'error' && (
                    <>
                        <Button
                            mode="contained"
                            icon="refresh"
                            onPress={handleLink}
                            disabled={!deviceName.trim()}
                        >
                            Reintentar
                        </Button>
                        <Button
                            mode="text"
                            onPress={onBack}
                            labelStyle={{ color: theme.colors.onSurfaceVariant }}
                        >
                            Volver
                        </Button>
                    </>
                )}
            </ButtonsContainer>
        </Container>
    );
}
