import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  InformationCircleIcon,
  Cog6ToothIcon,
  UserIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BellIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { cn } from '@/ui/utils/cn';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

const navigation: SidebarItem[] = [
  { name: 'Dashboard', href: '/home', icon: HomeIcon },
  { name: 'Analytics', href: '/home/analytics', icon: ChartBarIcon },
  { name: 'Documents', href: '/home/documents', icon: DocumentTextIcon },
  { name: 'Notifications', href: '/home/notifications', icon: BellIcon },
  { name: 'Profile', href: '/home/profile', icon: UserIcon },
  { name: 'Settings', href: '/home/settings', icon: Cog6ToothIcon },
  { name: 'About', href: '/home/about', icon: InformationCircleIcon },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isCurrentPath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn('lg:hidden', sidebarOpen ? 'fixed inset-0 z-50' : 'hidden')}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={cn('hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0', className)}>
        <SidebarContent />
      </div>
    </>
  );

  function SidebarContent() {
    return (
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-white to-emerald-50 px-6 pb-4 shadow-xl border-r border-emerald-100">
        <div className="flex h-16 shrink-0 items-center border-b border-emerald-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-emerald-200 ring-opacity-50">
              <img src="/gene.png" alt="Aladdyn" className="w-12 h-12 object-contain drop-shadow-sm" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 bg-clip-text text-transparent">Aladdyn</span>
              <div className="text-xs text-emerald-600 font-medium">Home Workspace</div>
            </div>
          </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        isCurrentPath(item.href)
                          ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 shadow-sm'
                          : 'text-gray-700 hover:text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100',
                        'group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium transition-all duration-200 hover:shadow-sm'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isCurrentPath(item.href)
                            ? 'text-emerald-700 drop-shadow-sm'
                            : 'text-gray-400 group-hover:text-emerald-600',
                          'h-6 w-6 shrink-0 transition-colors duration-200'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* Usage Component */}
            <div className="px-0 py-6 border-t border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100 -mx-6">
              <div className="px-6 space-y-4">
                {/* Plan Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-emerald-800">Pro Plan</span>
                  </div>
                  <div className="px-2 py-1 bg-emerald-200 text-emerald-800 text-xs font-medium rounded-full">
                    Active
                  </div>
                </div>
                
                {/* Usage Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-medium">Monthly Usage</span>
                    <span className="text-emerald-700 font-bold">8,500 / 10,000</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-white rounded-full h-3 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 h-3 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden" 
                        style={{ width: '85%' }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span className="font-medium">85%</span>
                      <span>10K</span>
                    </div>
                  </div>
                </div>
                
                {/* Upgrade Button */}
                <button className="group w-full bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center space-x-2">
                    <span>Upgrade to Premium</span>
                  </span>
                </button>
                
                {/* Additional Info */}
                <div className="text-center">
                  <p className="text-xs text-gray-600">
                    1,500 requests remaining this month
                  </p>
                </div>
              </div>
            </div>
          </ul>
        </nav>
      </div>
    );
  }
}

// Mobile menu button
export function SidebarToggle() {
  return (
    <button
      type="button"
      className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
    >
      <span className="sr-only">Open sidebar</span>
      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
    </button>
  );
}
