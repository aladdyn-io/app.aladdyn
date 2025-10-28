import { useState, useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"
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
import { Home } from "lucide-react"
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
  const { genieId } = useParams<{ genieId?: string }>()
  const currentPath = location.pathname
  const currentPageName = routeNames[currentPath] || 'Dashboard'
  const [isHovered, setIsHovered] = useState(false)
  const [userGenies, setUserGenies] = useState<any[]>([])
  const [otherGenies, setOtherGenies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState('user-projects')
  const [userName, setUserName] = useState('User')
  const [genieName, setGenieName] = useState<string>('')
  const [genieWebsiteUrl, setGenieWebsiteUrl] = useState<string>('')

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

  // Fetch genie details if genieId is in URL
  useEffect(() => {
    if (genieId) {
      fetchGenieDetails();
    }
  }, [genieId]);

  const fetchGenieDetails = async () => {
    if (!genieId) return;

    try {
      const response = await api.getGenieDetails(genieId);
      if (response.success && response.data) {
        const data = response.data as any;
        setGenieName(data.name);
        setGenieWebsiteUrl(data.websiteUrl || '');
      }
    } catch (error) {
      console.error('Failed to fetch genie details:', error);
    }
  };

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
  
  // Get genie name from API
  const getGenieName = () => {
    if (currentPath.startsWith('/genie') && genieName) {
      return genieName;
    }
    return null;
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
                  <BreadcrumbLink href="/" className="flex items-center gap-2">
                    <Home className="w-3.5 h-3.5" />
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
                    className="absolute top-full -left-1.5 w-[600px] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div className="flex h-96">
                      {/* Teams Column */}
                      <div className="w-1/2 border-r border-gray-200 p-4">
                        <div className="text-sm font-semibold text-gray-700 mb-3">Teams</div>
                        <div className="space-y-1 overflow-y-auto max-h-64">
                          <button
                            onClick={() => {
                              setSelectedTeam('user-projects');
                              window.location.href = '/';
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                              selectedTeam === 'user-projects' 
                                ? 'bg-emerald-600 text-white' 
                                : 'text-gray-700 hover:bg-gray-100'
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
                                : 'text-gray-700 hover:bg-gray-100'
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
                        </div>
                      </div>

                      {/* Projects Column */}
                      <div className="w-1/2 p-4">
                        <div className="text-sm font-semibold text-gray-700 mb-3">Projects</div>
                        <div className="space-y-1 overflow-y-auto max-h-80">
                          {/* Show genies based on selected team */}
                          {(selectedTeam === 'user-projects' ? userGenies : otherGenies)
                            .map((genie: any) => (
                            <a 
                              key={genie.id} 
                              href={`/genie/${genie.id}`}
                              className="w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 text-gray-700 hover:bg-gray-100"
                            >
                              <div className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center p-1">
                                {genie.websiteUrl ? (
                                  <img 
                                    src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${genie.websiteUrl}&size=32`}
                                    alt={genie.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const parent = target.parentElement;
                                      if (parent) {
                                        parent.innerHTML = `<div class="text-xs font-semibold text-gray-600">${genie.icon || genie.name.charAt(0)}</div>`;
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className="text-xs font-semibold text-gray-600">
                                    {genie.icon || genie.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{genie.name}</div>
                                <div className="text-xs text-gray-500">{genie.websiteUrl ? genie.websiteUrl.split('//')[1] : ''}</div>
                              </div>
                             
                            </a>
                          ))}
                          
                          {/* Show empty state if no genies */}
                          {(selectedTeam === 'user-projects' ? userGenies : otherGenies).length === 0 && (
                            <div className="text-center py-6 text-gray-500">
                              <div className="text-2xl mb-2">📁</div>
                              <p className="text-sm">
                                {selectedTeam === 'user-projects' ? "No projects found" : "No collaboration projects"}
                              </p>
                            </div>
                          )}
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
                  <BreadcrumbLink href={`/genie/${genieId}`} className="flex items-center gap-2">
                    {genieWebsiteUrl && (
                      <img 
                        src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${genieWebsiteUrl}&size=16`}
                        alt={genieName}
                        className="w-4 h-4"
                      />
                    )}
                    <span>{getGenieName()}</span>
                    {genieWebsiteUrl && (
                      <span className="text-xs text-gray-500 ml-1">
                        ({genieWebsiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')})
                      </span>
                    )}
                  </BreadcrumbLink>
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
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
