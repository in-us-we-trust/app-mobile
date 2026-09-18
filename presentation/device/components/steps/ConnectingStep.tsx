import { ActivityIndicator } from 'react-native-paper';
import { Button, Text, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';

interface ConnectingStepProps {
    onCancel: () => void;
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
  gap: 24px;
`;

export default function ConnectingStep({ onCancel }: ConnectingStepProps) {
    const theme = useTheme();

    return (
        <Container>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text variant="headlineSmall" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Conectando...
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                Estamos conectando con tu timbre vía Bluetooth. Esperá un momento.
            </Text>
            <Button
                mode="text"
                onPress={onCancel}
                labelStyle={{ color: theme.colors.onSurfaceVariant }}
            >
                Cancelar
            </Button>
        </Container>
    );
}