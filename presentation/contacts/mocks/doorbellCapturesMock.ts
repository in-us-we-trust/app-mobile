import { DoorbellCapture } from "../types";

// Fotos de placeholder (servicio pravatar.cc, pensado justamente para
// avatares de prueba) hasta que el endpoint real de capturas del timbre
// esté disponible.
export const MOCK_DOORBELL_CAPTURES: DoorbellCapture[] = [
    { id: '1', label: '08:12', imageUri: 'https://i.pravatar.cc/300?img=11' },
    { id: '2', label: '08:13', imageUri: 'https://i.pravatar.cc/300?img=12' },
    { id: '3', label: '08:15', imageUri: 'https://i.pravatar.cc/300?img=13' },
    { id: '4', label: '08:41', imageUri: 'https://i.pravatar.cc/300?img=14' },
    { id: '5', label: 'Ayer 19:04', imageUri: 'https://i.pravatar.cc/300?img=15' },
    { id: '6', label: 'Ayer 19:05', imageUri: 'https://i.pravatar.cc/300?img=16' },
    { id: '7', label: 'Ayer 20:12', imageUri: 'https://i.pravatar.cc/300?img=17' },
    { id: '8', label: 'Lun 09:30', imageUri: 'https://i.pravatar.cc/300?img=18' },
    { id: '9', label: 'Lun 09:31', imageUri: 'https://i.pravatar.cc/300?img=19' },
    { id: '10', label: 'Lun 11:02', imageUri: 'https://i.pravatar.cc/300?img=20' },
    { id: '11', label: 'Lun 11:04', imageUri: 'https://i.pravatar.cc/300?img=21' },
    { id: '12', label: 'Dom 14:20', imageUri: 'https://i.pravatar.cc/300?img=22' },
];
