
import { EventType, HolidayDefinition } from './types';

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const FIXED_HOLIDAYS: HolidayDefinition[] = [
  { day: 1, month: 0, name: 'Confraternização Universal', type: EventType.NATIONAL_HOLIDAY, description: 'Ano Novo.' },
  { day: 25, month: 0, name: 'Aniversário de São Paulo', type: EventType.STATE_HOLIDAY, description: 'Feriado estadual (Data Magna da Capital).' },
  { day: 21, month: 3, name: 'Tiradentes', type: EventType.NATIONAL_HOLIDAY, description: 'Homenagem a Joaquim José da Silva Xavier.' },
  { day: 1, month: 4, name: 'Dia do Trabalhador', type: EventType.NATIONAL_HOLIDAY, description: 'Dia Internacional do Trabalho.' },
  { day: 12, month: 5, name: 'Dia dos Namorados', type: EventType.CULTURAL_DATE, description: 'Celebração do amor e troca de presentes.' },
  { day: 9, month: 6, name: 'Revolução Constitucionalista', type: EventType.STATE_HOLIDAY, description: 'Movimento armado ocorrido em 1932.' },
  { day: 14, month: 6, name: 'Aniversário de Campinas', type: EventType.MUNICIPAL_HOLIDAY, description: 'Fundação da cidade de Campinas (1774).' },
  { day: 7, month: 8, name: 'Independência do Brasil', type: EventType.NATIONAL_HOLIDAY, description: 'Grito do Ipiranga.' },
  { day: 12, month: 9, name: 'Nossa Senhora Aparecida / Dia das Crianças', type: EventType.NATIONAL_HOLIDAY, description: 'Padroeira do Brasil.' },
  { day: 15, month: 9, name: 'Dia do Professor', type: EventType.CULTURAL_DATE, description: 'Homenagem aos educadores.' },
  { day: 28, month: 9, name: 'Dia do Servidor Público', type: EventType.OPTIONAL_POINT, description: 'Ponto facultativo para funcionalismo.' },
  { day: 2, month: 10, name: 'Finados', type: EventType.NATIONAL_HOLIDAY, description: 'Dia de memória aos mortos.' },
  { day: 15, month: 10, name: 'Proclamação da República', type: EventType.NATIONAL_HOLIDAY, description: 'Fim do período imperial.' },
  { day: 20, month: 10, name: 'Consciência Negra', type: EventType.NATIONAL_HOLIDAY, description: 'Homenagem a Zumbi dos Palmares.' },
  { day: 8, month: 11, name: 'Nossa Senhora da Conceição', type: EventType.MUNICIPAL_HOLIDAY, description: 'Padroeira de Campinas.' },
  { day: 24, month: 11, name: 'Véspera de Natal', type: EventType.OPTIONAL_POINT, description: 'Preparativos para o Natal.' },
  { day: 25, month: 11, name: 'Natal', type: EventType.NATIONAL_HOLIDAY, description: 'Nascimento de Jesus Cristo.' },
  { day: 31, month: 11, name: 'Véspera de Ano Novo', type: EventType.OPTIONAL_POINT, description: 'Celebração de encerramento do ano.' },
];
