import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@/ui/utils/cn';
import { useState, useRef, useEffect } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb() {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [hideTimeout, setHideTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [selectedProject, setSelectedProject] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Mock projects data (same as in Navbar)
  const projects = [
    { 
      id: 1, 
      name: "Vijay's project", 
      status: 'active',
      genies: [
        { id: 101, name: 'LeadBot', icon: '🤖' },
        { id: 102, name: 'SupportGenie', icon: '💬' },
        { id: 103, name: 'EmailBot', icon: '📧' },
      ]
    },
    { 
      id: 2, 
      name: 'Marketing Campaign', 
      status: 'active',
      genies: [
        { id: 104, name: 'AnalyticsAI', icon: '📊' },
        { id: 105, name: 'ContentCreator', icon: '✍️' },
      ]
    },
    { 
      id: 3, 
      name: 'E-commerce Bot', 
      status: 'draft',
      genies: [
        { id: 106, name: 'SocialMediaBot', icon: '📱' },
        { id: 107, name: 'AdOptimizer', icon: '🎯' },
      ]
    },
  ];
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [hideTimeout]);
  
  // Get current project info
  const currentProject = projects.find(p => p.id === selectedProject);
  const currentProjectName = currentProject?.name || "Vijay's project";
  

  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    if (pathSegments.length === 0) {
      return [{ label: 'Home', href: '/home' }];
    }
    
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Handle different route patterns
    if (pathSegments[0] === 'home') {
      breadcrumbs.push({ label: 'Home', href: '/home' });
      
      if (pathSegments[1]) {
        const pageMap: Record<string, string> = {
          'analytics': 'Analytics',
          'documents': 'Documents',
          'notifications': 'Notifications',
          'profile': 'Profile',
          'settings': 'Settings',
          'about': 'About'
        };
        breadcrumbs.push({ label: pageMap[pathSegments[1]] || pathSegments[1] });
      }
    } else if (pathSegments[0] === 'genie') {
      if (pathSegments[1]) {
        // Check if it's a genie ID (number) or a page
        if (!isNaN(Number(pathSegments[1]))) {
          const genieNames: Record<string, string> = {
            '101': 'LeadBot',
            '102': 'SupportGenie', 
            '103': 'EmailBot',
            '104': 'AnalyticsAI',
            '105': 'ContentCreator',
            '106': 'SocialMediaBot',
            '107': 'AdOptimizer',
            '108': 'TicketBot',
            '109': 'KnowledgeBase'
          };
          breadcrumbs.push({ label: genieNames[pathSegments[1]] || pathSegments[1] });
        } else {
          const pageMap: Record<string, string> = {
            'analytics': 'Analytics',
            'playground': 'Playground',
            'leads': 'Lead Track',
            'chatlogs': 'Chat Logs',
            'train': 'Train Genie',
            'scripts': 'Scripts',
            'settings': 'Settings'
          };
          breadcrumbs.push({ label: pageMap[pathSegments[1]] || pathSegments[1] });
        }
      }
    }
    
    return breadcrumbs;
  };
  
  const breadcrumbs = getBreadcrumbs();
  
  if (breadcrumbs.length === 0) {
    return null;
  }
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      {/* Project Dropdown */}
      <div 
        className="relative" 
        ref={dropdownRef}
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => {
          const timeout = setTimeout(() => {
            setIsDropdownOpen(false);
            setHoveredProject(null);
          }, 200);
          setHideTimeout(timeout);
        }}
      >
        <button className="flex items-center space-x-1 text-gray-900 font-semibold hover:text-emerald-600 transition-colors">
          <span>{currentProjectName}</span>
        </button>
        
        {isDropdownOpen && (
          <div 
            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-visible"
            onMouseEnter={() => {
              if (hideTimeout) clearTimeout(hideTimeout);
            }}
          >
            <div className="p-3">
              <div className="text-xs font-semibold text-gray-900 mb-2">Projects</div>
              <div className="space-y-1">
                {projects.map((project) => (
                  <div 
                    key={project.id} 
                    className="relative"
                    onMouseEnter={() => {
                      if (hideTimeout) clearTimeout(hideTimeout);
                      setHoveredProject(project.id);
                    }}
                    onMouseLeave={() => {
                      const timeout = setTimeout(() => setHoveredProject(null), 200);
                      setHideTimeout(timeout);
                    }}
                  >
                    <button
                      onClick={() => {
                        setSelectedProject(project.id);
                        setIsDropdownOpen(false);
                        window.location.href = '/home';
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedProject === project.id
                          ? 'bg-emerald-50 text-emerald-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold ${
                          project.id === 1 ? 'bg-blue-600 text-white' :
                          project.id === 2 ? 'bg-purple-600 text-white' :
                          'bg-emerald-600 text-white'
                        }`}>
                          {project.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{project.name}</div>
                          <div className="text-xs text-gray-500 capitalize">{project.status}</div>
                        </div>
                        {project.genies.length > 0 && (
                          <div className="text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                    
                    {/* Genies Submenu */}
                    {hoveredProject === project.id && project.genies.length > 0 && (
                      <div 
                        className="absolute left-full top-0 ml-2 w-52 bg-white rounded-lg shadow-2xl border border-gray-200 z-[110]"
                        onMouseEnter={() => {
                          if (hideTimeout) clearTimeout(hideTimeout);
                          setHoveredProject(project.id);
                        }}
                        onMouseLeave={() => {
                          const timeout = setTimeout(() => setHoveredProject(null), 200);
                          setHideTimeout(timeout);
                        }}
                      >
                        <div className="p-3">
                          <div className="text-xs font-semibold text-gray-900 mb-2">Genies</div>
                          <div className="space-y-1">
                            {project.genies.map((genie) => (
                              <button
                                key={genie.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsDropdownOpen(false);
                                  setHoveredProject(null);
                                  window.location.href = `/genie/${genie.id}`;
                                }}
                                className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors duration-150 text-sm"
                              >
                                <div className="flex items-center space-x-2">
                                  <span>{genie.icon}</span>
                                  <span className="truncate">{genie.name}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Separator if we have breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
      )}
      
      {/* Breadcrumbs */}
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && (
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          )}
          {item.href && index < breadcrumbs.length - 1 ? (
            <Link
              to={item.href}
              className="hover:text-emerald-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              index === breadcrumbs.length - 1 
                ? "text-gray-900 font-medium" 
                : "text-gray-600"
            )}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}