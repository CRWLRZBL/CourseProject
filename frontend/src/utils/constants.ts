// Базовые настройки приложения
export const APP_CONFIG = {
  NAME: 'AutoSalon LADA',
  VERSION: '1.0.0',
  DESCRIPTION: 'Официальный дилер автомобилей LADA',
  API_BASE_URL: process.env.REACT_APP_API_URL || 'https://localhost:7038/api',
  DEFAULT_LANGUAGE: 'ru-RU',
  CURRENCY: 'RUB',
} as const;

// Статусы автомобилей
export const CAR_STATUS = {
  AVAILABLE: 'Available',
  RESERVED: 'Reserved',
  SOLD: 'Sold',
} as const;

export const CAR_STATUS_LABELS: Record<string, string> = {
  [CAR_STATUS.AVAILABLE]: 'В наличии',
  [CAR_STATUS.RESERVED]: 'Забронирован',
  [CAR_STATUS.SOLD]: 'Продан',
} as const;

export const CAR_STATUS_VARIANTS: Record<string, string> = {
  [CAR_STATUS.AVAILABLE]: 'success',
  [CAR_STATUS.RESERVED]: 'warning',
  [CAR_STATUS.SOLD]: 'danger',
} as const;

// Статусы заказов
export const ORDER_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  IN_PRODUCTION: 'InProduction',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  [ORDER_STATUS.PENDING]: 'Ожидает подтверждения',
  [ORDER_STATUS.CONFIRMED]: 'Подтвержден',
  [ORDER_STATUS.IN_PRODUCTION]: 'В производстве',
  [ORDER_STATUS.COMPLETED]: 'Завершен',
  [ORDER_STATUS.CANCELLED]: 'Отменен',
} as const;

export const ORDER_STATUS_VARIANTS: Record<string, string> = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.CONFIRMED]: 'info',
  [ORDER_STATUS.IN_PRODUCTION]: 'primary',
  [ORDER_STATUS.COMPLETED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'danger',
} as const;

// Роли пользователей
export const USER_ROLES = {
  CLIENT: 'Client',
  MANAGER: 'Manager',
  ADMIN: 'Admin',
} as const;

// Типы кузовов
export const BODY_TYPES = {
  SEDAN: 'Sedan',
  HATCHBACK: 'Hatchback',
  SUV: 'SUV',
  STATION_WAGON: 'StationWagon',
  COUPE: 'Coupe',
  CONVERTIBLE: 'Convertible',
} as const;

export const BODY_TYPE_LABELS: Record<string, string> = {
  [BODY_TYPES.SEDAN]: 'Седан',
  [BODY_TYPES.HATCHBACK]: 'Хэтчбек',
  [BODY_TYPES.SUV]: 'Внедорожник',
  [BODY_TYPES.STATION_WAGON]: 'Универсал',
  [BODY_TYPES.COUPE]: 'Купе',
  [BODY_TYPES.CONVERTIBLE]: 'Кабриолет',
} as const;

// Типы топлива
export const FUEL_TYPES = {
  PETROL: 'Petrol',
  DIESEL: 'Diesel',
  ELECTRIC: 'Electric',
  HYBRID: 'Hybrid',
} as const;

export const FUEL_TYPE_LABELS: Record<string, string> = {
  [FUEL_TYPES.PETROL]: 'Бензин',
  [FUEL_TYPES.DIESEL]: 'Дизель',
  [FUEL_TYPES.ELECTRIC]: 'Электрический',
  [FUEL_TYPES.HYBRID]: 'Гибрид',
} as const;

// Категории дополнительных опций
export const OPTION_CATEGORIES = {
  COMFORT: 'Comfort',
  SAFETY: 'Safety',
  EXTERIOR: 'Exterior',
  INTERIOR: 'Interior',
  MULTIMEDIA: 'Multimedia',
} as const;

export const OPTION_CATEGORY_LABELS: Record<string, string> = {
  [OPTION_CATEGORIES.COMFORT]: 'Комфорт',
  [OPTION_CATEGORIES.SAFETY]: 'Безопасность',
  [OPTION_CATEGORIES.EXTERIOR]: 'Экстерьер',
  [OPTION_CATEGORIES.INTERIOR]: 'Интерьер',
  [OPTION_CATEGORIES.MULTIMEDIA]: 'Мультимедиа',
} as const;

// Цены по умолчанию для фильтров
export const PRICE_RANGES = {
  MIN: 0,
  MAX: 5000000,
  STEP: 100000,
  DEFAULT_MIN: 500000,
  DEFAULT_MAX: 3000000,
} as const;

// Настройки пагинации
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZES: [12, 24, 48],
} as const;

// Локализация и форматирование
export const FORMAT_CONFIG = {
  DATE: {
    LOCALE: 'ru-RU',
    OPTIONS: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    } as Intl.DateTimeFormatOptions,
  },
  CURRENCY: {
    LOCALE: 'ru-RU',
    OPTIONS: {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    } as Intl.NumberFormatOptions,
  },
  NUMBER: {
    LOCALE: 'ru-RU',
    OPTIONS: {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    } as Intl.NumberFormatOptions,
  },
} as const;

