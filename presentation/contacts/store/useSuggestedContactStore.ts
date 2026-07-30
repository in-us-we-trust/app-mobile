import { create } from 'zustand';
import { SuggestedContact } from '../types';
import { MOCK_SUGGESTED_CONTACT } from '../mocks/suggestedContactMock';
import { SecureStorageAdapter } from '@/helpers/adapters/secure-storage.adapter';

// Ids de sugerencias ya resueltas (aceptadas o ignoradas) para no volver a
// mostrarlas en próximos inicios de sesión, hasta que exista backend real.
const DISMISSED_SUGGESTIONS_KEY = 'dismissedContactSuggestions';

type SuggestedContactState = {
    suggestion: SuggestedContact | null;
    isLoading: boolean;
    fetchSuggestion: () => Promise<void>;
    dismissSuggestion: () => Promise<void>;
};

const getDismissedIds = async (): Promise<string[]> => {
    const raw = await SecureStorageAdapter.getItem(DISMISSED_SUGGESTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
};

export const useSuggestedContactStore = create<SuggestedContactState>((set, get) => ({
    suggestion: null,
    isLoading: false,

    fetchSuggestion: async () => {
        set({ isLoading: true });
        try {
            // TODO: reemplazar por el endpoint real cuando esté disponible.
            await new Promise((resolve) => setTimeout(resolve, 600));
            const dismissedIds = await getDismissedIds();
            const candidate = MOCK_SUGGESTED_CONTACT;
            set({
                // suggestion: dismissedIds.includes(candidate.id) ? null : candidate,
                suggestion: candidate,
                isLoading: false,
            });
        } catch {
            set({ suggestion: null, isLoading: false });
        }
    },

    dismissSuggestion: async () => {
        const { suggestion } = get();
        if (!suggestion) return;
        set({ suggestion: null });

        const dismissedIds = await getDismissedIds();
        if (!dismissedIds.includes(suggestion.id)) {
            await SecureStorageAdapter.setItem(
                DISMISSED_SUGGESTIONS_KEY,
                JSON.stringify([...dismissedIds, suggestion.id]),
            );
        }
    },
}));
