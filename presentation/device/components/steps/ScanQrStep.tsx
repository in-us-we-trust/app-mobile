import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

interface ScanQRStepProps {
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
  height: 220px;
  border-radius: 16px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`;

const CameraContainer = styled.View`
  width: 100%;
  height: 220px;
  border-radius: 16px;
  overflow: hidden;
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
`;

export default function ScanQRStep({ onNext, onBack }: ScanQRStepProps) {
    const theme = useTheme();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanning, setScanning] = useState(false);
    const [scanned, setScanned] = useState(false);

    const handlePressScan = async () => {
        if (!permission?.granted) {
            const result = await requestPermission();
            if (!result.granted) return;
        }
        setScanning(true);
    };

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);
        console.log('QR escaneado:', data);
        onNext();
    };

    return (
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

                <Button mode="outlined" icon="keyboard" onPress={onNext}>
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
            </ButtonsContainer>
        </Container>
    );
}