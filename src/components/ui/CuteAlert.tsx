import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';

interface CuteAlertProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number; // auto-close after duration (ms)
  showCloseButton?: boolean;
}

export function CuteAlert({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  duration,
  showCloseButton = true
}: CuteAlertProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      if (duration) {
        const timer = setTimeout(() => {
          onClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!shouldRender) return null;

  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return {
          emoji: '😸',
          icon: CheckCircle,
          bgGradient: 'from-green-50 to-emerald-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
          titleColor: 'text-green-700',
          messageColor: 'text-green-600'
        };
      case 'error':
        return {
          emoji: '😿',
          icon: AlertCircle,
          bgGradient: 'from-red-50 to-pink-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-500',
          titleColor: 'text-red-700',
          messageColor: 'text-red-600'
        };
      case 'warning':
        return {
          emoji: '🙀',
          icon: AlertTriangle,
          bgGradient: 'from-yellow-50 to-orange-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
          titleColor: 'text-yellow-700',
          messageColor: 'text-yellow-600'
        };
      default: // info
        return {
          emoji: '😺',
          icon: Info,
          bgGradient: 'from-blue-50 to-purple-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-500',
          titleColor: 'text-blue-700',
          messageColor: 'text-blue-600'
        };
    }
  };

  const config = getAlertConfig();
  const IconComponent = config.icon;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/20 backdrop-blur-sm",
        "transition-all duration-300",
        isOpen ? "opacity-100" : "opacity-0"
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "relative max-w-md w-full mx-auto",
          "bg-gradient-to-br", config.bgGradient,
          "border-2", config.borderColor,
          "rounded-2xl shadow-2xl",
          "p-6 space-y-4",
          "transform transition-all duration-300",
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Cat Emoji */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-12 bg-white rounded-full border-2 border-pink-200 flex items-center justify-center shadow-lg">
            <span className="text-2xl animate-bounce">{config.emoji}</span>
          </div>
        </div>

        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Content */}
        <div className="pt-6 text-center space-y-3">
          {/* Icon */}
          <div className="flex justify-center">
            <IconComponent className={cn("w-8 h-8", config.iconColor)} />
          </div>

          {/* Title */}
          {title && (
            <h3 className={cn("text-lg font-bold", config.titleColor)}>
              {title}
            </h3>
          )}

          {/* Message */}
          <p className={cn("text-sm leading-relaxed", config.messageColor)}>
            {message}
          </p>

          {/* Action Button */}
          <div className="pt-4">
            <Button
              onClick={onClose}
              className={cn(
                "btn-cute w-full font-semibold",
                type === 'success' && "bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600",
                type === 'error' && "bg-gradient-to-r from-red-400 to-pink-500 text-white hover:from-red-500 hover:to-pink-600",
                type === 'warning' && "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600",
                type === 'info' && "bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600"
              )}
            >
              확인 🐾
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-2 left-2 text-pink-300 text-sm animate-pulse">💕</div>
        <div className="absolute bottom-2 right-2 text-purple-300 text-sm animate-pulse">✨</div>
      </div>
    </div>,
    document.body
  );
}

// Hook for easy usage
export function useCuteAlert() {
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number;
  }>({
    isOpen: false,
    type: 'info',
    message: ''
  });

  const showAlert = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    title?: string,
    duration?: number
  ) => {
    setAlertState({
      isOpen: true,
      type,
      title,
      message,
      duration
    });
  };

  const hideAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  };

  // Convenience methods
  const showSuccess = (message: string, title?: string, duration?: number) => 
    showAlert(message, 'success', title, duration);
  
  const showError = (message: string, title?: string, duration?: number) => 
    showAlert(message, 'error', title, duration);
  
  const showWarning = (message: string, title?: string, duration?: number) => 
    showAlert(message, 'warning', title, duration);
  
  const showInfo = (message: string, title?: string, duration?: number) => 
    showAlert(message, 'info', title, duration);

  return {
    alertProps: {
      ...alertState,
      onClose: hideAlert
    },
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideAlert
  };
}

// Toast-style notification for less intrusive alerts
interface CuteToastProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export function CuteToast({
  isOpen,
  onClose,
  type = 'info',
  message,
  duration = 3000
}: CuteToastProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!shouldRender) return null;

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          emoji: '😸',
          bgGradient: 'from-green-400 to-emerald-500',
          textColor: 'text-white'
        };
      case 'error':
        return {
          emoji: '😿',
          bgGradient: 'from-red-400 to-pink-500',
          textColor: 'text-white'
        };
      case 'warning':
        return {
          emoji: '🙀',
          bgGradient: 'from-yellow-400 to-orange-500',
          textColor: 'text-white'
        };
      default:
        return {
          emoji: '😺',
          bgGradient: 'from-blue-400 to-purple-500',
          textColor: 'text-white'
        };
    }
  };

  const config = getToastConfig();

  return createPortal(
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-sm",
        "transform transition-all duration-300",
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div
        className={cn(
          "bg-gradient-to-r", config.bgGradient,
          "rounded-xl shadow-lg border-2 border-white/20",
          "p-4 pr-12",
          "backdrop-blur-sm"
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg animate-bounce">{config.emoji}</span>
          <p className={cn("text-sm font-medium", config.textColor)}>
            {message}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
          aria-label="닫기"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body
  );
}