import type { Event, EventCategory, EventStatus } from '../types/event'

export const eventStatusLabels: Record<EventStatus, string> = {
  registration_open: 'Идёт регистрация',
  few_places: 'Мало мест',
  registration_closed: 'Регистрация закрыта',
}

export const eventCategoryLabels: Record<EventCategory, string> = {
  education: 'Образование',
  technology: 'Технологии',
  culture: 'Культура',
  career: 'Карьера',
}

export const events: Event[] = [
  {
    id: 'event-1',
    title: 'От идеи до первого React-проекта',
    description:
      'Практический воркшоп о структуре интерфейса, компонентах и типизации данных.',
    startDate: '2026-10-03T10:00:00+03:00',
    endDate: '2026-10-03T13:00:00+03:00',
    rating: 4.5,
    location: 'Корпус A, аудитория 204',
    category: 'education',
    status: 'registration_open',
  },
  {
    id: 'event-2',
    title: 'Студенческий IT Meetup',
    description:
      'Встреча с молодыми разработчиками, короткие доклады и обсуждение первых шагов в профессии.',
    startDate: '2026-10-08T18:30:00+03:00',
    endDate: '2026-10-08T21:00:00+03:00',
    location: 'Медиатека, большой зал',
    category: 'technology',
    status: 'few_places',
    rating: 4.8,
  },
  {
    id: 'event-3',
    title: 'Выставка студенческих проектов',
    description:
      'Открытая выставка учебных и творческих работ с короткими презентациями авторов.',
    startDate: '2026-10-15T12:00:00+03:00',
    endDate: '2026-10-15T17:00:00+03:00',
    location: 'Главный холл университета',
    category: 'culture',
    status: 'registration_open',
    rating: 4.1,
  },
  {
    id: 'event-4',
    title: 'Карьерный день: резюме и собеседование',
    description:
      'Разбор резюме, тренировочные интервью и личные консультации с приглашёнными HR-специалистами.',
    startDate: '2026-10-21T09:30:00+03:00',
    endDate: '2026-10-21T15:30:00+03:00',
    location: 'Корпус B, конференц-зал',
    category: 'career',
    status: 'few_places',
    rating: 3.8,
  },
  {
    id: 'event-5',
    title: 'Хакатон «Цифровой кампус»',
    description:
      'Командная работа над сервисами для учёбы и жизни студентов с финальной защитой прототипов.',
    startDate: '2026-10-24T09:00:00+03:00',
    endDate: '2026-10-25T18:00:00+03:00',
    location: 'Инновационный центр, 1 этаж',
    category: 'technology',
    status: 'registration_closed',
    rating: 4.9,
  },
  {
    id: 'event-6',
    title: 'Открытая лекция о кибербезопасности',
    description:
      'Как защищать личные данные, распознавать фишинг и безопасно работать с облачными сервисами.',
    startDate: '2026-10-29T16:00:00+03:00',
    endDate: '2026-10-29T18:00:00+03:00',
    location: 'Онлайн, ссылка после регистрации',
    category: 'education',
    status: 'registration_open',
    rating: 2.3,
  },
]
