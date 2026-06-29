import { create } from 'zustand';
import { getDeviceAction } from '@/core/device/device-actions';

type Device = {
    createdAt: string;
    deviceId: string;
    name: string;
};

type DeviceState = {
    device: Device | null;
    isLoading: boolean;
    error: string | null;

    fetchDevice: () => Promise<void>;
    clearDevice: () => void;
};

export const useDeviceStore = create<DeviceState>((set) => ({
    device: null,
    isLoading: false,
    error: null,

    fetchDevice: async () => {
        set({ isLoading: true, error: null });
        try {
            const device = await getDeviceAction();
            set({ device, isLoading: false });
        } catch {
            set({ device: null, error: null, isLoading: false });
        }
    },

    clearDevice: () => set({ device: null, error: null }),
}));
