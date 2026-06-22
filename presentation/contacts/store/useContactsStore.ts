import { create } from 'zustand';
import { Contact, CreateContactInput, RecognitionStatus } from '../types';
import { MOCK_CONTACTS } from '../mocks/contactsMocks';

type ContactsState = {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;

  // queries / fetch
  fetchContacts: () => Promise<void>;

  // mutations
  addContact: (input: CreateContactInput) => void;
  removeContact: (id: string) => void;
  toggleNotify: (id: string) => void;
  updatePriority: (id: string, priority: number | null) => void;
  setRecognitionStatus: (id: string, status: RecognitionStatus) => void;
};

export const useContactsStore = create<ContactsState>((set) => ({
  contacts: [],
  isLoading: false,
  error: null,

  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: reemplazar por el endpoint real (users API / notification-service)
      await new Promise((resolve) => setTimeout(resolve, 300));
      set({ contacts: MOCK_CONTACTS, isLoading: false });
    } catch (err) {
      set({ error: 'No se pudieron cargar los contactos', isLoading: false });
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
