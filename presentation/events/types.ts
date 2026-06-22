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
}
