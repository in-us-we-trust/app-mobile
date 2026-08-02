import { handleApiError } from "@/helpers/api-error.helper";
import { httpClient } from "@/core/api/http-client";

interface LinkDevicePayload {
    deviceId: string;
    name: string;
}

export interface DeviceData {
    createdAt: string;
    deviceId: string;
    name: string;
}

interface GetDeviceResponse {
    data: DeviceData;
}

const DEVICE_ENDPOINT = "/me/device";

export const linkDeviceAction = async (payload: LinkDevicePayload): Promise<void> => {
    try {
        await httpClient.post(DEVICE_ENDPOINT, payload);
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const getDeviceAction = async (): Promise<DeviceData> => {
    try {
        const response = await httpClient.get<GetDeviceResponse>(DEVICE_ENDPOINT);
        return response.data.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};
