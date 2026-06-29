import { useState } from 'react';
import { Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { linkDeviceAction } from '@/core/device/device-actions';

type LinkStatus = 'idle' | 'linking' | 'success' | 'error';

const WIFI_SERVICE_UUID = '12345678-1234-1234-1234-123456789000';
const WIFI_CONFIRM_CHAR_UUID = '12345678-1234-1234-1234-123456789002';

const sendConfirmation = async (device: Device, success: boolean) => {
    try {
        const payload = Buffer.from(
            JSON.stringify({ status: success ? 'success' : 'failed' })
        ).toString('base64');
        await device.writeCharacteristicWithoutResponseForService(
            WIFI_SERVICE_UUID,
            WIFI_CONFIRM_CHAR_UUID,
            payload,
        );
    } catch (error) {
        console.warn('Error mandando confirmación al ESP32:', error);
    }
};

export function useLinkDevice() {
    const [status, setStatus] = useState<LinkStatus>('idle');

    const linkDevice = async (
        deviceId: string | null | undefined,
        device: Device | null,
        name: string,
    ) => {
        const normalizedDeviceId = typeof deviceId === 'string' ? deviceId.trim() : '';
        console.log('Iniciando vinculación del dispositivo:', normalizedDeviceId || deviceId, name);

        if (!normalizedDeviceId || !device) {
            console.warn(
                'No se pudo vincular: falta deviceId o dispositivo BLE activo.',
                JSON.stringify({ hasDeviceId: !!normalizedDeviceId, hasBleDevice: !!device }),
            );
            setStatus('error');
            return false;
        }

        setStatus('linking');

        try {
            await linkDeviceAction({ deviceId: normalizedDeviceId, name });
            await sendConfirmation(device, true);
            setStatus('success');
            return true;
        } catch (error) {
            console.error('Error vinculando el dispositivo:', error);
            await sendConfirmation(device, false);
            setStatus('error');
            return false;
        }
    };

    const reset = () => setStatus('idle');

    return { status, linkDevice, reset };
}
