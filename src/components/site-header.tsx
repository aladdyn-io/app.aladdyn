import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import api from "@/services/api"

const routeNames: Record<string, string> = {
  '/': 'Dashboard',
  '/analytics': 'Analytics',
  '/documents': 'Documents',
  '/notifications': 'Notifications',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/about': 'About',
  '/genie': 'Dashboard',
  '/genie/analytics': 'Analytics',
  '/genie/playground': 'Playground',
  '/genie/leads': 'Leads',
  '/genie/chatlogs': 'Chat Logs',
  '/genie/train': 'Train',
  '/genie/scripts': 'Scripts',
  '/genie/settings': 'Settings',
}



export function SiteHeader() {
  const location = useLocation()
  const currentPath = location.pathname
  const currentPageName = routeNames[currentPath] || 'Dashboard'
  const [isHovered, setIsHovered] = useState(false)
  const [userGenies, setUserGenies] = useState<any[]>([])
  const [otherGenies, setOtherGenies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [teamSearchTerm, setTeamSearchTerm] = useState('')
  const [projectSearchTerm, setProjectSearchTerm] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('user-projects')
  const [userName, setUserName] = useState('User')

  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserName(user.name || 'User');
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUserName('User');
      }
    }
  }, []);

  // Sync selected team with current route
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/other') {
      setSelectedTeam('other-projects');
    } else {
      setSelectedTeam('user-projects');
    }
  }, [location.pathname]);

  useEffect(() => {
    fetchProjectsAndGenies();
  }, []);

  const fetchProjectsAndGenies = async () => {
    try {
      const response = await api.getProjectsAndGenies();
      if (response.success && response.data) {
        const { userGenies: userGen, otherGenies: otherGen } = (response.data as any);
        setUserGenies(userGen || []);
        setOtherGenies(otherGen || []);
      } else {
        setUserGenies([]);
        setOtherGenies([]);
      }
    } catch (error) {
      console.error('Error fetching projects and genies:', error);
      setUserGenies([]);
      setOtherGenies([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Get genie name from URL or localStorage
  const getGenieName = () => {
    if (currentPath.startsWith('/genie')) {
      const storedGenie = localStorage.getItem('selectedGenie')
      return storedGenie || null
    }
    return null
  }

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <div 
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="hover:text-foreground transition-colors cursor-pointer">
                  <BreadcrumbLink href="/">
                    {loading ? "Loading..." : (() => {
                      const currentPath = location.pathname;
                      if (currentPath === '/other') {
                        return "Other Projects";
                      } else {
                        return userGenies.length > 0 ? `${userName}'s Project` : "Select Project";
                      }
                    })()}
                  </BreadcrumbLink>
                </div>
                {isHovered && (
                  <div 
                    className="absolute top-full -left-1.5 w-[600px] bg-gray-900 rounded-xl shadow-2xl border border-gray-700 z-50 overflow-hidden"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div className="flex h-96">
                      {/* Teams Column */}
                      <div className="w-1/2 border-r border-gray-700 p-4">
                        <div className="relative mb-4">
                          <input
                            type="text"
                            placeholder="Find Team..."
                            value={teamSearchTerm}
                            onChange={(e) => setTeamSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div className="text-sm font-semibold text-gray-300 mb-3">Teams</div>
                        <div className="space-y-1 overflow-y-auto max-h-64">
                          <button
                            onClick={() => {
                              setSelectedTeam('user-projects');
                              window.location.href = '/';
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                              selectedTeam === 'user-projects' 
                                ? 'bg-emerald-600 text-white' 
                                : 'text-gray-300 hover:bg-gray-800'
                            }`}
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xs font-semibold text-white">
                              {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{userName}'s projects</div>
                            </div>
                            {selectedTeam === 'user-projects' && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTeam('other-projects');
                              window.location.href = '/other';
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                              selectedTeam === 'other-projects' 
                                ? 'bg-emerald-600 text-white' 
                                : 'text-gray-300 hover:bg-gray-800'
                            }`}
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-semibold text-white">
                              O
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">Other projects</div>
                            </div>
                            {selectedTeam === 'other-projects' && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          <button className="w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 text-gray-300 hover:bg-gray-800">
                            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-300">
                              +
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">Create Team</div>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Projects Column */}
                      <div className="w-1/2 p-4">
                        <div className="relative mb-4">
                          <input
                            type="text"
                            placeholder="Find Project..."
                            value={projectSearchTerm}
                            onChange={(e) => setProjectSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div className="text-sm font-semibold text-gray-300 mb-3">Projects</div>
                        <div className="space-y-1 overflow-y-auto max-h-64">
                          {/* Show genies based on selected team */}
                          {(selectedTeam === 'user-projects' ? userGenies : otherGenies)
                            .filter(genie => 
                              genie.name.toLowerCase().includes(projectSearchTerm.toLowerCase())
                            )
                            .map((genie: any) => (
                            <a 
                              key={genie.id} 
                              href={`/genie/${genie.websiteId || genie.id}`}
                              className="w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 text-gray-300 hover:bg-gray-800"
                              onClick={() => localStorage.setItem('selectedGenie', genie.name)}
                            >
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold ${
                                selectedTeam === 'user-projects' ? 'bg-emerald-600' : 'bg-blue-600'
                              } text-white`}>
                                {genie.icon || genie.name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{genie.name}</div>
                                <div className="text-xs text-gray-500 capitalize">{genie.status}</div>
                              </div>
                              {selectedTeam === 'user-projects' && (
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              )}
                            </a>
                          ))}
                          
                          {/* Show empty state if no genies */}
                          {(selectedTeam === 'user-projects' ? userGenies : otherGenies)
                            .filter(genie => 
                              genie.name.toLowerCase().includes(projectSearchTerm.toLowerCase())
                            ).length === 0 && (
                            <div className="text-center py-6 text-gray-500">
                              <div className="text-2xl mb-2">📁</div>
                              <p className="text-sm">
                                {selectedTeam === 'user-projects' ? "No projects found" : "No collaboration projects"}
                              </p>
                            </div>
                          )}
                          
                          <a href="#" className="w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 text-gray-300 hover:bg-gray-800">
                            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-300">
                              +
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">Create Project</div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </BreadcrumbItem>
            {getGenieName() && currentPath.startsWith('/genie') && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getGenieName()}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
            {currentPath !== '/' && !currentPath.startsWith('/genie') && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentPageName}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
            {currentPath.startsWith('/genie') && currentPath !== '/genie' && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentPageName}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
