import { useEffect } from 'react';
import { useEventsStore } from '../store/useEventsStore';

export const useEvents = () => {
  const { urgentEvent, events, isLoading: loading, error, fetchEvents: refresh } = useEventsStore();

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { urgentEvent, events, loading, error, refresh };
};
