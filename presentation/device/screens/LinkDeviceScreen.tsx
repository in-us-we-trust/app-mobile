import { useState } from 'react';
import styled from 'styled-components/native';
import { useTheme } from 'react-native-paper';
import { BleManager, Device } from 'react-native-ble-plx';
import { router } from 'expo-router';
import Stepper from '../components/Stepper';
import ConfigureWifiStep from '../components/steps/ConfigureWifiStep';
import LinkStep from '../components/steps/LinkStep';
import ScanQRStep from '../components/steps/ScanQrStep';
import ConnectingStep from '../components/steps/ConnectingStep';

const manager = new BleManager();

const Container = styled.View`
  flex: 1;
`;

type Step = 'scan' | 'connecting' | 'wifi' | 'link';

export default function LinkDeviceScreen() {
    const theme = useTheme();
    const [step, setStep] = useState<Step>('scan');
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

    const stepIndex = { scan: 0, connecting: 0, wifi: 1, link: 2 }[step];
    const labels = ['Escanear QR', 'Configurar WiFi', 'Vincular'];

    const handleQRScanned = async (data: string) => {
        try {
            const parsed = JSON.parse(data);
            const deviceName = parsed.device_id;

            setStep('connecting');

            let timeoutId: ReturnType<typeof setTimeout>;

            manager.startDeviceScan(null, null, async (error, device) => {
                if (error) {
                    console.error('Error escaneando:', error);
                    setStep('scan');
                    return;
                }

                if (device && device.name === deviceName) {
                    manager.stopDeviceScan();
                    clearTimeout(timeoutId); // cancelá el timeout
                    try {
                        const connected = await device.connect();
                        await connected.discoverAllServicesAndCharacteristics();
                        setConnectedDevice(connected);
                        setStep('wifi');
                    } catch (connectError) {
                        console.error('Error conectando:', connectError);
                        setStep('scan');
                    }
                }
            });

            timeoutId = setTimeout(() => {
                manager.stopDeviceScan();
                setStep('scan');
            }, 15000);

        } catch (error) {
            console.error('Error parseando QR:', error);
            setStep('scan');
        }
    };

    return (
        <Container style={{ backgroundColor: theme.colors.background }}>
            <Stepper
                current={stepIndex}
                total={3}
                label={labels[stepIndex]}
            />

            {step === 'scan' && (
                <ScanQRStep onNext={handleQRScanned} onBack={() => router.back()} />
            )}

            {step === 'connecting' && (
                <ConnectingStep />
            )}

            {step === 'wifi' && (
                <ConfigureWifiStep
                    onNext={() => setStep('link')}
                    onBack={() => setStep('scan')}
                    device={connectedDevice}
                />
            )}

            {step === 'link' && (
                <LinkStep
                    onNext={() => router.back()}
                    onBack={() => setStep('wifi')}
                />
            )}
        </Container>
    );
}