import { ActivityIndicator } from 'react-native-paper';
import { Text, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
  gap: 24px;
`;

export default function ConnectingStep() {
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
        </Container>
    );
}