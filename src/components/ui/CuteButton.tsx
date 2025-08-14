import React from 'react';
import { Button } from './button';
import { cn } from './utils';

interface CuteButtonProps extends React.ComponentProps<typeof Button> {
  cuteVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  cuteSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isIcon?: boolean;
}

export function CuteButton({ 
  cuteVariant = 'primary', 
  cuteSize = 'md', 
  isIcon = false,
  className,
  children,
  ...props 
}: CuteButtonProps) {
  const cuteClasses = cn(
    'btn-cute',
    `btn-cute-${cuteVariant}`,
    `btn-cute-${cuteSize}`,
    isIcon && 'btn-cute-icon',
    className
  );

  return (
    <Button className={cuteClasses} {...props}>
      {children}
    </Button>
  );
}

// Utility functions for common button patterns
export const PrimaryButton = ({ children, ...props }: Omit<CuteButtonProps, 'cuteVariant'>) => (
  <CuteButton cuteVariant="primary" {...props}>{children}</CuteButton>
);

export const SecondaryButton = ({ children, ...props }: Omit<CuteButtonProps, 'cuteVariant'>) => (
  <CuteButton cuteVariant="secondary" {...props}>{children}</CuteButton>
);

export const OutlineButton = ({ children, ...props }: Omit<CuteButtonProps, 'cuteVariant'>) => (
  <CuteButton cuteVariant="outline" {...props}>{children}</CuteButton>
);

export const GhostButton = ({ children, ...props }: Omit<CuteButtonProps, 'cuteVariant'>) => (
  <CuteButton cuteVariant="ghost" {...props}>{children}</CuteButton>
);

export const DangerButton = ({ children, ...props }: Omit<CuteButtonProps, 'cuteVariant'>) => (
  <CuteButton cuteVariant="danger" {...props}>{children}</CuteButton>
);

export const SuccessButton = ({ children, ...props }: Omit<CuteButtonProps, 'cuteVariant'>) => (
  <CuteButton cuteVariant="success" {...props}>{children}</CuteButton>
);

export const IconButton = ({ children, ...props }: Omit<CuteButtonProps, 'isIcon'>) => (
  <CuteButton isIcon {...props}>{children}</CuteButton>
);

// Large action button for main CTAs
export const ActionButton = ({ children, ...props }: Omit<CuteButtonProps, 'cuteSize' | 'cuteVariant'>) => (
  <CuteButton cuteVariant="primary" cuteSize="lg" {...props}>{children}</CuteButton>
);

// Small compact button for lists/cards
export const CompactButton = ({ children, ...props }: Omit<CuteButtonProps, 'cuteSize'>) => (
  <CuteButton cuteSize="sm" {...props}>{children}</CuteButton>
);