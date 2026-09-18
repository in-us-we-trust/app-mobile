import { useEffect, useRef, useState } from 'react';
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
import ErrorStep from '../components/steps/ErrorStep';

const manager = new BleManager();

const WIFI_SERVICE_UUID = '12345678-1234-1234-1234-123456789000';
const SCAN_TIMEOUT_MS = 15000;

const Container = styled.View`
  flex: 1;
`;

type Step = 'scan' | 'connecting' | 'wifi' | 'link' | 'error';

type LinkError = {
    title?: string;
    message?: string;
    // Paso al que vuelve el botón "Volver a intentar".
    retryStep: Exclude<Step, 'error' | 'connecting'>;
};

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
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [activeDevice, setActiveDevice] = useState<Device | null>(null);
    const [linkError, setLinkError] = useState<LinkError | null>(null);
    const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const bleDeviceIdRef = useRef<string | null>(null);
    // Se activa al cancelar o salir de la pantalla, para que las operaciones BLE en curso no sigan.
    const cancelledRef = useRef(false);

    const stopScan = () => {
        manager.stopDeviceScan();
        if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current);
            scanTimeoutRef.current = null;
        }
    };

    // Cierra la conexión BLE de un intento anterior. Mientras el ESP32 tiene un cliente
    // conectado deja de anunciarse, así que sin esto un nuevo escaneo no lo encuentra.
    const disconnectPreviousDevice = async () => {
        const ids = new Set<string>();
        if (bleDeviceIdRef.current) ids.add(bleDeviceIdRef.current);

        try {
            const connected = await manager.connectedDevices([WIFI_SERVICE_UUID]);
            connected.forEach((d) => ids.add(d.id));
        } catch (error) {
            console.warn('No se pudieron obtener los dispositivos conectados:', error);
        }

        await Promise.all([...ids].map(async (id) => {
            try {
                await manager.cancelDeviceConnection(id);
            } catch {
                // Ya estaba desconectado.
            }
        }));

        bleDeviceIdRef.current = null;
        setConnectedDevice(null);
        setActiveDevice(null);
        setDeviceId(null);
    };

    useEffect(() => {
        return () => {
            cancelledRef.current = true;
            stopScan();
            if (bleDeviceIdRef.current) {
                manager.cancelDeviceConnection(bleDeviceIdRef.current).catch(() => {});
            }
        };
    }, []);

    const stepIndexes = { scan: 0, connecting: 0, wifi: 1, link: 2 };
    const stepIndex = step === 'error'
        ? stepIndexes[linkError?.retryStep ?? 'scan']
        : stepIndexes[step];
    const labels = ['Escanear QR', 'Configurar WiFi', 'Vincular'];

    const showError = (error: LinkError) => {
        setLinkError(error);
        setStep('error');
    };

    const handleRetry = () => {
        setStep(linkError?.retryStep ?? 'scan');
        setLinkError(null);
    };

    // Aborta todo el proceso de vinculación y vuelve a la pantalla de dispositivo.
    const handleCancel = () => {
        cancelledRef.current = true;
        stopScan();
        if (bleDeviceIdRef.current) {
            manager.cancelDeviceConnection(bleDeviceIdRef.current).catch(() => {});
            bleDeviceIdRef.current = null;
        }
        router.navigate('/device');
    };

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

            stopScan();
            await disconnectPreviousDevice();
            if (cancelledRef.current) return;

            manager.startDeviceScan(null, null, async (error, device) => {
                if (error) {
                    console.error('Error escaneando:', error);
                    stopScan();
                    showError({
                        title: 'Error de Bluetooth',
                        message: 'No pudimos buscar el timbre. Verificá que el Bluetooth esté encendido e intentalo de nuevo.',
                        retryStep: 'scan',
                    });
                    return;
                }

                if (device && device.name === deviceName) {
                    stopScan();
                    try {
                        const connected = await device.connect();
                        if (cancelledRef.current) {
                            await connected.cancelConnection().catch(() => {});
                            return;
                        }
                        bleDeviceIdRef.current = connected.id;
                        await connected.discoverAllServicesAndCharacteristics();
                        setConnectedDevice(connected);
                        setStep('wifi');
                    } catch (connectError) {
                        if (cancelledRef.current) return;
                        console.error('Error conectando:', connectError);
                        showError({
                            title: 'No se pudo conectar',
                            message: 'Encontramos el timbre pero no pudimos conectarnos. Acercate al dispositivo e intentalo de nuevo.',
                            retryStep: 'scan',
                        });
                    }
                }
            });

            scanTimeoutRef.current = setTimeout(() => {
                stopScan();
                showError({
                    title: 'No encontramos el timbre',
                    message: 'Asegurate de que el timbre esté encendido y cerca del celular.',
                    retryStep: 'scan',
                });
            }, SCAN_TIMEOUT_MS);

        } catch (error) {
            console.error('Error procesando QR:', error);
            showError({ retryStep: 'scan' });
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
                <ScanQRStep onNext={handleQRScanned} onCancel={handleCancel} />
            )}

            {step === 'connecting' && (
                <ConnectingStep onCancel={handleCancel} />
            )}

            {step === 'wifi' && (
                <ConfigureWifiStep
                    device={connectedDevice}
                    onCancel={handleCancel}
                    onError={(title, message) => showError({ title, message, retryStep: 'wifi' })}
                    onNext={(id, dev) => {
                        const normalizedId = typeof id === 'string' ? id.trim() : '';

                        if (!normalizedId || !dev) {
                            Alert.alert(
                                'No se pudo continuar',
                                'No recibimos un identificador valido del dispositivo. Volve a intentar la configuracion WiFi.',
                            );
                            setStep('wifi');
                            return;
                        }

                        setDeviceId(normalizedId);
                        setActiveDevice(dev);
                        setStep('link');
                    }}
                />
            )}

            {step === 'link' && (
                <LinkStep
                    deviceId={deviceId}
                    device={activeDevice}
                    onNext={() => router.back()}
                    onCancel={handleCancel}
                />
            )}

            {step === 'error' && (
                <ErrorStep
                    title={linkError?.title}
                    message={linkError?.message}
                    onRetry={handleRetry}
                    onCancel={handleCancel}
                />
            )}
        </Container>
    );
}
