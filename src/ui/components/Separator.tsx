import { cn } from '@/ui/utils/cn';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Separator({ 
  orientation = 'horizontal', 
  className 
}: SeparatorProps) {
  return (
    <div
      className={cn(
        'shrink-0 bg-gray-200',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
    />
  );
}