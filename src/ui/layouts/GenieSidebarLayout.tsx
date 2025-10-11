import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/ui/utils/cn';
import { Navbar } from '@/ui/components/Navbar';
import {
  ChartBarIcon,
  Cog6ToothIcon,
  PlayIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Avatar, AvatarFallback } from '@/ui/components/ui/avatar';

interface GenieSidebarLayoutProps {
  children: ReactNode;
  className?: string;
}


const navigation = [
  { name: 'Dashboard', href: '/genie', icon: ChartBarIcon },
  { name: 'Analytics', href: '/genie/analytics', icon: ChartBarIcon },
  { name: 'Playground', href: '/genie/playground', icon: PlayIcon },
  { name: 'Lead Track', href: '/genie/leads', icon: UserGroupIcon },
  { name: 'Chat Logs', href: '/genie/chatlogs', icon: ChatBubbleLeftRightIcon },
  { name: 'Train Genie', href: '/genie/train', icon: AcademicCapIcon },
  { name: 'Scripts', href: '/genie/scripts', icon: DocumentTextIcon },
  { name: 'Settings', href: '/genie/settings', icon: Cog6ToothIcon },
];

const leadSubNavigation = [
  { name: 'All', href: '/genie/leads' },
  { name: 'Mail', href: '/genie/leads/mail' },
  { name: 'WhatsApp', href: '/genie/leads/whatsapp' },
  { name: 'Instagram', href: '/genie/leads/instagram' },
];




function UsageComponent() {
  return (
    <>
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
              className=" bg-emerald-600  h-3 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden" 
              style={{ width: '85%' }}
            >
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
  </>
  );
}



function GenieSidebar() {
  const location = useLocation();

  const isCurrentPath = (path: string) => {
    if (path === '/genie') {
      return location.pathname === '/genie';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed inset-y-0 z-50 flex w-64 flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-white to-emerald-50 px-6 shadow-xl border-r border-emerald-100">
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center border-b border-emerald-100">
          <Link to="/genie" className="flex items-center gap-3 px-3 py-3" aria-label="Genie home">
            <Avatar size="md" className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800">
              <AvatarFallback className="text-white font-semibold">G</AvatarFallback>
            </Avatar>
            <span className="text-base font-semibold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              Genie
            </span>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    {item.name === 'Lead Track' ? (
                      <div>
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
                                ? 'text-emerald-700'
                                : 'text-gray-400 group-hover:text-emerald-700',
                              'h-6 w-6 shrink-0'
                            )}
                          />
                          {item.name}
                        </Link>
                        {isCurrentPath('/genie/leads') && (
                          <ul className="ml-6 mt-2 space-y-1">
                            {leadSubNavigation.map((subItem) => (
                              <li key={subItem.name}>
                                <Link
                                  to={subItem.href}
                                  className={cn(
                                    location.pathname === subItem.href
                                      ? 'text-emerald-800 font-semibold bg-emerald-100 border-l-2 border-emerald-500'
                                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50',
                                    'block px-3 py-2 text-xs rounded-lg transition-all duration-200 hover:shadow-sm'
                                  )}
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
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
                              ? 'text-emerald-700'
                              : 'text-gray-400 group-hover:text-emerald-700',
                            'h-6 w-6 shrink-0'
                          )}
                        />
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          
          {/* Usage Component */}
          <UsageComponent />
        </nav>
      </div>
    </div>
  );
}

export function GenieSidebarLayout({ children, className }: GenieSidebarLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {/* Navbar */}
      <Navbar />
      
      <div className="flex">
        {/* Genie Sidebar */}
        <GenieSidebar />
        
        {/* Main content */}
        <div className="pl-64 flex-1">
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
