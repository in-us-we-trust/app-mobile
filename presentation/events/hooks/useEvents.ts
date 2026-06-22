import { useEffect } from 'react';
import { useEventsStore } from '../store/useEventsStore';

export const useEvents = () => {
  const { events, isLoading: loading, error, fetchEvents: refresh } = useEventsStore();

  useEffect(() => {
    refresh();
  }, []);

  return { events, loading, error, refresh };
};
