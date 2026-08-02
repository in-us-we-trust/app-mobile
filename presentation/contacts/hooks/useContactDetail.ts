import { useEffect } from 'react';
import { useContactsStore } from '../store/useContactsStore';

export function useContactDetail(id: string | undefined) {
  const {
    selectedContact,
    isLoadingSelectedContact,
    isSubmitting,
    fetchContact,
    addContactImages,
    updateContact,
    toggleNotify,
  } = useContactsStore();

  useEffect(() => {
    if (id) {
      fetchContact(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    contact: selectedContact,
    isLoading: isLoadingSelectedContact,
    isSubmitting,
    addContactImages,
    updateContact,
    toggleNotify,
  };
}
