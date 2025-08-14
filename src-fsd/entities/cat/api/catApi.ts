import { apiClient, withRetry } from '../../../shared/api/base';
import type { Cat, ApiResponse, PaginatedResponse, SearchFilters } from '../../../shared/types';

export const catApi = {
  // 고양이 목록 조회
  getCats: async (params?: {
    page?: number;
    size?: number;
    filters?: SearchFilters;
  }): Promise<ApiResponse<PaginatedResponse<Cat>>> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.size) searchParams.append('size', params.size.toString());
    if (params?.filters?.location) searchParams.append('location', params.filters.location);
    if (params?.filters?.gender) searchParams.append('gender', params.filters.gender);
    if (params?.filters?.isNeutered !== undefined) {
      searchParams.append('isNeutered', params.filters.isNeutered.toString());
    }
    if (params?.filters?.characteristics?.length) {
      params.filters.characteristics.forEach(char => 
        searchParams.append('characteristics', char)
      );
    }

    const endpoint = `/cats${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return withRetry(() => apiClient.get<PaginatedResponse<Cat>>(endpoint));
  },

  // 고양이 상세 조회
  getCat: async (catId: string): Promise<ApiResponse<Cat>> => {
    return withRetry(() => apiClient.get<Cat>(`/cats/${catId}`));
  },

  // 고양이 등록
  createCat: async (catData: {
    name: string;
    location: string;
    description: string;
    characteristics: string[];
    isNeutered: boolean;
    estimatedAge: string;
    gender: 'male' | 'female' | 'unknown';
    coordinates: { lat: number; lng: number };
  }): Promise<ApiResponse<Cat>> => {
    return withRetry(() => apiClient.post<Cat>('/cats', catData));
  },

  // 고양이 정보 수정
  updateCat: async (catId: string, catData: Partial<Cat>): Promise<ApiResponse<Cat>> => {
    return withRetry(() => apiClient.put<Cat>(`/cats/${catId}`, catData));
  },

  // 고양이 삭제
  deleteCat: async (catId: string): Promise<ApiResponse<void>> => {
    return withRetry(() => apiClient.delete<void>(`/cats/${catId}`));
  },

  // 고양이 좋아요
  likeCat: async (catId: string): Promise<ApiResponse<{ likes: number }>> => {
    return withRetry(() => apiClient.post<{ likes: number }>(`/cats/${catId}/like`));
  },

  // 고양이 좋아요 취소
  unlikeCat: async (catId: string): Promise<ApiResponse<{ likes: number }>> => {
    return withRetry(() => apiClient.delete<{ likes: number }>(`/cats/${catId}/like`));
  },

  // 주변 고양이 검색
  getNearbyeCats: async (params: {
    lat: number;
    lng: number;
    radius: number; // 미터 단위
    limit?: number;
  }): Promise<ApiResponse<Cat[]>> => {
    const searchParams = new URLSearchParams({
      lat: params.lat.toString(),
      lng: params.lng.toString(),
      radius: params.radius.toString(),
      ...(params.limit && { limit: params.limit.toString() })
    });

    return withRetry(() => apiClient.get<Cat[]>(`/cats/nearby?${searchParams.toString()}`));
  },

  // 고양이 이미지 업로드
  uploadCatImages: async (catId: string, files: File[]): Promise<ApiResponse<string[]>> => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    return withRetry(() => apiClient.uploadFile<string[]>(`/cats/${catId}/images`, formData));
  },

  // 고양이 검색
  searchCats: async (query: string): Promise<ApiResponse<Cat[]>> => {
    const searchParams = new URLSearchParams({ q: query });
    return withRetry(() => apiClient.get<Cat[]>(`/cats/search?${searchParams.toString()}`));
  }
};