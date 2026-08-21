import { DeviceEvent, DeviceEventDetail } from '@/core/events/actions/events-actions';
import { EventDetail, EventKind, EventSeverity, HomeEvent } from '../types';

const SEVERITY_MAP: Record<string, EventSeverity> = {
  PELIGROSO: 'critical',
  SOSPECHOSO: 'warning',
  NORMAL: 'info',
};

const KIND_MAP: Record<string, EventKind> = {
  KNOWN_PERSON: 'recognized_person',
  UNKNOWN_PERSON: 'unknown_person',
};

/** Íconos para los códigos que no representan a una persona (kind === 'device'). */
const CODE_ICON_MAP: Record<string, string> = {
  WEAPON: 'pistol',
};

const CODE_LABEL_MAP: Record<string, string> = {
  KNOWN_PERSON: 'Persona reconocida',
  UNKNOWN_PERSON: 'Persona desconocida',
  WEAPON: 'Arma detectada',
};

const VERDICT_LABEL_MAP: Record<string, string> = {
  STOP_DANGER: 'Peligro confirmado',
  STOP_SAFE: 'Sin riesgo',
  CONTINUE: 'Sin conclusión',
};

const SEVERITY_LABEL_MAP: Record<string, string> = {
  PELIGROSO: 'Peligroso',
  SOSPECHOSO: 'Sospechoso',
  NORMAL: 'Normal',
};

/** Texto del banner de estado del detalle, según el código del evento. */
const CODE_STATUS_MAP: Record<string, { title: string; description: string }> = {
  KNOWN_PERSON: {
    title: 'Persona reconocida',
    description: 'Coincide con uno de tus contactos registrados.',
  },
  UNKNOWN_PERSON: {
    title: 'Persona desconocida',
    description: 'No coincide con ninguno de tus contactos.',
  },
  WEAPON: {
    title: 'Arma detectada',
    description: 'Se detectó un arma en la captura del timbre.',
  },
};

const pad = (value: number) => String(value).padStart(2, '0');

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** 'Hoy' | 'Ayer' | 'dd/mm' */
const formatDate = (date: Date, now = new Date()): string => {
  if (isSameDay(date, now)) return 'Hoy';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return 'Ayer';

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
};

const formatTime = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

/**
 * El trackId es el identificador del evento en el backend. Se deja un fallback
 * compuesto (código + instante de creación, único por evento) por si algún
 * evento viejo todavía viene sin él.
 */
export const buildEventId = (event: DeviceEvent) =>
  event.trackId ?? `${event.code}-${event.createdAt}`;

export const mapDeviceEvent = (event: DeviceEvent): HomeEvent => {
  // createdAt viene sin offset de zona horaria, así que se interpreta como hora local.
  const createdAt = new Date(event.createdAt);
  const kind = KIND_MAP[event.code] ?? 'device';

  return {
    id: buildEventId(event),
    title: event.title,
    severity: SEVERITY_MAP[event.finalSeverity] ?? 'info',
    kind,
    time: formatTime(createdAt),
    date: formatDate(createdAt),
    icon: kind === 'device' ? CODE_ICON_MAP[event.code] : undefined,
    code: event.code,
    createdAt: event.createdAt,
    trackId: event.trackId,
  };
};

export const mapDeviceEventDetail = (event: DeviceEventDetail): EventDetail => {
  const createdAt = new Date(event.createdAt);
  const status = CODE_STATUS_MAP[event.code];

  return {
    trackId: event.trackId,
    title: event.title,
    severity: SEVERITY_MAP[event.finalSeverity] ?? 'info',
    kind: KIND_MAP[event.code] ?? 'device',
    code: event.code,
    codeLabel: CODE_LABEL_MAP[event.code] ?? event.code,
    verdictLabel: VERDICT_LABEL_MAP[event.finalVerdict] ?? event.finalVerdict,
    severityLabel: SEVERITY_LABEL_MAP[event.finalSeverity] ?? event.finalSeverity,
    statusTitle: status?.title ?? event.title,
    // Sin texto propio para el código se cae al título del evento como resumen.
    statusDescription: status?.description ?? '',
    time: formatTime(createdAt),
    date: formatDate(createdAt),
    imageUrl: event.imageUrl,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
};

/** Mapea y ordena del más reciente al más antiguo (la API no garantiza orden). */
export const mapDeviceEvents = (events: DeviceEvent[]): HomeEvent[] =>
  events
    .map(mapDeviceEvent)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
