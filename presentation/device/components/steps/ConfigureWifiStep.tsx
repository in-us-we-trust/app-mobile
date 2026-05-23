import { useState } from 'react';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ConfigureWifiStepProps {
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

const StyledInput = styled(TextInput)`
  width: 100%;
  margin-bottom: 12px;
`;

export default function ConfigureWifiStep({ onNext, onBack }: ConfigureWifiStepProps) {
    const theme = useTheme();
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
                    onPress={onNext}
                    disabled={!ssid || !password}
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