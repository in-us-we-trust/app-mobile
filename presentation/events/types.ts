export type EventSeverity = 'critical' | 'warning' | 'info';

/**
 * unknown_person   -> alguien no reconocido en cámara/timbre
 * recognized_person -> coincidió con un contacto (ver presentation/contacts)
 * device            -> evento del propio sistema (batería, sensor, armado, etc.)
 */
export type EventKind = 'unknown_person' | 'recognized_person' | 'device';

export interface HomeEvent {
  id: string;
  title: string;
  severity: EventSeverity;
  kind: EventKind;
  time: string;
  date: string;
  description?: string;
  zone?: string;
  /** solo aplica si kind === 'recognized_person' */
  personName?: string;
  /** override de ícono para kind === 'device' (default: alert genérico) */
  icon?: string;
  /** muestra el punto rojo de "sin ver" en la fila */
  isNew?: boolean;
  /** código original del backend (KNOWN_PERSON, WEAPON, etc.) */
  code?: string;
  /** UUID del track en el backend; es lo que hay que mandar para pedir el detalle */
  trackId: string;
  /** timestamp ISO original, para ordenar y para el detalle */
  createdAt: string;
}

/**
 * Detalle de un evento (GET /me/device/events/{trackId}). Es una estructura
 * propia y no una extensión de HomeEvent: la fila del listado y la pantalla de
 * detalle muestran cosas distintas.
 */
export interface EventDetail {
  trackId: string;
  title: string;
  severity: EventSeverity;
  kind: EventKind;
  /** código original del backend (KNOWN_PERSON, WEAPON, etc.) */
  code: string;
  /** etiqueta legible del código, para la fila "Tipo de evento" */
  codeLabel: string;
  /** etiqueta legible del finalVerdict */
  verdictLabel: string;
  /** etiqueta legible del finalSeverity */
  severityLabel: string;
  /** texto explicativo del banner de estado */
  statusTitle: string;
  statusDescription: string;
  time: string;
  date: string;
  /** captura del timbre; null si el evento no tiene imagen */
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
