import { create } from 'zustand';
import { Contact, ContactType, CreateContactInput, RecognitionStatus } from '../types';
import { MOCK_CONTACTS } from '../mocks/contactsMocks';
import {
  addDevicePersonAction,
  DeviceContact,
  getDeviceContactsAction,
} from '@/core/contacts/actions/contacts-actions';

const mapDeviceContactToContact = (deviceContact: DeviceContact): Contact => ({
  id: deviceContact.contactId,
  name: `${deviceContact.name} ${deviceContact.lastName}`.trim(),
  relation: deviceContact.email,
  priority: null,
  type: 'conocido',
  notify: false,
  recognitionStatus: 'active',
  photoUri: null,
  createdAt: '',
});

type AddContactoInput = {
  name: string;
  lastName: string;
  role: string;
  // Los contactos "solo a registrar" (conocidos) no requieren email.
  email?: string;
  notify: boolean;
  type: ContactType;
  // Imágenes en base64 (sin el prefijo data:image/...). El backend requiere
  // al menos 3; hasta que la pantalla implemente la captura real de fotos
  // esto llega vacío y el alta falla en el backend.
  images: string[];
};

type ContactsState = {
  contacts: Contact[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // queries / fetch
  fetchContacts: () => Promise<void>;

  // mutations
  addContact: (input: CreateContactInput) => void;
  addContactos: (input: AddContactoInput) => Promise<void>;
  removeContact: (id: string) => void;
  toggleNotify: (id: string) => void;
  updatePriority: (id: string, priority: number | null) => void;
  setRecognitionStatus: (id: string, status: RecognitionStatus) => void;
};

export const useContactsStore = create<ContactsState>((set) => ({
  contacts: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const deviceContacts = await getDeviceContactsAction();
      const conocidos = deviceContacts.map(mapDeviceContactToContact);
      // TODO: reemplazar por el endpoint real de "cercanos" cuando esté disponible
      const cercanos = MOCK_CONTACTS.filter((c) => c.type === 'cercano');
      set({ contacts: [...cercanos, ...conocidos], isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudieron cargar los contactos';
      set({ error: message, isLoading: false });
    }
  },

  addContact: (input) => {
    const newContact: Contact = {
      ...input,
      id: Date.now().toString(),
      recognitionStatus: input.recognitionStatus ?? 'pending',
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ contacts: [...state.contacts, newContact] }));
  },

  addContactos: async (input) => {
    set({ isSubmitting: true, error: null });
    try {
      await addDevicePersonAction({
        firstName: input.name,
        lastName: input.lastName,
        role: input.role || undefined,
        images: input.images,
        contact: {
          email: input.email,
          // No existe (todavía) un endpoint para resolver el userId de un
          // usuario existente a partir de su email.
          userId: null,
        },
      });

      // No hay endpoint de lectura para "personas" todavía, así que se agrega
      // localmente en vez de refetchear.
      const newContact: Contact = {
        id: Date.now().toString(),
        name: `${input.name} ${input.lastName}`.trim(),
        relation: input.role,
        priority: null,
        type: input.type,
        notify: input.notify,
        recognitionStatus: input.images.length > 0 ? 'pending' : 'missing_photo',
        photoUri: null,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({ contacts: [...state.contacts, newContact], isSubmitting: false }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo agregar el contacto';
      set({ error: message, isSubmitting: false });
      throw err;
    }
  },

  removeContact: (id) => {
    set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id) }));
  },

  toggleNotify: (id) => {
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === id ? { ...c, notify: !c.notify } : c)),
    }));
  },

  updatePriority: (id, priority) => {
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === id ? { ...c, priority } : c)),
    }));
  },

  setRecognitionStatus: (id, status) => {
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === id ? { ...c, recognitionStatus: status } : c)),
    }));
  },
}));
