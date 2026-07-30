import { SuggestedContact } from '../types';

// Placeholder hasta que exista el endpoint real de sugerencias de contacto
// a partir de reconocimientos recurrentes del timbre.
export const MOCK_SUGGESTED_CONTACT: SuggestedContact = {
    id: 'suggestion-1',
    badgeLabel: 'Detectado varias veces esta semana',
    subtitle: 'Tu timbre reconoció a la misma persona en 4 visitas y todavía no está en tu lista.',
    captures: [
        { id: 'sugerido-1', label: 'Hoy · 14:32', imageUri: 'https://i.pravatar.cc/300?img=33' },
        { id: 'sugerido-2', label: 'Ayer 19:04', imageUri: 'https://i.pravatar.cc/300?img=34' },
        { id: 'sugerido-3', label: 'Lun 09:30', imageUri: 'https://i.pravatar.cc/300?img=35' },
        { id: 'sugerido-4', label: 'Lun 11:02', imageUri: 'https://i.pravatar.cc/300?img=36' },
    ],
};
