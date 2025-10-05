import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/ui/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
}

const inputVariants = {
  default: 'border border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  filled: 'bg-gray-100 border-0 focus:bg-white focus:ring-blue-500',
  outlined: 'border-2 border-gray-300 focus:border-blue-500 focus:ring-0',
};

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">{leftIcon}</div>
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'block w-full rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : inputVariants[variant],
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">{rightIcon}</div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
