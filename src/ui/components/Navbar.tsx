import { Link, useLocation } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import { cn } from '@/ui/utils/cn';
import { useState, useRef, useEffect } from 'react';
import { Breadcrumb } from './Breadcrumb';

export function Navbar() {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(1); // Default to Vijay's project
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [hideTimeout, setHideTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const projects = [
    { 
      id: 1, 
      name: "Vijay's project", 
      status: 'active', 
      icon: '🏠',
      genies: [
        { id: 101, name: 'LeadBot', status: 'active', icon: '🤖' },
        { id: 102, name: 'SupportGenie', status: 'active', icon: '🧞♂️' },
        { id: 103, name: 'EmailBot', status: 'training', icon: '📧' },
        { id: 104, name: 'AnalyticsAI', status: 'active', icon: '📊' },
      ]
    },
    { 
      id: 2, 
      name: 'Marketing Campaign', 
      status: 'active', 
      icon: '📈',
      genies: [
        { id: 105, name: 'ContentCreator', status: 'active', icon: '✍️' },
        { id: 106, name: 'SocialMediaBot', status: 'active', icon: '📱' },
        { id: 107, name: 'AdOptimizer', status: 'active', icon: '🎯' },
      ]
    },
    { 
      id: 3, 
      name: 'Support Center', 
      status: 'inactive', 
      icon: '🎧',
      genies: [
        { id: 108, name: 'TicketBot', status: 'active', icon: '🎫' },
        { id: 109, name: 'KnowledgeBase', status: 'training', icon: '📚' },
      ]
    },
  ];

  const currentGenies = projects.find(p => p.id === selectedProject)?.genies || [];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 lg:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-6">
            {/* Breadcrumb */}
            <Breadcrumb />
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/home"
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border',
                isActive('/home') || isActive('/')
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200 shadow-sm'
                  : 'text-gray-600 bg-gray-50 border-gray-200 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200'
              )}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/genie"
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border',
                location.pathname.startsWith('/genie')
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200 shadow-sm'
                  : 'text-gray-600 bg-gray-50 border-gray-200 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200'
              )}
            >
              <span className="text-lg">🧞♂️</span>
              <span>
                {(() => {
                  const genieIdMatch = location.pathname.match(/\/genie\/(\d+)/);
                  if (genieIdMatch) {
                    const genieId = parseInt(genieIdMatch[1]);
                    const allGenies = projects.flatMap(p => p.genies);
                    const currentGenie = allGenies.find(g => g.id === genieId);
                    return currentGenie ? currentGenie.name : 'Genie';
                  }
                  return 'Genie';
                })()
                }
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}