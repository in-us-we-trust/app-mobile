import { create } from 'zustand';
import { HomeEvent } from '../types';
import { MOCK_EVENTS } from '../mocks/eventsMock';

type EventsState = {
    events: HomeEvent[];
    isLoading: boolean;
    error: string | null;

    fetchEvents: () => Promise<void>;
};

export const useEventsStore = create<EventsState>((set) => ({
    events: [],
    isLoading: false,
    error: null,

    fetchEvents: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise((resolve) => setTimeout(resolve, 600));
            set({ events: MOCK_EVENTS, isLoading: false });
        } catch (err) {
            set({ error: 'No se pudieron cargar los eventos.', isLoading: false });
        }
    },
}));
