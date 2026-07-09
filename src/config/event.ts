export interface Venue {
  city: string
  date: string
  dateShort: string
  month: string
  day: string
  venue: string
  time: string
  region: string
  /** ISO 8601 con offset de Lima (UTC-5) — usado por el countdown */
  targetDate: string
}

export interface EventConfig {
  edition: string
  name: string
  tagline: string
  description: string
  venues: Venue[]
}

export const eventConfig: EventConfig = {
  edition: 'XXII Jornada Académica',
  name: 'EduTech360',

  tagline: 'PedagogIA que Transforma',
  description:
    'Espacio de innovación pedagógica para docentes universitarios comprometidos con transformar la educación superior en el Perú.',
  venues: [
    {
      city: 'Juliaca',
      date: '20 de julio de 2026',
      dateShort: '20 Jul',
      month: 'Jul',
      day: '20',
      venue: 'Auditorio Fernando Stahl',
      time: '7:30 a.m.',
      region: 'Altiplano',
      targetDate: '2026-07-20T07:30:00-05:00',
    },
    {
      city: 'Lima',
      date: '22 de julio de 2026',
      dateShort: '22 Jul',
      month: 'Jul',
      day: '22',
      venue: 'Auditorio Alva & Alva',
      time: '7:30 a.m.',
      region: 'Costa',
      targetDate: '2026-07-22T07:30:00-05:00',
    },
    {
      city: 'Tarapoto',
      date: '24 de julio de 2026',
      dateShort: '24 Jul',
      month: 'Jul',
      day: '24',
      venue: 'Auditorio de la Fe',
      time: '7:30 a.m.',
      region: 'Selva',
      targetDate: '2026-07-24T07:30:00-05:00',
    },
  ],
}