// Сообщения об ошибках
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка соединения. Проверьте подключение к интернету.',
  SERVER_ERROR: 'Ошибка сервера. Попробуйте позже.',
  UNAUTHORIZED: 'Необходима авторизация.',
  FORBIDDEN: 'Доступ запрещен.',
  NOT_FOUND: 'Ресурс не найден.',
  VALIDATION_ERROR: 'Ошибка валидации данных.',
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка.',
  
  // Специфичные ошибки
  CAR_NOT_AVAILABLE: 'Автомобиль недоступен для заказа.',
  ORDER_CREATION_FAILED: 'Не удалось создать заказ.',
  USER_EXISTS: 'Пользователь с таким email уже существует.',
  INVALID_CREDENTIALS: 'Неверный email или пароль.',
} as const;

// Сообщения об успехе
export const SUCCESS_MESSAGES = {
  ORDER_CREATED: 'Заказ успешно создан!',
  ORDER_UPDATED: 'Заказ успешно обновлен!',
  USER_REGISTERED: 'Пользователь успешно зарегистрирован!',
  LOGIN_SUCCESS: 'Вход выполнен успешно!',
} as const;

// Ключи localStorage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  CURRENT_USER: 'currentUser',
  CART_ITEMS: 'cartItems',
  THEME_PREFERENCE: 'themePreference',
  LANGUAGE: 'language',
} as const;

// Настройки API
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Пути маршрутизации
export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  ORDER: '/order',
  PROFILE: '/profile',
  ADMIN: '/admin',
  LOGIN: '/profile',
  REGISTER: '/register',
} as const;

// Мета-данные для SEO
export const META_DATA = {
  TITLE: 'AutoSalon LADA - Официальный дилер',
  DESCRIPTION: 'Купить новый автомобиль LADA. Официальный дилер, лучшие цены, гарантия от производителя.',
  KEYWORDS: 'LADA, автомобили, купить авто, новый автомобиль, автосалон, Веста, Гранта, Нива',
} as const;

// Популярные модели для главной страницы
export const POPULAR_MODELS = [
  {
    id: 4,
    name: 'LADA Vesta Седан',
    price: 1239900,
    image: '/images/cars/4.jpg',
    type: 'Sedan' as const,
  },
  {
    id: 1,
    name: 'LADA Granta Седан',
    price: 749900,
    image: '/images/cars/1.jpg',
    type: 'Sedan' as const,
  },
  {
    id: 9,
    name: 'LADA Niva Travel',
    price: 1314000,
    image: '/images/cars/9.jpg',
    type: 'SUV' as const,
  },
] as const;

// Особенности/преимущества для главной страницы
export const FEATURES = [
  {
    icon: '🚗',
    title: 'Широкий выбор',
    description: 'Большой каталог новых автомобилей LADA с различными комплектациями'
  },
  {
    icon: '⚙️',
    title: 'Онлайн-конфигуратор',
    description: 'Соберите автомобиль своей мечты с помощью удобного конфигуратора'
  },
  {
    icon: '💰',
    title: 'Лучшие цены',
    description: 'Прямые поставки от производителя гарантируют выгодные условия'
  },
  {
    icon: '📦',
    title: 'Быстрое оформление',
    description: 'Весь процесс заказа от выбора до оформления занимает несколько минут'
  }
] as const;

// Контактная информация
export const CONTACT_INFO = {
  PHONE: '+7 (800) 555-35-35',
  EMAIL: 'info@lada-autosalon.ru',
  ADDRESS: 'г. Москва, Ленинградский проспект, д. 64',
  WORKING_HOURS: 'Ежедневно с 9:00 до 21:00',
} as const;

// Социальные сети
export const SOCIAL_LINKS = [
  { name: 'VK', icon: '📘', url: 'https://vk.com/lada' },
  { name: 'Telegram', icon: '📢', url: 'https://t.me/lada_official' },
  { name: 'YouTube', icon: '📺', url: 'https://youtube.com/lada' },
] as const;

// Утилитарные функции
export const utils = {
  // Форматирование цены
  formatPrice: (price: number): string => {
    return new Intl.NumberFormat(
      FORMAT_CONFIG.CURRENCY.LOCALE, 
      FORMAT_CONFIG.CURRENCY.OPTIONS
    ).format(price);
  },

  // Форматирование даты
  formatDate: (date: string | Date): string => {
    return new Intl.DateTimeFormat(
      FORMAT_CONFIG.DATE.LOCALE, 
      FORMAT_CONFIG.DATE.OPTIONS
    ).format(new Date(date));
  },

  // Получение текста статуса
  getStatusLabel: (status: string, type: 'car' | 'order' = 'car'): string => {
    if (type === 'car') {
      return CAR_STATUS_LABELS[status] || status;
    }
    return ORDER_STATUS_LABELS[status] || status;
  },

  // Получение варианта Bootstrap для статуса
  getStatusVariant: (status: string, type: 'car' | 'order' = 'car'): string => {
    if (type === 'car') {
      return CAR_STATUS_VARIANTS[status] || 'secondary';
    }
    return ORDER_STATUS_VARIANTS[status] || 'secondary';
  },
} as const;

export default {
  APP_CONFIG,
  CAR_STATUS,
  ORDER_STATUS,
  USER_ROLES,
  BODY_TYPES,
  FUEL_TYPES,
  OPTION_CATEGORIES,
  PRICE_RANGES,
  PAGINATION,
  FORMAT_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  API_CONFIG,
  ROUTES,
  META_DATA,
  POPULAR_MODELS,
  FEATURES,
  CONTACT_INFO,
  SOCIAL_LINKS,
  utils,
};