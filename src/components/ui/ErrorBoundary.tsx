import React, { Component, ReactNode } from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="card-cute border-2 border-red-200 max-w-md mx-auto my-8">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="text-4xl mb-2">😿</div>
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                앗, 문제가 발생했어요!
              </h3>
              <p className="text-red-500 text-sm mb-4">
                예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-red-50 p-3 rounded border text-xs text-red-700 mb-4">
                  <summary className="cursor-pointer font-medium">에러 상세</summary>
                  <pre className="mt-2 whitespace-pre-wrap">{this.state.error.stack}</pre>
                </details>
              )}
            </div>
            <div className="space-y-3">
              <Button 
                onClick={this.handleRetry}
                className="btn-cute btn-cute-primary w-full"
                aria-label="페이지 다시 시도"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                다시 시도
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
                aria-label="페이지 새로고침"
              >
                페이지 새로고침
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// 함수형 컴포넌트용 에러 처리 훅
export function useErrorHandler() {
  const handleError = (error: Error, errorInfo?: { componentStack: string }) => {
    console.error('Application Error:', error);
    if (errorInfo) {
      console.error('Component Stack:', errorInfo.componentStack);
    }
    
    // 에러 리포팅 서비스에 전송 (예: Sentry)
    // reportError(error, errorInfo);
  };

  return handleError;
}

// 네트워크 에러 처리를 위한 컴포넌트
interface NetworkErrorProps {
  error: Error;
  onRetry?: () => void;
  className?: string;
}

export function NetworkError({ error, onRetry, className }: NetworkErrorProps) {
  const isNetworkError = error.message.includes('fetch') || error.message.includes('network');
  
  return (
    <Card className={`card-cute border-2 border-orange-200 ${className}`}>
      <CardContent className="p-6 text-center">
        <div className="text-4xl mb-3">
          {isNetworkError ? '📡' : '⚠️'}
        </div>
        <h3 className="text-lg font-semibold text-orange-600 mb-2">
          {isNetworkError ? '네트워크 연결 문제' : '처리 중 오류 발생'}
        </h3>
        <p className="text-orange-500 text-sm mb-4">
          {isNetworkError 
            ? '인터넷 연결을 확인하고 다시 시도해주세요.'
            : '요청을 처리하는 중 문제가 발생했습니다.'
          }
        </p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="btn-cute bg-orange-100 text-orange-700 hover:bg-orange-200"
            aria-label="다시 시도하기"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// 로딩 상태를 위한 스켈레톤 컴포넌트
export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg h-48 mb-4"></div>
      <div className="space-y-3">
        <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded h-4 w-3/4"></div>
        <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded h-3 w-1/2"></div>
        <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded h-3 w-2/3"></div>
      </div>
    </div>
  );
}