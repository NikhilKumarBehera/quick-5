/**
 * Application Constants
 * Central repository for all hardcoded values and magic strings
 */

export const APP_CONFIG = {
  appName: 'BrainBoost',
  version: '1.0.0',
  timeout: 30000,
  retryAttempts: 3,
} as const;

export const ROUTES = {
  ROOT: '/',
  SPLASH: '/splash',
  HOME: '/home',
  CHALLENGE: '/challenge',
  RESULTS: '/results',
  ACHIEVEMENTS: '/achievements',
  GAMES: '/games',
  ACCURACY_STATS: '/accuracy-stats',
} as const;

export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  USER_STATISTICS: 'user_statistics',
  USER_ACHIEVEMENTS: 'user_achievements',
  CHALLENGE_HISTORY: 'challenge_history',
  CATEGORY_PROGRESS: 'category_progress',
  APP_SETTINGS: 'app_settings',
  LAST_SESSION: 'last_session',
} as const;

export const ANIMATION_CONFIG = {
  slideUpDuration: 300,
  slideUpTiming: 'cubic-bezier(0.4, 0, 0.2, 1)',
  fadeDuration: 200,
  navTransitionDuration: 350,
} as const;

export const GAME_CONFIG = {
  DAILY_CHALLENGES: 5,
  CHALLENGE_TIME_LIMIT: 30,
  MIN_QUESTIONS_PER_SESSION: 5,
  MAX_QUESTIONS_PER_SESSION: 20,
  XP_PER_CORRECT_ANSWER: 10,
  XP_PER_STREAK: 50,
  STREAK_RESET_DAYS: 1,
} as const;

export const DIFFICULTY_MULTIPLIERS = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
  expert: 3.0,
} as const;

export const PUZZLE_CATEGORIES = {
  MATH: {
    label: 'Math',
    icon: '🧮',
    color: 'primary',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  CODE_CRACKER: {
    label: 'Code Cracker',
    icon: '🔐',
    color: 'secondary',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  LOGIC: {
    label: 'Logic',
    icon: '🎯',
    color: 'tertiary',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  RIDDLE: {
    label: 'Riddle',
    icon: '💡',
    color: 'warning',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  WORD: {
    label: 'Word',
    icon: '📚',
    color: 'success',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  },
  PATTERN: {
    label: 'Pattern',
    icon: '🔮',
    color: 'danger',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
} as const;

export const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;
