import { ReactNode } from 'react';
import { Button } from './button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon = '🐱',
  title,
  description,
  actionLabel,
  onAction,
  children,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      <div className="text-6xl mb-4 animate-bounce">{icon}</div>
      <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="btn-cute btn-cute-primary"
        >
          {actionLabel}
        </Button>
      )}
      {children}
    </div>
  );
}