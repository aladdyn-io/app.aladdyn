import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDownIcon, HomeIcon } from '@heroicons/react/24/outline'
import { cn } from '@/ui/utils/cn'
import api from '@/services/api'

export function OnboardingNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(1)
  const [projects, setProjects] = useState<any[]>([])
  const [projectGenies, setProjectGenies] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch projects and genies data
  useEffect(() => {
    fetchProjectsAndGenies()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

      const fetchProjectsAndGenies = async () => {
        try {
          const response = await api.getProjectsAndGenies()
          if (response.success && response.data) {
            const { userGenies, otherGenies } = (response.data as any)
            
            // Create project structure for display
            const projects = []
            
            // Add Nix's Project if user has genies
            if (userGenies && userGenies.length > 0) {
              projects.push({
                id: 'nix-project',
                name: "Nix's Project",
                status: 'active',
                icon: '🏠',
                genies: userGenies,
                owner: { name: 'Nix', email: 'n@n.com' }
              })
            }
            
            // Add other genies as individual "projects" for display
            if (otherGenies && otherGenies.length > 0) {
              // Group other genies by a common identifier since we don't have owner info in the flat structure
              projects.push({
                id: 'other-genies',
                name: "Other Genies",
                status: 'active',
                icon: '👥',
                genies: otherGenies,
                owner: { name: 'Collaborators', email: 'collaborators' }
              })
            }
            
            setProjects(projects)
            
            // Convert to projectGenies format
            const geniesMap: any = {}
            projects.forEach((project, index) => {
              geniesMap[index + 1] = project.genies || []
            })
            setProjectGenies(geniesMap)
            
            console.log('Fetched projects and genies:', { userGenies, otherGenies, projects })
          } else {
            console.error('Failed to fetch projects and genies:', response.error)
            setProjects([])
            setProjectGenies({})
          }
        } catch (error) {
          console.error('Error fetching projects and genies:', error)
          setProjects([])
          setProjectGenies({})
        } finally {
          setLoading(false)
        }
      }


  const currentGenies = projectGenies[selectedProject as keyof typeof projectGenies] || []

  if (loading) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

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
                className="flex items-center ml-4 sm:ml-10 space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <span className="truncate max-w-[200px] sm:max-w-none">
                  {projects.find(p => p.id === selectedProject)?.name || "Select Project"}
                </span>
                <ChevronDownIcon className={cn("w-4 h-4 transition-transform flex-shrink-0", isDropdownOpen && "rotate-180")} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-3 w-[320px] sm:w-[420px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
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
                  
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* Left Column - Projects */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-bold text-gray-900">Projects</h4>
                          <span className="text-xs text-gray-500">{projects.length} total</span>
                        </div>
                        <div className="space-y-2">
                          {projects.length > 0 ? projects.map((project) => (
                            <button
                              key={project.id}
                              onClick={() => {
                                setSelectedProject(project.id)
                                if (project.id === 1) {
                                  window.location.href = '/home'
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
                          )) : (
                            <div className="text-center py-6 text-gray-500">
                              <div className="text-2xl mb-2">📁</div>
                              <p className="text-sm">No projects found</p>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <button 
                            onClick={() => fetchProjectsAndGenies()}
                            className="flex-1 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 hover:text-emerald-900 text-sm font-medium rounded-xl transition-all duration-200 border border-emerald-200 hover:border-emerald-300"
                          >
                            🔄 Refresh
                          </button>
                          <button className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 text-sm font-medium rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300">
                            + New Project
                          </button>
                        </div>
                      </div>

                      {/* Right Column - Genies */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-bold text-gray-900">Genies</h4>
                          <span className="text-xs text-gray-500">{currentGenies.length} active</span>
                        </div>
                        <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
                          {currentGenies.length > 0 ? currentGenies.map((genie: any) => (
                            <div
                              key={genie.id}
                              onClick={() => window.location.href = `/genie/${genie.websiteId || genie.id}`}
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
                          )) : (
                            <div className="text-center py-6 text-gray-500">
                              <div className="text-2xl mb-2">🤖</div>
                              <p className="text-sm">No genies in this project</p>
                            </div>
                          )}
                        </div>
                        <button className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 text-sm font-medium rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300">
                          + New Genie
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link
              to="/home"
              className="flex items-center space-x-1 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              <HomeIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              to="/genie"
              className="flex items-center space-x-1 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              <span className="text-lg">🧞‍♂️</span>
              <span className="hidden sm:inline">Genie</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
