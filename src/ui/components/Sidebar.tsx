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
  Bars3Icon,
  PlusIcon,
  EnvelopeIcon,
  LifebuoyIcon,
  FolderIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/ui/utils/cn';
import { QuickCreateDialog } from '@/ui/components/QuickCreateDialog';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

const navigation: SidebarItem[] = [
  { name: 'Dashboard', href: '/home', icon: HomeIcon },
  { name: 'Lifecycle', href: '/home/lifecycle', icon: LifebuoyIcon },
  { name: 'Analytics', href: '/home/analytics', icon: ChartBarIcon },
  { name: 'Projects', href: '/home/projects', icon: FolderIcon },
  { name: 'Team', href: '/home/team', icon: UsersIcon },
];

const documentsNavigation: SidebarItem[] = [
  { name: 'Data Library', href: '/home/data-library', icon: DocumentTextIcon },
  { name: 'Reports', href: '/home/reports', icon: ChartBarIcon },
  { name: 'Word Assistant', href: '/home/word-assistant', icon: DocumentTextIcon },
  { name: 'More', href: '/home/more', icon: BellIcon },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);

  const isCurrentPath = (path: string) => {
    if (path === '/home') {
      return location.pathname === '/home' || location.pathname === '/home/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn('lg:hidden', sidebarOpen ? 'fixed inset-0 z-50' : 'hidden')}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-[#111]">
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
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#111] px-6">
        {/* Organization Header */}
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">A</span>
            </div>
            <span className="text-lg font-semibold text-white">Acme Inc.</span>
          </div>
        </div>
        
        {/* Quick Create Button */}
        <button 
          onClick={() => setQuickCreateOpen(true)}
          className="flex items-center justify-between w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <PlusIcon className="h-5 w-5" />
            <span className="font-medium">Quick Create</span>
          </div>
          <EnvelopeIcon className="h-4 w-4 text-gray-400" />
        </button>
        
        {/* Quick Create Dialog */}
        <QuickCreateDialog 
          open={quickCreateOpen} 
          onOpenChange={setQuickCreateOpen} 
        />
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            {/* Main Navigation */}
            <li>
              <ul role="list" className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        isCurrentPath(item.href)
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800',
                        'group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isCurrentPath(item.href)
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-white',
                          'h-5 w-5 shrink-0 transition-colors duration-200'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            
            {/* Documents Section */}
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider mb-3">
                Documents
              </div>
              <ul role="list" className="space-y-1">
                {documentsNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        isCurrentPath(item.href)
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800',
                        'group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isCurrentPath(item.href)
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-white',
                          'h-5 w-5 shrink-0 transition-colors duration-200'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
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
