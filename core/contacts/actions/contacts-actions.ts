import { handleApiError } from "@/helpers/api-error.helper";
import { httpClient } from "@/core/api/http-client";

export interface PersonImage {
    id: number;
    imageUrl: string;
}

export interface PersonContact {
    cellphone?: string;
    email?: string;
    userId: string | null;
}

export interface Person {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    isOwner: boolean;
    images: PersonImage[];
    // null cuando es un contacto "solo a registrar" (conocido), no vinculado
    // a un usuario de la app.
    contact: PersonContact | null;
}

export interface AddContactPayload {
    firstName: string;
    lastName: string;
    role?: string;
    // Imágenes en base64 (sin el prefijo data:image/...). El backend requiere
    // al menos 3.
    images: string[];
    // Los contactos "solo a registrar" (conocidos) no están vinculados a un
    // usuario de la app, así que se manda null en vez del nodo completo.
    contact: {
        email?: string;
        cellphone?: string;
        // No existe (todavía) un endpoint para resolver el userId de un usuario
        // existente a partir de su email, así que se manda null hasta que ese
        // flujo de búsqueda esté disponible en el backend.
        userId: string | null;
    } | null;
}

interface GetContactsResponse {
    data: Person[];
}

interface GetContactResponse {
    data: Person;
}

const CONTACTS_ENDPOINT = "/me/device/persons";

export const getContacts = async (): Promise<Person[]> => {
    try {
        const response = await httpClient.get<GetContactsResponse>(CONTACTS_ENDPOINT);
        return response.data.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const getContact = async (personId: string): Promise<Person> => {
    try {
        const response = await httpClient.get<GetContactResponse>(`${CONTACTS_ENDPOINT}/${personId}`);
        return response.data.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const addContacts = async (payload: AddContactPayload): Promise<void> => {
    try {
        await httpClient.post(CONTACTS_ENDPOINT, payload);
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const addContactImages = async (personId: string, images: string[]): Promise<void> => {
    try {
        await httpClient.post(`${CONTACTS_ENDPOINT}/${personId}/images`, { images });
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export interface UpdateContactPayload {
    firstName: string;
    lastName: string;
    role?: string;
    // Los contactos "solo a registrar" (conocidos) no están vinculados a un
    // usuario de la app, así que se manda null en vez del nodo completo.
    contact: {
        email?: string;
        cellphone?: string;
        userId: string | null;
    } | null;
}

export const updateContact = async (personId: string, payload: UpdateContactPayload): Promise<void> => {
    try {
        await httpClient.patch(`${CONTACTS_ENDPOINT}/${personId}`, payload);
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};
