import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, AuthUser, LoginResponse } from '../api';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (credentials: { userId: string; password: string }) => Promise<boolean>;
  register: (userData: {
    userId: string;
    password: string;
    email: string;
    displayName: string;
  }) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !!user && !!token;

  // 앱 시작 시 localStorage에서 토큰 복원
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 인증 상태 초기화 중...');
      
      const savedToken = localStorage.getItem('authToken');
      if (savedToken) {
        console.log('💾 저장된 토큰 발견:', savedToken.substring(0, 20) + '...');
        setToken(savedToken);
        
        try {
          // 토큰 유효성 검증
          const response = await apiClient.checkAuth();
          if (response.success) {
            console.log('✅ 토큰이 유효합니다 - 로그인 상태 복원');
            
            // 토큰에서 사용자 정보 추출 (간단한 방법)
            const payload = JSON.parse(atob(savedToken.split('.')[1]));
            const userData: AuthUser = {
              userId: payload.sub,
              email: payload.sub + '@example.com',
              displayName: 'User ' + payload.sub
            };
            setUser(userData);
          } else {
            console.warn('❌ 토큰이 만료되었습니다 - 로그아웃 처리');
            logout();
          }
        } catch (error) {
          console.error('❌ 토큰 검증 실패:', error);
          logout();
        }
      } else {
        console.log('📭 저장된 토큰이 없습니다');
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: { userId: string; password: string }): Promise<boolean> => {
    try {
      console.log('🔐 로그인 시도:', credentials.userId);
      const response = await apiClient.login(credentials);
      
      if (response.success && response.data) {
        console.log('✅ 로그인 성공');
        setToken(response.data.token);
        setUser(response.data.user);
        return true;
      } else {
        console.error('❌ 로그인 실패:', response.message);
        return false;
      }
    } catch (error: any) {
      console.error('❌ 로그인 오류:', error.message);
      return false;
    }
  };

  const register = async (userData: {
    userId: string;
    password: string;
    email: string;
    displayName: string;
  }): Promise<boolean> => {
    try {
      console.log('📝 회원가입 시도:', userData.userId);
      const response = await apiClient.register(userData);
      
      if (response.success && response.data) {
        console.log('✅ 회원가입 성공');
        setToken(response.data.token);
        setUser(response.data.user);
        return true;
      } else {
        console.error('❌ 회원가입 실패:', response.message);
        return false;
      }
    } catch (error: any) {
      console.error('❌ 회원가입 오류:', error.message);
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 로그아웃 처리');
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    if (!token) return false;
    
    try {
      const response = await apiClient.checkAuth();
      return response.success;
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isLoggedIn,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}