import { useState } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
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

const requestBlePermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    if (Platform.Version >= 31) {
        const results = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        return (
            results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED
            && results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED
        );
    }

    const locationResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return locationResult === PermissionsAndroid.RESULTS.GRANTED;
};

export default function LinkDeviceScreen() {
    const theme = useTheme();
    const [step, setStep] = useState<Step>('scan');
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [bleResponse, setBleResponse] = useState<string | null>(null);

    const stepIndex = { scan: 0, connecting: 0, wifi: 1, link: 2 }[step];
    const labels = ['Escanear QR', 'Configurar WiFi', 'Vincular'];

    const handleQRScanned = async (data: string) => {
        try {
            let deviceName: string;

            try {
                const parsed = JSON.parse(data);
                deviceName = parsed.BLUETOOTH ?? parsed.ble_name ?? parsed.device_id;
            } catch {
                // El QR no es JSON: asumimos que el contenido es directamente el nombre BLE.
                deviceName = data.trim();
            }

            if (!deviceName || typeof deviceName !== 'string') {
                Alert.alert('QR invalido', 'El QR no contiene un identificador de Bluetooth valido.');
                setStep('scan');
                return;
            }

            const hasBlePermissions = await requestBlePermissions();
            if (!hasBlePermissions) {
                Alert.alert('Permisos requeridos', 'Necesitas habilitar permisos de Bluetooth para vincular el dispositivo.');
                setStep('scan');
                return;
            }

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
                    onNext={(data) => { setBleResponse(data); setStep('link'); }}
                    onBack={() => setStep('scan')}
                    device={connectedDevice}
                />
            )}

            {step === 'link' && (
                <LinkStep
                    bleResponse={bleResponse}
                    onNext={() => router.back()}
                    onBack={() => setStep('wifi')}
                />
            )}
        </Container>
    );
}