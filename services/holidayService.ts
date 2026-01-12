
import { FIXED_HOLIDAYS } from '../constants';
import { CalendarEvent, EventType, CustomEvent } from '../types';

export const getEaster = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

const getNthSunday = (year: number, month: number, n: number): Date => {
  const firstDayOfMonth = new Date(year, month, 1);
  const firstSunday = new Date(year, month, 1 + (7 - firstDayOfMonth.getDay()) % 7);
  const nthSunday = new Date(firstSunday);
  nthSunday.setDate(firstSunday.getDate() + (n - 1) * 7);
  return nthSunday;
};

export const getMovableHolidays = (year: number): CalendarEvent[] => {
  const easter = getEaster(year);
  
  const carnival = new Date(easter);
  carnival.setDate(easter.getDate() - 47);

  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);

  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);

  const mothersDay = getNthSunday(year, 4, 2);
  const fathersDay = getNthSunday(year, 7, 2);

  return [
    { id: `carnival-${year}`, name: 'Carnaval', description: 'Ponto facultativo nacional.', date: carnival, type: EventType.OPTIONAL_POINT },
    { id: `goodfriday-${year}`, name: 'Sexta-feira Santa', description: 'Paixão de Cristo.', date: goodFriday, type: EventType.NATIONAL_HOLIDAY },
    { id: `easter-${year}`, name: 'Páscoa', description: 'Ressurreição de Cristo.', date: easter, type: EventType.CULTURAL_DATE },
    { id: `corpus-${year}`, name: 'Corpus Christi', description: 'Celebração cristã.', date: corpusChristi, type: EventType.OPTIONAL_POINT },
    { id: `mothers-${year}`, name: 'Dia das Mães', description: 'Homenagem às mães.', date: mothersDay, type: EventType.CULTURAL_DATE },
    { id: `fathers-${year}`, name: 'Dia dos Pais', description: 'Homenagem aos pais.', date: fathersDay, type: EventType.CULTURAL_DATE }
  ];
};

export const getAllEventsForYear = (year: number, customEvents: CustomEvent[] = []): CalendarEvent[] => {
  const fixed = FIXED_HOLIDAYS.map(h => ({
    id: `${h.name}-${year}`,
    name: h.name,
    description: h.description,
    date: new Date(year, h.month, h.day),
    type: h.type
  }));

  const userDefined = customEvents.map(ce => ({
    id: ce.id,
    name: ce.name,
    description: ce.description,
    date: new Date(year, ce.month, ce.day),
    type: EventType.CUSTOM_EVENT,
    clientName: ce.clientName,
    creatorName: ce.creatorName
  }));

  const movable = getMovableHolidays(year);
  
  return [...fixed, ...movable, ...userDefined].sort((a, b) => a.date.getTime() - b.date.getTime());
};
