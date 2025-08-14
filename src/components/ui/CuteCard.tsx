import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from './card';
import { cn } from './utils';

interface CuteCardProps extends React.ComponentProps<typeof Card> {
  cuteVariant?: 'default' | 'flat' | 'elevated' | 'interactive';
  cuteSize?: 'sm' | 'md' | 'lg';
  cuteBorder?: 'none' | 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export function CuteCard({ 
  cuteVariant = 'default', 
  cuteSize = 'md',
  cuteBorder = 'none',
  className,
  children,
  ...props 
}: CuteCardProps) {
  const cuteClasses = cn(
    'card-cute',
    cuteVariant !== 'default' && `card-cute-${cuteVariant}`,
    `card-cute-${cuteSize}`,
    cuteBorder !== 'none' && cuteBorder === 'default' 
      ? 'card-cute-bordered' 
      : cuteBorder !== 'none' && `card-cute-${cuteBorder}-border`,
    className
  );

  return (
    <Card className={cuteClasses} {...props}>
      {children}
    </Card>
  );
}

// Pre-configured card variants for common use cases
export const InteractiveCard = ({ children, onClick, ...props }: Omit<CuteCardProps, 'cuteVariant'> & { onClick?: () => void }) => (
  <CuteCard 
    cuteVariant="interactive" 
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    } : undefined}
    {...props}
  >
    {children}
  </CuteCard>
);

export const ElevatedCard = ({ children, ...props }: Omit<CuteCardProps, 'cuteVariant'>) => (
  <CuteCard cuteVariant="elevated" {...props}>{children}</CuteCard>
);

export const FlatCard = ({ children, ...props }: Omit<CuteCardProps, 'cuteVariant'>) => (
  <CuteCard cuteVariant="flat" {...props}>{children}</CuteCard>
);

export const InfoCard = ({ children, ...props }: Omit<CuteCardProps, 'cuteBorder'>) => (
  <CuteCard cuteBorder="primary" {...props}>{children}</CuteCard>
);

export const SuccessCard = ({ children, ...props }: Omit<CuteCardProps, 'cuteBorder'>) => (
  <CuteCard cuteBorder="success" {...props}>{children}</CuteCard>
);

export const WarningCard = ({ children, ...props }: Omit<CuteCardProps, 'cuteBorder'>) => (
  <CuteCard cuteBorder="warning" {...props}>{children}</CuteCard>
);

export const DangerCard = ({ children, ...props }: Omit<CuteCardProps, 'cuteBorder'>) => (
  <CuteCard cuteBorder="danger" {...props}>{children}</CuteCard>
);

// Compact card for small content areas
export const CompactCard = ({ children, ...props }: Omit<CuteCardProps, 'cuteSize'>) => (
  <CuteCard cuteSize="sm" {...props}>{children}</CuteCard>
);

// Large hero card for main content
export const HeroCard = ({ children, ...props }: Omit<CuteCardProps, 'cuteSize' | 'cuteVariant'>) => (
  <CuteCard cuteSize="lg" cuteVariant="elevated" {...props}>{children}</CuteCard>
);

// Card with consistent content spacing
export const ContentCard = ({ title, children, footer, ...props }: CuteCardProps & {
  title?: React.ReactNode;
  footer?: React.ReactNode;
}) => (
  <CuteCard {...props}>
    {title && (
      <CardHeader className="pb-4">
        {typeof title === 'string' ? (
          <h3 className="text-lg font-semibold text-pink-600">{title}</h3>
        ) : (
          title
        )}
      </CardHeader>
    )}
    <CardContent className={title ? "pt-0" : undefined}>
      {children}
    </CardContent>
    {footer && (
      <CardFooter className="pt-4">
        {footer}
      </CardFooter>
    )}
  </CuteCard>
);