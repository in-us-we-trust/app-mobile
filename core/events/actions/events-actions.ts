import { handleApiError } from "@/helpers/api-error.helper";
import { httpClient } from "@/core/api/http-client";

/** Códigos conocidos; se deja `string` abierto porque el backend puede sumar nuevos. */
export type EventCode = "KNOWN_PERSON" | "UNKNOWN_PERSON" | "WEAPON" | (string & {});

export type EventVerdict = "STOP_DANGER" | "STOP_SAFE" | "CONTINUE" | (string & {});

export type EventSeverityCode = "PELIGROSO" | "SOSPECHOSO" | "NORMAL" | (string & {});

export interface DeviceEvent {
    /** UUID del track que originó el evento. Identifica al evento en el backend. */
    trackId: string;
    code: EventCode;
    title: string;
    finalVerdict: EventVerdict;
    finalSeverity: EventSeverityCode;
    createdAt: string;
    updatedAt: string;
}

export interface DeviceEvents {
    /** Evento a destacar en la pantalla. Puede no existir. */
    urgentEvent: DeviceEvent | null;
    events: DeviceEvent[];
}

/** Detalle de un evento. El backend no repite el trackId acá, lo agrega el action. */
export interface DeviceEventDetail {
    trackId: string;
    code: EventCode;
    title: string;
    finalVerdict: EventVerdict;
    finalSeverity: EventSeverityCode;
    createdAt: string;
    updatedAt: string;
    /** Captura del timbre. Puede no estar. */
    imageUrl: string | null;
}

interface GetEventsResponse {
    data: DeviceEvents;
}

interface GetEventDetailResponse {
    data: {
        code: EventCode;
        title: string;
        finalVerdict: EventVerdict;
        finalSeverity: EventSeverityCode;
        createdAt: string;
        updatedAt: string;
        imageUrl: string | null;
    };
}

const EVENTS_ENDPOINT = "/me/device/events";

export const getDeviceEvents = async (): Promise<DeviceEvents> => {
    try {
        const response = await httpClient.get<GetEventsResponse>(EVENTS_ENDPOINT);
        const data = response.data.data;

        return {
            urgentEvent: data?.urgentEvent ?? null,
            events: data?.events ?? [],
        };
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const getDeviceEventDetail = async (trackId: string): Promise<DeviceEventDetail> => {
    try {
        const response = await httpClient.get<GetEventDetailResponse>(`${EVENTS_ENDPOINT}/${trackId}`);
        const data = response.data.data;

        return {
            trackId,
            code: data.code,
            title: data.title,
            finalVerdict: data.finalVerdict,
            finalSeverity: data.finalSeverity,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            imageUrl: data.imageUrl ?? null,
        };
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};
