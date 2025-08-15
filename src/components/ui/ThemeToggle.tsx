import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './button';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <Button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        relative 
        overflow-hidden 
        transition-all 
        duration-500 
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 shadow-lg shadow-purple-500/25' 
          : 'bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg shadow-orange-500/25'
        }
        hover:scale-110 
        active:scale-95
        border-0
        ${className}
      `}
      aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {/* 배경 애니메이션 효과 */}
      <div className={`
        absolute inset-0 
        transition-all 
        duration-500 
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-sky-400 to-blue-500'
        }
      `} />
      
      {/* 아이콘 컨테이너 */}
      <div className="relative z-10 flex items-center justify-center">
        {theme === 'dark' ? (
          <div className="relative">
            <Moon className={`${iconSizes[size]} text-yellow-200 drop-shadow-lg`} />
            {/* 달 주변 별들 */}
            <div className="absolute -top-1 -right-1 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-0.5 h-0.5 bg-yellow-200 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-0 left-1 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        ) : (
          <div className="relative">
            <Sun className={`${iconSizes[size]} text-white drop-shadow-lg animate-spin`} style={{ animationDuration: '8s' }} />
            {/* 태양 광선 효과 */}
            <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-30 animate-ping"></div>
            <div className="absolute inset-1 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
          </div>
        )}
      </div>
      
      {/* 호버 시 나타나는 이모지 효과 */}
      <div className={`
        absolute 
        inset-0 
        flex 
        items-center 
        justify-center 
        opacity-0 
        hover:opacity-100 
        transition-opacity 
        duration-300
        text-xs
        ${theme === 'dark' ? 'text-blue-200' : 'text-orange-200'}
      `}>
        {theme === 'dark' ? '🌙' : '☀️'}
      </div>
      
      {/* 클릭 시 파티클 효과를 위한 숨겨진 요소들 */}
      <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full opacity-0 transition-all duration-300 group-active:opacity-100 group-active:animate-ping"></div>
      <div className="absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full opacity-0 transition-all duration-300 group-active:opacity-100 group-active:animate-ping" style={{ animationDelay: '0.1s' }}></div>
    </Button>
  );
}