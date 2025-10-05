import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/ui/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
}

const cardVariants = {
  default: 'bg-white border border-gray-200',
  outlined: 'bg-white border-2 border-gray-300',
  elevated: 'bg-white shadow-lg border border-gray-100',
};

export function Card({ children, variant = 'default', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg p-6',
        cardVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-gray-600', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}
