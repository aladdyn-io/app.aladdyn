import { useState, useRef, useEffect, type ReactNode } from 'react';
import { cn } from '@/ui/utils/cn';

interface DropdownItem {
  label: string;
  value: string;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  className?: string;
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, items, className, align = 'right' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
            align === 'left' ? 'left-0' : 'right-0',
            className
          )}
        >
          {items.map((item, index) => (
            <div key={index}>
              {item.divider ? (
                <div className="border-t border-gray-100 my-1" />
              ) : (
                <button
                  className={cn(
                    'block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors',
                    item.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick?.();
                      setIsOpen(false);
                    }
                  }}
                  disabled={item.disabled}
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
