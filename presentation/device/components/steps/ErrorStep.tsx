import { Button, Text, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const DEFAULT_LINK_ERROR_MESSAGE = 'Ocurrió un error inesperado durante la vinculación. Intentalo de nuevo.';

interface ErrorStepProps {
    title?: string;
    message?: string;
    onRetry: () => void;
    onCancel: () => void;
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

export default function ErrorStep({
    title = 'Algo salió mal',
    message = DEFAULT_LINK_ERROR_MESSAGE,
    onRetry,
    onCancel,
}: ErrorStepProps) {
    const theme = useTheme();

    return (
        <Container style={{ backgroundColor: theme.colors.background }}>
            <IllustrationContainer backgroundColor={theme.colors.surfaceVariant}>
                <MaterialCommunityIcons name="alert-circle" size={80} color={theme.colors.error} />
            </IllustrationContainer>

            <Title variant="headlineSmall" style={{ color: theme.colors.onBackground }}>
                {title}
            </Title>

            <Subtitle variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {message}
            </Subtitle>

            <ButtonsContainer>
                <Button mode="contained" icon="refresh" onPress={onRetry}>
                    Volver a intentar
                </Button>
                <Button
                    mode="text"
                    onPress={onCancel}
                    labelStyle={{ color: theme.colors.onSurfaceVariant }}
                >
                    Cancelar
                </Button>
            </ButtonsContainer>
        </Container>
    );
}
