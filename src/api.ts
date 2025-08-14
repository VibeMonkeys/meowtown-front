// 백엔드 API 클라이언트
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// 디버깅용 로그
console.log('🐱 Environment:', process.env.NODE_ENV);
console.log('🐱 REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('🐱 Final API_BASE_URL:', API_BASE_URL);

export interface Cat {
  id: string;
  name: string;
  image?: string;
  location: string;
  lastSeen: string;
  description: string;
  characteristics: string[];
  reportedBy: {
    name: string;
    avatar?: string;
  };
  likes: number;
  isLiked: boolean;
  comments: number;
  isNeutered: boolean;
  estimatedAge: string;
  gender: 'male' | 'female' | 'unknown';
  lat: number;
  lng: number;
  reportCount: number;
}

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
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  displayName: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  user: AuthUser;
}

export interface CommunityPost {
  id: string;
  type: 'sighting' | 'help' | 'update';
  author: string;
  content: string;
  catName: string;
  location: string;
  likes: number;
  comments: number;
  time: string;
  isLiked: boolean;
  isOwner: boolean;
}

export interface CommunityComment {
  id: string;
  postId: string;
  author: string;
  content: string;
  time: string;
  isOwner: boolean;
  parentId?: string; // 대댓글인 경우 부모 댓글 ID
  replies?: CommunityComment[]; // 해당 댓글의 대댓글들
}

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      console.log(`API 요청: ${options?.method || 'GET'} ${API_BASE_URL}${endpoint}`);
      if (options?.body) {
        console.log('요청 바디:', options.body);
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      console.log(`응답 상태: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error('에러 응답 JSON:', errorData);
        } catch {
          const errorText = await response.text();
          console.error('에러 응답 텍스트:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        // 백엔드의 에러 응답 형식에 맞춰 처리
        if (errorData?.error?.details) {
          const errorMessages = errorData.error.details.map((d: any) => d.message).join('\n');
          throw new Error(`유효성 검사 오류:\n${errorMessages}`);
        } else if (errorData?.error?.message) {
          throw new Error(errorData.error.message);
        } else {
          throw new Error(`서버 오류 (${response.status}): ${JSON.stringify(errorData)}`);
        }
      }

      const data = await response.json();
      console.log('응답 데이터:', data);
      return data;
    } catch (error: any) {
      console.error('API request failed:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        endpoint: `${API_BASE_URL}${endpoint}`,
        method: options?.method || 'GET'
      });
      throw error;
    }
  }

  // 고양이 목록 조회
  async getCats(params?: { page?: number; size?: number }): Promise<ApiResponse<Cat[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    
    const endpoint = `/cats${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await this.request<any[]>(endpoint);
    
    // imageBase64를 image로 변환
    if (response.success && response.data) {
      response.data = response.data.map((cat: any) => ({
        ...cat,
        image: cat.imageBase64 || cat.image
      }));
    }
    
    return response as ApiResponse<Cat[]>;
  }

  // 고양이 등록
  async createCat(catData: CatRegistrationForm): Promise<ApiResponse<Cat>> {
    const response = await this.request<any>('/cats', {
      method: 'POST',
      body: JSON.stringify(catData),
    });
    
    // imageBase64를 image로 변환
    if (response.success && response.data) {
      response.data = {
        ...response.data,
        image: response.data.imageBase64 || response.data.image
      };
    }
    
    return response as ApiResponse<Cat>;
  }

  // 고양이 검색
  async searchCats(query: string): Promise<ApiResponse<Cat[]>> {
    const response = await this.request<any[]>(`/cats/search?query=${encodeURIComponent(query)}`);
    
    // imageBase64를 image로 변환
    if (response.success && response.data) {
      response.data = response.data.map((cat: any) => ({
        ...cat,
        image: cat.imageBase64 || cat.image
      }));
    }
    
    return response as ApiResponse<Cat[]>;
  }
  
  // 고양이 이름 검색 (단순화된 버전)
  async searchCatsByName(name: string): Promise<ApiResponse<Cat[]>> {
    const response = await this.request<any[]>(`/cats?name=${encodeURIComponent(name)}&size=50`);
    
    // imageBase64를 image로 변환
    if (response.success && response.data) {
      response.data = response.data.map((cat: any) => ({
        ...cat,
        image: cat.imageBase64 || cat.image
      }));
    }
    
    return response as ApiResponse<Cat[]>;
  }

  // 주변 고양이 검색
  async getNearbyeCats(params: { lat: number; lng: number; radius: number }): Promise<ApiResponse<Cat[]>> {
    const searchParams = new URLSearchParams({
      lat: params.lat.toString(),
      lng: params.lng.toString(),
      radius: params.radius.toString(),
    });
    const response = await this.request<any[]>(`/cats/nearby?${searchParams.toString()}`);
    
    // imageBase64를 image로 변환
    if (response.success && response.data) {
      response.data = response.data.map((cat: any) => ({
        ...cat,
        image: cat.imageBase64 || cat.image
      }));
    }
    
    return response as ApiResponse<Cat[]>;
  }

  // 고양이 좋아요 토글
  async toggleCatLike(catId: string): Promise<ApiResponse<{ catId: string; isLiked: boolean; likeCount: number }>> {
    return this.request<{ catId: string; isLiked: boolean; likeCount: number }>(`/cats/${catId}/like`, {
      method: 'POST',
    });
  }

  // 회원가입
  async register(userData: {
    userId: string;
    password: string;
    email: string;
    displayName: string;
  }): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // 로그인
  async login(credentials: {
    userId: string;
    password: string;
  }): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // 로그아웃
  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  // 인증 상태 확인
  async checkAuth(): Promise<ApiResponse<string>> {
    return this.request<string>('/auth/check');
  }

  // === 커뮤니티 API ===

  // 커뮤니티 게시글 목록 조회
  async getCommunityPosts(params?: { size?: number }): Promise<ApiResponse<CommunityPost[]>> {
    const searchParams = new URLSearchParams();
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    
    const endpoint = `/community/posts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<CommunityPost[]>(endpoint);
  }

  // 커뮤니티 게시글 상세 조회
  async getCommunityPost(postId: string): Promise<ApiResponse<CommunityPost>> {
    return this.request<CommunityPost>(`/community/posts/${postId}`);
  }

  // 커뮤니티 게시글 작성
  async createCommunityPost(postData: {
    type: 'sighting' | 'help' | 'update';
    content: string;
    catName: string;
    location: string;
    author?: string;
  }): Promise<ApiResponse<CommunityPost>> {
    return this.request<CommunityPost>('/community/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  // 게시글 좋아요 토글
  async togglePostLike(postId: string): Promise<ApiResponse<{ isLiked: boolean; likes: number }>> {
    return this.request<{ isLiked: boolean; likes: number }>(`/community/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  // 게시글 댓글 목록 조회
  async getPostComments(postId: string): Promise<ApiResponse<CommunityComment[]>> {
    return this.request<CommunityComment[]>(`/community/posts/${postId}/comments`);
  }

  // 댓글 작성
  async createComment(postId: string, commentData: {
    content: string;
    author?: string;
    parentId?: string;
  }): Promise<ApiResponse<CommunityComment>> {
    return this.request<CommunityComment>(`/community/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }
}

export const apiClient = new ApiClient();