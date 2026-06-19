export type ContactType = 'cercano' | 'conocido';

export type RecognitionStatus = 'active' | 'missing_photo' | 'pending';

export type Contact = {
    id: string;
    name: string;
    relation: string;
    /** null para "conocidos" que no tienen orden de prioridad de aviso */
    priority: number | null;
    type: ContactType;
    /** si true, dispara notificación push al ser reconocido */
    notify: boolean;
    recognitionStatus: RecognitionStatus;
    photoUri?: string | null;
    createdAt: string;
};

export type CreateContactInput = Omit<Contact, 'id' | 'createdAt' | 'recognitionStatus'> & {
    recognitionStatus?: RecognitionStatus;
};
