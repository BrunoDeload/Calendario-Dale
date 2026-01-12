
export enum EventType {
  NATIONAL_HOLIDAY = 'NATIONAL_HOLIDAY',
  STATE_HOLIDAY = 'STATE_HOLIDAY',
  MUNICIPAL_HOLIDAY = 'MUNICIPAL_HOLIDAY',
  CULTURAL_DATE = 'CULTURAL_DATE',
  OPTIONAL_POINT = 'OPTIONAL_POINT',
  CUSTOM_EVENT = 'CUSTOM_EVENT'
}

export interface CalendarEvent {
  id: string;
  name: string;
  description: string;
  date: Date;
  type: EventType;
}

export interface HolidayDefinition {
  day: number;
  month: number;
  name: string;
  type: EventType;
  description: string;
}

export interface CustomEvent {
  id: string;
  name: string;
  month: number;
  day: number;
  description: string;
}
