import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { HomeEvent } from '../types';

// ─── Mock data (reemplazar con llamada real a la API) ─────────────────────────

const MOCK_EVENTS: HomeEvent[] = [
  {
    id: '1',
    title: 'Movimiento detectado',
    severity: 'critical',
    time: '14:32',
    date: 'Hoy',
    description: 'Se detectó movimiento inusual en la zona de entrada. El sensor activó la alerta automáticamente.',
    zone: 'Puerta principal',
  },
  {
    id: '2',
    title: 'Batería baja',
    severity: 'warning',
    time: '11:05',
    date: 'Hoy',
    zone: 'Sensor cocina',
  },
  {
    id: '3',
    title: 'Sistema armado',
    severity: 'info',
    time: '08:00',
    date: 'Hoy',
    zone: 'Sistema general',
  },
  {
    id: '4',
    title: 'Acceso registrado',
    severity: 'info',
    time: '22:15',
    date: 'Ayer',
    zone: 'Puerta trasera',
  },
  {
    id: '5',
    title: 'Sensor desconectado',
    severity: 'warning',
    time: '17:40',
    date: 'Ayer',
    zone: 'Ventana dormitorio',
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

interface EventsContextValue {
  events: HomeEvent[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const EventsContext = createContext<EventsContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<HomeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: reemplazar con fetch real, ej:
      // const response = await api.get<HomeEvent[]>('/events');
      // setEvents(response.data);
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