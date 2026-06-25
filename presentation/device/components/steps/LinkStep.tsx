import { useState, useEffect } from 'react';
import { Button, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface LinkStepProps {
    bleResponse: string | null;
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

type Status = 'idle' | 'linking' | 'success' | 'error';

export default function LinkStep({ bleResponse, onNext, onBack }: LinkStepProps) {
    const theme = useTheme();
    const [status, setStatus] = useState<Status>('idle');

    const handleLink = async () => {
        setStatus('linking');
        // TODO: enviar bleResponse al backend para registrar el dispositivo
        console.log('Datos recibidos del dispositivo para vincular:', bleResponse);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setStatus('success');
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
                {status === 'idle' && 'Presioná el botón para vincular tu timbre a tu cuenta.'}
                {status === 'linking' && 'Estamos conectando tu timbre, esperá un momento.'}
                {status === 'success' && 'Tu timbre fue vinculado correctamente. Ya podés usarlo.'}
                {status === 'error' && 'No pudimos vincular el timbre. Intentalo de nuevo.'}
            </Subtitle>

            <ButtonsContainer>
                {status === 'idle' && (
                    <>
                        <Button mode="contained" icon="link-variant" onPress={handleLink}>
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
                    <Button
                        mode="contained"
                        icon="check"
                        onPress={() => router.replace('/(app-name)/(tabs)/device')}
                    >
                        Ir al dispositivo
                    </Button>
                )}

                {status === 'error' && (
                    <>
                        <Button mode="contained" icon="refresh" onPress={handleLink}>
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