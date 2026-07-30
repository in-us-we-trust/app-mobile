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

export type DoorbellCapture = {
    id: string;
    /** ej. "08:12" o "Ayer 19:04" — ya viene formateado, no hay Date real detrás */
    label: string;
    imageUri: string;
};

export type SuggestedContact = {
    id: string;
    badgeLabel: string;
    subtitle: string;
    /** Capturas del timbre asociadas a la persona detectada. La primera se
     * usa como "captura principal" en el modal de sugerencia. */
    captures: DoorbellCapture[];
};
