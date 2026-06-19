import { HomeEvent } from "../types";

export const MOCK_EVENTS: HomeEvent[] = [
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