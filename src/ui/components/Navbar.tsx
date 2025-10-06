import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/ui/utils/cn';
import { useState, useRef, useEffect } from 'react';

export function Navbar() {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(1); // Default to Vijay's project
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
    { id: 1, name: "Vijay's project", status: 'active', icon: '🏠' },
    { id: 2, name: 'Marketing Campaign', status: 'active', icon: '📈' },
    { id: 3, name: 'Support Center', status: 'inactive', icon: '🎧' },
  ];

  const projectGenies = {
    1: [ // Vijay's project genies
      { id: 1, name: 'LeadBot', status: 'active', icon: '🤖' },
      { id: 2, name: 'SupportGenie', status: 'active', icon: '🧞‍♂️' },
      { id: 3, name: 'EmailBot', status: 'training', icon: '📧' },
      { id: 4, name: 'AnalyticsAI', status: 'active', icon: '📊' },
    ],
    2: [ // Marketing Campaign genies
      { id: 5, name: 'ContentCreator', status: 'active', icon: '✍️' },
      { id: 6, name: 'SocialMediaBot', status: 'active', icon: '📱' },
      { id: 7, name: 'AdOptimizer', status: 'active', icon: '🎯' },
    ],
    3: [ // Support Center genies
      { id: 8, name: 'TicketBot', status: 'active', icon: '🎫' },
      { id: 9, name: 'KnowledgeBase', status: 'training', icon: '📚' },
    ],
  };

  const currentGenies = projectGenies[selectedProject as keyof typeof projectGenies] || [];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center">
                <img src="/gene.png" alt="Aladdyn" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                Aladdyn
              </span>
            </Link>

            {/* Project Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center ml-10 space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <span>{projects.find(p => p.id === selectedProject)?.name || "Vijay's project"}</span>
                <ChevronDownIcon className={cn("w-4 h-4 transition-transform", isDropdownOpen && "rotate-180")} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-[420px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-6 py-4 border-b border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {projects.find(p => p.id === selectedProject)?.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {currentGenies.length} active genies
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full shadow-sm">
                          Pro
                        </div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left Column - Projects */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-bold text-gray-900">Projects</h4>
                          <span className="text-xs text-gray-500">{projects.length} total</span>
                        </div>
                        <div className="space-y-2">
                          {projects.map((project) => (
                            <button
                              key={project.id}
                              onClick={() => {
                                setSelectedProject(project.id);
                                if (project.id === 1) {
                                  window.location.href = '/home';
                                }
                              }}
                              className={cn(
                                "w-full text-left group relative overflow-hidden rounded-xl p-3 transition-all duration-200",
                                selectedProject === project.id 
                                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg transform scale-105" 
                                  : "bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-emerald-300"
                              )}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={cn(
                                  "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
                                  selectedProject === project.id 
                                    ? "bg-white/20 backdrop-blur-sm" 
                                    : "bg-white shadow-sm"
                                )}>
                                  {project.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className={cn(
                                    "font-semibold text-sm truncate",
                                    selectedProject === project.id ? "text-white" : "text-gray-900"
                                  )}>
                                    {project.name}
                                  </div>
                                  <div className={cn(
                                    "text-xs mt-1",
                                    selectedProject === project.id ? "text-emerald-100" : "text-gray-500"
                                  )}>
                                    {project.status}
                                  </div>
                                </div>
                                <div className={cn(
                                  "w-3 h-3 rounded-full flex-shrink-0",
                                  project.status === 'active' 
                                    ? selectedProject === project.id 
                                      ? "bg-white" 
                                      : "bg-emerald-500" 
                                    : "bg-gray-400"
                                )}></div>
                              </div>
                            </button>
                          ))}
                        </div>
                        <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                          + New Project
                        </button>
                      </div>

                      {/* Right Column - Genies */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-bold text-gray-900">Genies</h4>
                          <span className="text-xs text-gray-500">{currentGenies.length} active</span>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {currentGenies.map((genie) => (
                            <div
                              key={genie.id}
                              className="group bg-white border border-gray-200 hover:border-emerald-300 rounded-xl p-3 hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg flex items-center justify-center text-lg shadow-sm">
                                  {genie.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-sm text-gray-900 truncate">
                                    {genie.name}
                                  </div>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs text-gray-500 capitalize">
                                      {genie.status}
                                    </span>
                                    <div className={cn(
                                      "w-2 h-2 rounded-full",
                                      genie.status === 'active' ? 'bg-emerald-500' : 'bg-yellow-500'
                                    )}></div>
                                  </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                          + New Genie
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <Link
              to="/home"
              className={cn(
                'flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive('/home') || isActive('/')
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
              )}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/genie"
              className={cn(
                'flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive('/genie')
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
              )}
            >
              <span>🧞‍♂️</span>
              <span>Genie</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
