// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: {
    lat: 37.5665, // Seoul
    lng: 126.9780
  },
  DEFAULT_ZOOM: 13,
  MIN_ZOOM: 10,
  MAX_ZOOM: 18,
  CLUSTER_RADIUS: 40,
} as const;

// Image Configuration
export const IMAGE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_WIDTH: 800,
  MAX_HEIGHT: 600,
  QUALITY: 0.8,
  ACCEPTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'] as const,
} as const;

// Pagination Configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Form Validation
export const VALIDATION_RULES = {
  CAT_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
  },
  LOCATION: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 100,
  },
  USER_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 30,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
} as const;

// Cat Characteristics
export const CAT_CHARACTERISTICS = [
  '친근함',
  '경계심많음',
  '활발함',
  '차분함',
  '호기심많음',
  '수줍음',
  '장난기많음',
  '독립적',
  '사람좋아함',
  '먹이좋아함',
  '중성화됨',
  '중성화안됨',
  '흰털',
  '검은털',
  '주황털',
  '회색털',
  '줄무늬',
  '얼룩무늬',
  '삼색이',
  '턱시도',
  '시암',
  '치즈',
  '짧은털',
  '긴털',
  '큰고양이',
  '작은고양이',
  '중간크기',
  '새끼고양이',
  '어린고양이',
  '성체',
  '노묘',
] as const;

// Age Options
export const AGE_OPTIONS = [
  '새끼고양이 (0-6개월)',
  '어린고양이 (6개월-2살)',
  '성체 (2-7살)',
  '노묘 (7살 이상)',
  '나이불명',
] as const;

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'male', label: '수컷' },
  { value: 'female', label: '암컷' },
  { value: 'unknown', label: '모름' },
] as const;

// Community Post Types
export const POST_TYPES = [
  { value: 'sighting', label: '목격', color: 'blue' },
  { value: 'help', label: '도움요청', color: 'red' },
  { value: 'update', label: '업데이트', color: 'green' },
] as const;

// Navigation Items
export const NAVIGATION_ITEMS = [
  { id: 'home', label: '홈', path: '/' },
  { id: 'guide', label: '고양이도감', path: '/guide' },
  { id: 'map', label: '지도', path: '/map' },
  { id: 'community', label: '커뮤니티', path: '/community' },
  { id: 'profile', label: '프로필', path: '/profile' },
] as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'meowtown_user_token',
  USER_PREFERENCES: 'meowtown_user_preferences',
  DRAFT_CAT_REGISTRATION: 'meowtown_draft_cat_registration',
  MAP_VIEW_STATE: 'meowtown_map_view_state',
  THEME: 'meowtown_theme',
} as const;

// Event Names
export const EVENTS = {
  CAT_REGISTERED: 'cat:registered',
  CAT_UPDATED: 'cat:updated',
  CAT_LIKED: 'cat:liked',
  CAT_COMMENTED: 'cat:commented',
  USER_LOGGED_IN: 'user:logged_in',
  USER_LOGGED_OUT: 'user:logged_out',
  MAP_VIEW_CHANGED: 'map:view_changed',
  NOTIFICATION_RECEIVED: 'notification:received',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  VALIDATION_ERROR: '입력한 정보를 확인해주세요.',
  FILE_TOO_LARGE: '파일 크기가 너무 큽니다. (최대 5MB)',
  INVALID_FILE_FORMAT: '지원되지 않는 파일 형식입니다.',
  LOCATION_ACCESS_DENIED: '위치 권한이 거부되었습니다.',
  CAMERA_ACCESS_DENIED: '카메라 권한이 거부되었습니다.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CAT_REGISTERED: '고양이가 성공적으로 등록되었습니다.',
  CAT_UPDATED: '고양이 정보가 업데이트되었습니다.',
  PROFILE_UPDATED: '프로필이 업데이트되었습니다.',
  POST_CREATED: '게시글이 작성되었습니다.',
  COMMENT_ADDED: '댓글이 추가되었습니다.',
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;