import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { router } from 'expo-router';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

const IconContainer = styled.View<{ borderColor: string }>`
  width: 180px;
  height: 180px;
  border-radius: 16px;
  border-width: 2px;
  border-style: dashed;
  border-color: ${({ borderColor }) => borderColor};
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`;

const IconInner = styled.View<{ backgroundColor: string }>`
  width: 120px;
  height: 120px;
  border-radius: 16px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  justify-content: center;
  align-items: center;
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

const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: 16px;
`;

export default function DeviceScreen() {
    const theme = useTheme();

    return (
        <Container style={{ backgroundColor: theme.colors.background }}>
            <IconContainer borderColor={theme.colors.outlineVariant}>
                <IconInner backgroundColor={theme.colors.surface}>
                    <MaterialCommunityIcons
                        name="doorbell"
                        size={80}
                        color={theme.colors.primary}
                    />
                </IconInner>
            </IconContainer>

            <Title variant="headlineSmall" style={{ color: theme.colors.onBackground }}>
                No hay dispositivos vinculados
            </Title>

            <Subtitle variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Para comenzar a proteger tu hogar, necesitás vincular tu primer timbre. Es rápido y sencillo.
            </Subtitle>

            <StyledButton
                mode="contained"
                icon="plus-circle"
                onPress={() => router.push('/(app-name)/(tabs)/device/link-device')}
            >
                Vincular Dispositivo
            </StyledButton>

            <Button
                mode="text"
                icon="help-circle-outline"
                onPress={() => { }}
                labelStyle={{ color: theme.colors.primary }}
            >
                ¿Necesitás ayuda con la instalación?
            </Button>
        </Container>
    );
}