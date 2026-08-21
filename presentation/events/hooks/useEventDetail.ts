import { useEffect } from 'react';
import { useEventsStore } from '../store/useEventsStore';

export const useEventDetail = (trackId: string | undefined) => {
  const {
    selectedEvent,
    isLoadingSelectedEvent,
    selectedEventError,
    fetchEventDetail,
  } = useEventsStore();

  useEffect(() => {
    if (trackId) {
      fetchEventDetail(trackId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId]);

  return {
    event: selectedEvent,
    isLoading: isLoadingSelectedEvent,
    error: selectedEventError,
    refresh: () => (trackId ? fetchEventDetail(trackId) : Promise.resolve()),
  };
};
