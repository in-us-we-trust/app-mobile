import { handleApiError } from "@/helpers/api-error.helper";
import { httpClient } from "@/core/api/http-client";

export interface DeviceContact {
    contactId: string;
    email: string;
    isOwner: boolean;
    lastName: string;
    name: string;
    userId: string;
}

export interface AddDevicePersonPayload {
    firstName: string;
    lastName: string;
    role?: string;
    // Imágenes en base64 (sin el prefijo data:image/...). El backend requiere
    // al menos 3.
    images: string[];
    contact: {
        // Los contactos "solo a registrar" (conocidos) no requieren email.
        email?: string;
        cellphone?: string;
        // No existe (todavía) un endpoint para resolver el userId de un usuario
        // existente a partir de su email, así que se manda null hasta que ese
        // flujo de búsqueda esté disponible en el backend.
        userId: string | null;
    };
}

const DEVICE_CONTACTS_ENDPOINT = "/me/devices/contacts";
const ADD_DEVICE_PERSON_ENDPOINT = "/me/device/persons";

export const getDeviceContactsAction = async (): Promise<DeviceContact[]> => {
    try {
        const response = await httpClient.get<DeviceContact[]>(DEVICE_CONTACTS_ENDPOINT);
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const addDevicePersonAction = async (payload: AddDevicePersonPayload): Promise<void> => {
    try {
        await httpClient.post(ADD_DEVICE_PERSON_ENDPOINT, payload);
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};
