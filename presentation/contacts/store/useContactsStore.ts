import { create } from 'zustand';
import { Contact, ContactType, RecognitionStatus } from '../types';
import {
  addContactImages as addContactImagesAction,
  createPerson,
  getContact,
  getContacts,
  Person,
  updateContact as updateContactAction,
} from '@/core/contacts/actions/contacts-actions';

const mapPersonToContact = (person: Person): Contact => {
  // Si el nodo "contact" viene null, es un contacto "solo a registrar"
  // (conocido); si viene con datos, es un "cercano" a notificar.
  const type: ContactType = person.contact ? 'cercano' : 'conocido';
  const photos = person.images.map((image) => image.imageUrl);

  return {
    id: person.id,
    name: `${person.firstName} ${person.lastName}`.trim(),
    firstName: person.firstName,
    lastName: person.lastName,
    relation: person.role,
    priority: null,
    type,
    notify: type === 'cercano',
    recognitionStatus: photos.length > 0 ? 'active' : 'missing_photo',
    photoUri: photos[0] ?? null,
    photos,
    email: person.contact?.email ?? null,
    cellphone: person.contact?.cellphone ?? null,
    createdAt: '',
  };
};

type UpdateContactInput = {
  firstName: string;
  lastName: string;
  role: string;
  email?: string | null;
  cellphone?: string | null;
};

type AddContactInput = {
  name: string;
  lastName: string;
  role: string;
  // Los contactos "solo a registrar" (conocidos) no requieren email.
  email?: string;
  notify: boolean;
  type: ContactType;
  // Imágenes en base64 (sin el prefijo data:image/...). El backend requiere
  // al menos 3.
  images: string[];
};

type ContactsState = {
  contacts: Contact[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Contacto individual mostrado en el detalle, traído directo de
  // /me/device/persons/{id} en vez de buscarse en `contacts`.
  selectedContact: Contact | null;
  isLoadingSelectedContact: boolean;

  // queries / fetch
  fetchContacts: () => Promise<void>;
  fetchContact: (id: string) => Promise<void>;

  // mutations
  /** Devuelve el id del contacto creado. */
  addContact: (input: AddContactInput) => Promise<string>;
  addContactImages: (id: string, images: string[]) => Promise<void>;
  updateContact: (id: string, input: UpdateContactInput) => Promise<void>;
  removeContact: (id: string) => void;
  toggleNotify: (id: string) => void;
  updatePriority: (id: string, priority: number | null) => void;
  setRecognitionStatus: (id: string, status: RecognitionStatus) => void;
};

export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  selectedContact: null,
  isLoadingSelectedContact: false,

  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const persons = await getContacts();
      const contacts = persons.map(mapPersonToContact);
      set({ contacts, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudieron cargar los contactos';
      set({ error: message, isLoading: false });
    }
  },

  fetchContact: async (id) => {
    set({ isLoadingSelectedContact: true, error: null });
    try {
      const person = await getContact(id);
      set({ selectedContact: mapPersonToContact(person), isLoadingSelectedContact: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo cargar el contacto';
      set({ selectedContact: null, error: message, isLoadingSelectedContact: false });
    }
  },

  addContact: async (input) => {
    set({ isSubmitting: true, error: null });
    try {
      const createdPerson = await createPerson({
        firstName: input.name,
        lastName: input.lastName,
        role: input.role || undefined,
        images: input.images,
        // Los contactos "solo a registrar" (conocidos) no están vinculados a
        // un usuario de la app, así que se manda el nodo completo en null.
        contact: input.type === 'cercano'
          ? {
              email: input.email,
              // No existe (todavía) un endpoint para resolver el userId de un
              // usuario existente a partir de su email.
              userId: null,
            }
          : null,
      });

      // El POST devuelve la persona creada (con id e imágenes reales), así que
      // se agrega localmente en vez de refetchear.
      const newContact = mapPersonToContact(createdPerson);
      set((state) => ({ contacts: [...state.contacts, newContact], isSubmitting: false }));
      return newContact.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo agregar el contacto';
      set({ error: message, isSubmitting: false });
      throw err;
    }
  },

  addContactImages: async (id, images) => {
    set({ isSubmitting: true, error: null });
    try {
      await addContactImagesAction(id, images);
      // Se refetchea el detalle (en vez de agregar localmente) porque el
      // backend devuelve la URL real de cada imagen subida, que acá no tenemos.
      await get().fetchContact(id);
      set({ isSubmitting: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudieron agregar las fotos';
      set({ error: message, isSubmitting: false });
      throw err;
    }
  },

  updateContact: async (id, input) => {
    set({ isSubmitting: true, error: null });
    try {
      const hasContactInfo = !!input.email || !!input.cellphone;
      await updateContactAction(id, {
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role || undefined,
        // Mismo criterio que en el alta: si no hay email ni teléfono, se manda
        // el nodo completo en null (contacto "solo a registrar").
        contact: hasContactInfo
          ? {
              email: input.email ?? undefined,
              cellphone: input.cellphone ?? undefined,
              userId: null,
            }
          : null,
      });
      // Se refetchea también la lista porque agregar (o quitar) datos de
      // contacto cambia el tipo del contacto: un "conocido" pasa a "cercano"
      // y tiene que moverse de sección.
      await Promise.all([get().fetchContact(id), get().fetchContacts()]);
      set({ isSubmitting: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudieron guardar los cambios';
      set({ error: message, isSubmitting: false });
      throw err;
    }
  },

  removeContact: (id) => {
    set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id) }));
  },

  toggleNotify: (id) => {
    // "notify" no está persistido en el backend (el PATCH no tiene campo para
    // esto), así que solo se actualiza en memoria: la lista y, si corresponde,
    // el contacto del detalle.
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === id ? { ...c, notify: !c.notify } : c)),
      selectedContact:
        state.selectedContact?.id === id
          ? { ...state.selectedContact, notify: !state.selectedContact.notify }
          : state.selectedContact,
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
