import { create } from 'zustand';
import { EventDetail, HomeEvent } from '../types';
import { getDeviceEventDetail, getDeviceEvents } from '@/core/events/actions/events-actions';
import { mapDeviceEvent, mapDeviceEventDetail, mapDeviceEvents } from '../mappers/eventMapper';

type EventsState = {
    /** Evento destacado que el backend marca como urgente. Se muestra en la card principal. */
    urgentEvent: HomeEvent | null;
    /** Historial. No incluye al urgente. */
    events: HomeEvent[];
    isLoading: boolean;
    error: string | null;

    /** Evento abierto en la pantalla de detalle. */
    selectedEvent: EventDetail | null;
    isLoadingSelectedEvent: boolean;
    selectedEventError: string | null;

    fetchEvents: () => Promise<void>;
    fetchEventDetail: (trackId: string) => Promise<void>;
};

export const useEventsStore = create<EventsState>((set, get) => ({
    urgentEvent: null,
    events: [],
    isLoading: false,
    error: null,

    selectedEvent: null,
    isLoadingSelectedEvent: false,
    selectedEventError: null,

    fetchEvents: async () => {
        set({ isLoading: true, error: null });
        try {
            const { urgentEvent, events } = await getDeviceEvents();

            set({
                urgentEvent: urgentEvent ? mapDeviceEvent(urgentEvent) : null,
                events: mapDeviceEvents(events),
                isLoading: false,
            });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'No se pudieron cargar los eventos.',
                isLoading: false,
            });
        }
    },

    fetchEventDetail: async (trackId: string) => {
        // Al abrir otro evento se limpia el anterior para no mostrar datos viejos
        // mientras carga; si es el mismo, se deja visible y solo se refresca.
        const isSameEvent = get().selectedEvent?.trackId === trackId;

        set({
            isLoadingSelectedEvent: true,
            selectedEventError: null,
            selectedEvent: isSameEvent ? get().selectedEvent : null,
        });

        try {
            const detail = await getDeviceEventDetail(trackId);
            set({ selectedEvent: mapDeviceEventDetail(detail), isLoadingSelectedEvent: false });
        } catch (err) {
            set({
                selectedEventError:
                    err instanceof Error ? err.message : 'No se pudo cargar el evento.',
                isLoadingSelectedEvent: false,
            });
        }
    },
}));
