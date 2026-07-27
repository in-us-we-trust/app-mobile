import { useEffect, useMemo } from 'react';
import { useContactsStore } from '../store/useContactsStore';

export function useContacts() {
  const {
    contacts,
    isLoading,
    isSubmitting,
    error,
    fetchContacts,
    addContact,
    addContactos,
    removeContact,
    toggleNotify,
    updatePriority,
    setRecognitionStatus,
  } = useContactsStore();

  useEffect(() => {
    if (contacts.length === 0) {
      fetchContacts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notifyContacts = useMemo(() => contacts.filter((c) => c.notify), [contacts]);
  const cercanos = useMemo(() => contacts.filter((c) => c.type === 'cercano'), [contacts]);
  const conocidos = useMemo(() => contacts.filter((c) => c.type === 'conocido'), [contacts]);

  return {
    contacts,
    notifyContacts,
    cercanos,
    conocidos,
    isLoading,
    isSubmitting,
    error,
    refresh: fetchContacts,
    addContact,
    addContactos,
    removeContact,
    toggleNotify,
    updatePriority,
    setRecognitionStatus,
  };
}
