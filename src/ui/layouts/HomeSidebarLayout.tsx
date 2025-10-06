import type { ReactNode } from 'react';
import { Sidebar } from '@/ui/components/Sidebar';
import { Navbar } from '@/ui/components/Navbar';

interface HomeSidebarLayoutProps {
  children: ReactNode;
  className?: string;
}

export function HomeSidebarLayout({ children, className = '' }: HomeSidebarLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Navbar */}
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <div className="lg:pl-64 flex-1">
          {/* Page content */}
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
