export type EventSeverity = 'critical' | 'warning' | 'info';

export interface HomeEvent {
  id: string;
  title: string;
  severity: EventSeverity;
  time: string;
  date: string;
  description?: string;
  zone?: string;
}
