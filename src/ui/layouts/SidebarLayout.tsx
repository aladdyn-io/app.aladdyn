import type { ReactNode } from 'react';
import { Sidebar, SidebarToggle } from '@/ui/components/Sidebar';

interface SidebarLayoutProps {
  children: ReactNode;
  className?: string;
}

export function SidebarLayout({ children, className }: SidebarLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <SidebarToggle />
          
          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" />
          
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-lg font-semibold text-gray-900">
                Web App V2
              </h1>
            </div>
            
            {/* Right side navigation */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Profile dropdown */}
              <div className="flex items-center gap-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">U</span>
                </div>
                <span className="hidden lg:block text-sm font-medium text-gray-700">
                  User Profile
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className || ''}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
