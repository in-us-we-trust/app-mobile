import { handleApiError } from "@/helpers/api-error.helper";
import { httpClient } from "@/core/api/http-client";

interface RegisterPayload {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface LoginResponse {
    data: {
        accessToken: string;
        refreshToken: string;
    };
}

interface RegisterResponse {
    data: {
        createdAt: string;
        email: string;
        firstName: string;
        id: string;
        lastName: string;
    };
}

export interface RegisteredUser {
    createdAt: string;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
}

export interface LoginResult {
    accessToken: string;
    refreshToken: string;
}

const REGISTER_ENDPOINT = "/register";
const LOGIN_ENDPOINT = "/login";

export const registerAction = async (
    payload: RegisterPayload,
): Promise<RegisteredUser> => {
    try {
        const response = await httpClient.post<RegisterResponse>(REGISTER_ENDPOINT, payload);
        return response.data.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const loginAction = async (payload: LoginPayload): Promise<LoginResult> => {
    try {
        const response = await httpClient.post<LoginResponse>(LOGIN_ENDPOINT, payload);
        return response.data.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};
