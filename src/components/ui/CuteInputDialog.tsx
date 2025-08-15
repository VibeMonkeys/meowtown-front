import { useState, useEffect } from 'react';
import { Button } from './button';
import { X, Sparkles } from 'lucide-react';

interface CuteInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  placeholder?: string;
  defaultValue?: string;
  multiline?: boolean;
  icon?: string;
}

export function CuteInputDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  placeholder = '',
  defaultValue = '',
  multiline = false,
  icon = '💬'
}: CuteInputDialogProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
    }
  }, [isOpen, defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onConfirm(value.trim());
      setValue('');
    }
  };

  const handleCancel = () => {
    setValue('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={handleCancel}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-md animate-scale-in">
        <div className="card-cute border-0 shadow-2xl bg-gradient-to-br from-white via-pink-50 to-purple-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-4 relative">
            <button
              onClick={handleCancel}
              className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="text-3xl animate-bounce">{icon}</div>
              <h3 className="text-xl font-bold text-white">
                {title}
              </h3>
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse ml-auto" />
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {multiline ? (
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full p-4 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100 resize-none text-gray-700 placeholder-gray-400 transition-all duration-300"
                rows={4}
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full p-4 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100 text-gray-700 placeholder-gray-400 transition-all duration-300"
                autoFocus
              />
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={handleCancel}
                className="flex-1 btn-cute bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={!value.trim()}
                className="flex-1 btn-cute btn-cute-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                확인 ✨
              </Button>
            </div>
          </form>

          {/* Decorative elements */}
          <div className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full blur-xl" />
          <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-xl" />
        </div>
      </div>
    </div>
  );
}