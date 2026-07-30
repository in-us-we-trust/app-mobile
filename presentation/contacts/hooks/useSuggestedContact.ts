import { useEffect } from 'react';
import { useSuggestedContactStore } from '../store/useSuggestedContactStore';

export function useSuggestedContact() {
  const { suggestion, isLoading, fetchSuggestion, dismissSuggestion } = useSuggestedContactStore();

  useEffect(() => {
    fetchSuggestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { suggestion, isLoading, dismissSuggestion };
}
