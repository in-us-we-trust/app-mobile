import { useDeviceStore } from '../store/useDeviceStore';

export function useDevice() {
    return useDeviceStore();
}
