import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { HomeEvent } from '../types';
import { MOCK_EVENTS } from '../mocks/eventsMock';
interface EventsContextValue {
  events: HomeEvent[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const EventsContext = createContext<EventsContextValue | null>(null);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<HomeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((res) => setTimeout(res, 600)); // simula latencia
      setEvents(MOCK_EVENTS);
    } catch (err) {
      setError('No se pudieron cargar los eventos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <EventsContext.Provider value={{ events, loading, error, refresh: fetchEvents }}>
      {children}
    </EventsContext.Provider>
  );
}