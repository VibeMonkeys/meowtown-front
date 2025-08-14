import { useState } from 'react';
import { Button } from './ui/button';
import { Plus, Heart, MessageSquare, Camera, Sparkles } from 'lucide-react';

interface FloatingActionsProps {
  onAddCat?: () => void;
  onQuickLike?: () => void;
  onQuickMessage?: () => void;
}

export function FloatingActions({ onAddCat, onQuickLike, onQuickMessage }: FloatingActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Plus,
      label: '냥이 등록',
      onClick: onAddCat,
      color: 'from-pink-400 to-purple-500',
      emoji: '🐱'
    },
    {
      icon: Heart,
      label: '좋아요',
      onClick: onQuickLike,
      color: 'from-red-400 to-pink-500',
      emoji: '💕'
    },
    {
      icon: MessageSquare,
      label: '메시지',
      onClick: onQuickMessage,
      color: 'from-blue-400 to-purple-500',
      emoji: '💬'
    },
    {
      icon: Camera,
      label: '사진',
      onClick: () => {},
      color: 'from-green-400 to-blue-500',
      emoji: '📸'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      <div className={`flex flex-col gap-3 mb-4 transition-all duration-300 transform ${
        isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-75 pointer-events-none'
      }`}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              onClick={action.onClick}
              className={`relative w-14 h-14 rounded-full bg-gradient-to-r ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className="w-6 h-6" />
              
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
        className={`relative w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 ${
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