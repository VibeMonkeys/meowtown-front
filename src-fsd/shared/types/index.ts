// Core Domain Types
export interface Cat {
  id: string;
  name: string;
  image: string;
  location: string;
  lastSeen: string;
  description: string;
  characteristics: string[];
  reportedBy: {
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  isNeutered: boolean;
  estimatedAge: string;
  gender: 'male' | 'female' | 'unknown';
  lat: number;
  lng: number;
  reportCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  joinedAt: string;
}

export interface Sighting {
  id: string;
  catId: string;
  reporterId: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  sightingTime: string;
  description: string;
  image?: string;
  isVerified: boolean;
}

export interface CommunityPost {
  id: string;
  type: 'sighting' | 'help' | 'update';
  author: string;
  time: string;
  content: string;
  catName?: string;
  location?: string;
  likes: number;
  comments: number;
  images?: string[];
}

export interface Stats {
  totalCats: number;
  newCatsThisWeek: number;
  activeCaregivers: number;
  neutralizedCats: number;
  totalSightings: number;
  photosUploaded: number;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

// Form Types
export interface CatRegistrationForm {
  name: string;
  location: string;
  description: string;
  characteristics: string[];
  isNeutered: boolean;
  estimatedAge: string;
  gender: 'male' | 'female' | 'unknown';
  coordinates: {
    lat: number;
    lng: number;
  };
  images: File[];
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Search Types
export interface SearchFilters {
  location?: string;
  gender?: 'male' | 'female' | 'unknown';
  isNeutered?: boolean;
  characteristics?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface MapViewOptions {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  selectedCatId?: string;
}

// Event Types
export type CatEvent = 
  | { type: 'cat-liked'; catId: string }
  | { type: 'cat-commented'; catId: string; comment: string }
  | { type: 'cat-shared'; catId: string }
  | { type: 'cat-selected'; catId: string }
  | { type: 'cat-registered'; cat: Cat };

export type ViewChangeEvent = {
  type: 'view-changed';
  view: 'home' | 'guide' | 'map' | 'community' | 'profile';
};