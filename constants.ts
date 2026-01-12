
import { EventType, HolidayDefinition } from './types';

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const FIXED_HOLIDAYS: HolidayDefinition[] = [
  // --- NACIONAIS E ESTADUAIS ---
  { day: 1, month: 0, name: 'Confraternização Universal', type: EventType.NATIONAL_HOLIDAY, description: 'Início do ano civil.' },
  { day: 25, month: 0, name: 'Aniversário de São Paulo', type: EventType.STATE_HOLIDAY, description: 'Feriado estadual (Data Magna da Capital).' },
  { day: 21, month: 3, name: 'Tiradentes', type: EventType.NATIONAL_HOLIDAY, description: 'Homenagem ao mártir da Inconfidência Mineira.' },
  { day: 1, month: 4, name: 'Dia do Trabalhador', type: EventType.NATIONAL_HOLIDAY, description: 'Celebração das conquistas trabalhistas.' },
  { day: 9, month: 6, name: 'Revolução Constitucionalista', type: EventType.STATE_HOLIDAY, description: 'Homenagem ao movimento de 1932 em SP.' },
  { day: 7, month: 8, name: 'Independência do Brasil', type: EventType.NATIONAL_HOLIDAY, description: 'Celebração da soberania nacional.' },
  { day: 12, month: 9, name: 'Nossa Senhora Aparecida', type: EventType.NATIONAL_HOLIDAY, description: 'Padroeira do Brasil e Dia das Crianças.' },
  { day: 2, month: 10, name: 'Finados', type: EventType.NATIONAL_HOLIDAY, description: 'Dia de memória aos entes falecidos.' },
  { day: 15, month: 10, name: 'Proclamação da República', type: EventType.NATIONAL_HOLIDAY, description: 'Aniversário do regime republicano no Brasil.' },
  { day: 20, month: 10, name: 'Consciência Negra', type: EventType.NATIONAL_HOLIDAY, description: 'Homenagem a Zumbi dos Palmares e cultura negra.' },
  { day: 25, month: 11, name: 'Natal', type: EventType.NATIONAL_HOLIDAY, description: 'Celebração cristã do nascimento de Jesus.' },

  // --- REGIÃO METROPOLITANA DE CAMPINAS (RMC) ---
  // Janeiro
  { day: 20, month: 0, name: 'São Sebastião (Valinhos)', type: EventType.MUNICIPAL_HOLIDAY, description: 'Padroeiro de Valinhos e abertura da Festa do Figo.' },
  
  // Fevereiro
  { day: 2, month: 1, name: 'N. Sra. da Candelária (Indaiatuba)', type: EventType.MUNICIPAL_HOLIDAY, description: 'Padroeira da cidade de Indaiatuba.' },
  { day: 15, month: 1, name: 'Aniversário de Indaiatuba', type: EventType.MUNICIPAL_HOLIDAY, description: 'Fundação de Indaiatuba.' },
  { day: 28, month: 1, name: 'Aniversário de Paulínia', type: EventType.MUNICIPAL_HOLIDAY, description: 'Emancipação de Paulínia.' },

  // Março
  { day: 31, month: 2, name: 'Aniversário de Hortolândia', type: EventType.MUNICIPAL_HOLIDAY, description: 'Emancipação de Hortolândia.' },

  // Abril
  { day: 2, month: 3, name: 'Aniversário de Vinhedo', type: EventType.MUNICIPAL_HOLIDAY, description: 'Fundação da cidade de Vinhedo.' },
  { day: 10, month: 3, name: 'Aniversário de Artur Nogueira', type: EventType.MUNICIPAL_HOLIDAY, description: 'Fundação de Artur Nogueira.' },

  // Maio
  { day: 19, month: 4, name: 'Aniversário de Hortolândia', type: EventType.MUNICIPAL_HOLIDAY, description: 'Data da fundação da cidade.' },
  { day: 28, month: 4, name: 'Aniversário de Valinhos', type: EventType.MUNICIPAL_HOLIDAY, description: 'Data oficial da fundação de Valinhos.' },

  // Junho
  { day: 13, month: 5, name: 'Santo Antônio (Americana)', type: EventType.MUNICIPAL_HOLIDAY, description: 'Padroeiro de Americana.' },

  // Julho
  { day: 14, month: 6, name: 'Aniversário de Campinas', type: EventType.MUNICIPAL_HOLIDAY, description: 'Fundação da cidade de Campinas (1774).' },
  { day: 26, month: 6, name: 'Aniversário de Sumaré', type: EventType.MUNICIPAL_HOLIDAY, description: 'Fundação da cidade de Sumaré.' },

  // Setembro
  { day: 12, month: 8, name: 'Aniversário de Jaguariúna', type: EventType.MUNICIPAL_HOLIDAY, description: 'Fundação de Jaguariúna.' },

  // Outubro
  { day: 3, month: 9, name: 'Emancipação de Holambra', type: EventType.MUNICIPAL_HOLIDAY, description: 'Data histórica de Holambra (Cidade das Flores).' },

  // Novembro
  { day: 1, month: 10, name: 'Aniversário de Itatiba', type: EventType.MUNICIPAL_HOLIDAY, description: 'Fundação da cidade de Itatiba.' },

  // Dezembro
  { day: 4, month: 11, name: 'Santa Bárbara (S.B.O)', type: EventType.MUNICIPAL_HOLIDAY, description: 'Padroeira de Santa Bárbara d\'Oeste.' },
  { day: 8, month: 11, name: 'Nossa Senhora da Conceição', type: EventType.MUNICIPAL_HOLIDAY, description: 'Padroeira de Campinas.' },
];
