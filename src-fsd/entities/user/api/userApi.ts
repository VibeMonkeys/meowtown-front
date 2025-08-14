import { apiClient, withRetry } from '../../../shared/api/base';
import type { User, ApiResponse } from '../../../shared/types';

export const userApi = {
  // 사용자 정보 조회
  getUser: async (userId: string): Promise<ApiResponse<User>> => {
    return withRetry(() => apiClient.get<User>(`/users/${userId}`));
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return withRetry(() => apiClient.get<User>('/users/me'));
  },

  // 사용자 정보 수정
  updateUser: async (userId: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    return withRetry(() => apiClient.put<User>(`/users/${userId}`, userData));
  },

  // 프로필 이미지 업로드
  uploadAvatar: async (userId: string, file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    const formData = new FormData();
    formData.append('avatar', file);

    return withRetry(() => apiClient.uploadFile<{ avatarUrl: string }>(`/users/${userId}/avatar`, formData));
  }
};