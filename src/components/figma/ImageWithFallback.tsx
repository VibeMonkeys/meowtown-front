import React, { useState } from 'react'

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    setDidError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleRetry = () => {
    setDidError(false)
    setIsLoading(true)
    props.onRetry?.()
  }

  const { src, alt, style, className, fallbackText, showRetry, onRetry, ...rest } = props

  if (didError) {
    return (
      <div
        className={`inline-block bg-gradient-to-br from-pink-100 to-purple-100 text-center align-middle ${className ?? ''}`}
        style={style}
        role="img"
        aria-label={alt || '이미지 로딩 실패'}
      >
        <div className="flex flex-col items-center justify-center w-full h-full text-pink-400 p-4">
          <div className="text-4xl mb-2">🐱</div>
          <div className="text-sm font-medium mb-2">
            {fallbackText || '이미지를 불러올 수 없어요'}
          </div>
          {showRetry && onRetry && (
            <button
              onClick={handleRetry}
              className="text-xs bg-pink-200 hover:bg-pink-300 text-pink-700 px-3 py-1 rounded-full transition-colors"
              aria-label="이미지 다시 불러오기"
            >
              다시 시도
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className ?? ''}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
          <div className="text-pink-400">
            <div className="text-4xl mb-2 animate-bounce">🐱</div>
            <div className="text-sm font-medium">로딩 중...</div>
          </div>
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${className ?? ''}`} 
        style={isLoading ? {} : style}
        onError={handleError}
        onLoad={handleLoad}
        {...rest} 
      />
    </div>
  )
}
