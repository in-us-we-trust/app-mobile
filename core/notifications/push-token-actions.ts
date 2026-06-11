import { handleApiError } from "@/helpers/api-error.helper";
import { httpClient } from "@/core/api/http-client";

interface RegisterPushTokenPayload {
    deviceName: string;
    platform: string;
    pushToken: string;
}

interface RegisterPushTokenResponse {
    id: number;
    userId: string;
    deviceName: string;
    platform: string;
    enabled: boolean;
}

export interface RegisteredPushToken {
    id: number;
    userId: string;
    deviceName: string;
    platform: string;
    enabled: boolean;
}

const PUSH_TOKEN_ENDPOINT = "/me/push-token";

export const registerPushTokenAction = async (
    payload: RegisterPushTokenPayload,
): Promise<RegisteredPushToken> => {
    try {
        const response = await httpClient.post<RegisterPushTokenResponse>(
            PUSH_TOKEN_ENDPOINT,
            payload,
        );
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const deletePushTokenAction = async (appDeviceId: number): Promise<void> => {
    try {
        await httpClient.delete(`${PUSH_TOKEN_ENDPOINT}/${appDeviceId}`);
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};
