import { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

interface ScanQRStepProps {
    onNext: (data: string) => void;
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
  height: 200px;
  border-radius: 16px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const CameraContainer = styled.View`
  width: 100%;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 8px;
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
`;

export default function ScanQRStep({ onNext, onCancel }: ScanQRStepProps) {
    const theme = useTheme();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanning, setScanning] = useState(false);
    const [manualMode, setManualMode] = useState(false);
    const [manualCode, setManualCode] = useState('');

    const handlePressScan = async () => {
        if (!permission?.granted) {
            const result = await requestPermission();
            if (!result.granted) return;
        }
        setScanning(true);
    };


    // reemplazá el useState de scanned:
    const scannedRef = useRef(false);

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scannedRef.current) return;
        scannedRef.current = true;
        console.log('QR escaneado:', data);
        onNext(data);
    };

    const handlePressManual = () => {
        setScanning(false);
        setManualMode(true);
    };

    // El código manual es el nombre BLE del timbre, el mismo valor que trae el QR en texto plano.
    const handleSubmitManual = () => {
        const code = manualCode.trim();
        if (!code) return;
        onNext(code);
    };

    if (manualMode) {
        return (
            <KeyboardAwareScrollView
                bottomOffset={24}
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: theme.colors.background }}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <Container style={{ backgroundColor: theme.colors.background }}>
                    <IllustrationContainer backgroundColor={theme.colors.surfaceVariant}>
                        <MaterialCommunityIcons
                            name="keyboard-outline"
                            size={100}
                            color={theme.colors.primary}
                        />
                    </IllustrationContainer>

                    <Title variant="headlineSmall" style={{ color: theme.colors.onBackground }}>
                        Ingresá el código del timbre
                    </Title>

                    <Subtitle variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        Escribí el nombre del timbre tal como aparece impreso debajo del código QR.
                    </Subtitle>

                    <ButtonsContainer>
                        <TextInput
                            label="Nombre del timbre"
                            mode="outlined"
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoFocus
                            left={<TextInput.Icon icon="doorbell" />}
                            value={manualCode}
                            onChangeText={setManualCode}
                            onSubmitEditing={handleSubmitManual}
                            returnKeyType="done"
                        />

                        <Button
                            mode="contained"
                            icon="check"
                            onPress={handleSubmitManual}
                            disabled={!manualCode.trim()}
                        >
                            Continuar
                        </Button>

                        <Button mode="outlined" icon="qrcode-scan" onPress={() => setManualMode(false)}>
                            Volver a escanear QR
                        </Button>

                        <Button
                            mode="text"
                            onPress={onCancel}
                            style={{ marginTop: 4 }}
                            contentStyle={{ height: 44 }}
                        >
                            Cancelar
                        </Button>
                    </ButtonsContainer>
                </Container>
            </KeyboardAwareScrollView>
        );
    }

    return (
        <KeyboardAwareScrollView
            bottomOffset={24}
            keyboardShouldPersistTaps="handled"
            style={{ backgroundColor: theme.colors.background }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <Container style={{ backgroundColor: theme.colors.background }}>
                {scanning ? (
                    <CameraContainer>
                        <CameraView
                            style={StyleSheet.absoluteFillObject}
                            facing="back"
                            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                            onBarcodeScanned={handleBarCodeScanned}
                        />
                    </CameraContainer>
                ) : (
                    <IllustrationContainer backgroundColor={theme.colors.surfaceVariant}>
                        <MaterialCommunityIcons
                            name="qrcode-scan"
                            size={100}
                            color={theme.colors.primary}
                        />
                    </IllustrationContainer>
                )}

                <Title variant="headlineSmall" style={{ color: theme.colors.onBackground }}>
                    Escaneá el código QR
                </Title>

                <Subtitle variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Apuntá la cámara al código QR ubicado en tu timbre. Asegurate de que esté bien iluminado.
                </Subtitle>

                <ButtonsContainer>
                    {!scanning && (
                        <Button mode="contained" icon="qrcode-scan" onPress={handlePressScan}>
                            Escanear QR
                        </Button>
                    )}

                    {scanning && (
                        <Button mode="outlined" icon="close" onPress={() => setScanning(false)}>
                            Cancelar
                        </Button>
                    )}

                    <Button mode="outlined" icon="keyboard" onPress={handlePressManual}>
                        Ingresar código manualmente
                    </Button>

                    <Button
                        mode="text"
                        icon="help-circle-outline"
                        onPress={() => { }}
                        labelStyle={{ color: theme.colors.onSurfaceVariant }}
                    >
                        No veo el botón de sincronización
                    </Button>
                    <Button
                        mode="text"
                        onPress={onCancel}
                        style={{ marginTop: 4 }}
                        contentStyle={{ height: 44 }}
                    >
                        Cancelar
                    </Button>
                </ButtonsContainer>
            </Container>
        </KeyboardAwareScrollView>
    );
}