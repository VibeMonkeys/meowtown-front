import { useState } from 'react';
import { Button } from './ui/button';
import { Plus, MessageSquare, Sparkles, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface FloatingActionsProps {
  onAddCat?: () => void;
  onQuickMessage?: () => void;
  disabled?: {
    addCat?: boolean;
    quickMessage?: boolean;
  };
}

export function FloatingActions({ onAddCat, onQuickMessage, disabled = {} }: FloatingActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const actions = [
    {
      icon: Plus,
      label: '냥이 등록',
      onClick: onAddCat,
      color: 'from-pink-400 to-purple-500',
      emoji: '🐱',
      disabled: disabled.addCat
    },
    {
      icon: MessageSquare,
      label: '알림',
      onClick: onQuickMessage,
      color: 'from-blue-400 to-purple-500',
      emoji: '🔔',
      disabled: disabled.quickMessage
    },
    {
      icon: theme === 'dark' ? Sun : Moon,
      label: theme === 'dark' ? '라이트 모드' : '다크 모드',
      onClick: toggleTheme,
      color: theme === 'dark' 
        ? 'from-yellow-400 to-orange-500' 
        : 'from-indigo-500 to-purple-600',
      emoji: theme === 'dark' ? '☀️' : '🌙',
      disabled: false
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      <div className={`flex flex-col gap-3 mb-4 transition-all duration-500 transform ${
        isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-75 pointer-events-none'
      }`}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              onClick={action.disabled ? undefined : action.onClick}
              disabled={action.disabled}
              className={`relative w-14 h-14 rounded-full bg-gradient-to-r ${action.color} text-white shadow-lg transition-all duration-300 group ${
                isOpen ? 'animate-slideInFromRight' : ''
              } ${
                action.disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-xl hover:scale-110'
              }`}
              style={{ 
                animationDelay: isOpen ? `${index * 100}ms` : '0ms',
                animationFillMode: 'both'
              }}
            >
              <Icon className={`w-6 h-6 ${
                action.label.includes('모드') ? (theme === 'dark' ? 'animate-spin' : 'animate-pulse') : ''
              }`} 
              style={{
                animationDuration: action.label.includes('모드') ? (theme === 'dark' ? '8s' : '2s') : undefined
              }} />
              
              {/* Tooltip */}
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap flex items-center gap-2">
                  {action.label}
                  <span>{action.emoji}</span>
                </div>
                <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-l-4 border-l-gray-800 border-y-4 border-y-transparent"></div>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Main Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 floating-glow ${
          isOpen ? 'rotate-45' : ''
        }`}
      >
        <Plus className="w-8 h-8" />
        
        {/* Sparkle Effects */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
          <Sparkles className="w-4 h-4 text-yellow-600" />
        </div>
        
        {/* Floating Hearts */}
        {!isOpen && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-2 -left-2 text-pink-300 text-xs animate-bounce" style={{ animationDelay: '0s' }}>💕</div>
            <div className="absolute -bottom-2 -right-2 text-purple-300 text-xs animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
            <div className="absolute -top-1 right-1 text-yellow-300 text-xs animate-bounce" style={{ animationDelay: '1s' }}>🌟</div>
          </div>
        )}
      </Button>
    </div>
  );
}