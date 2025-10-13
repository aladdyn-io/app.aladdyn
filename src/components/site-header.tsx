import { useState } from "react"
import { useLocation } from "react-router-dom"
import { ChevronRight } from "lucide-react"
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


const projectGenies = {
  'vijay': [
    { id: 1, name: 'LeadBot', status: 'active', icon: '🤖', url: '/genie' },
    { id: 2, name: 'SupportGenie', status: 'active', icon: '🧞♂️', url: '/genie' },
    { id: 3, name: 'EmailBot', status: 'training', icon: '📧', url: '/genie' },
    { id: 4, name: 'AnalyticsAI', status: 'active', icon: '📊', url: '/genie' },
  ],
  'marketing': [
    { id: 5, name: 'ContentCreator', status: 'active', icon: '✍️', url: '/genie' },
    { id: 6, name: 'SocialMediaBot', status: 'active', icon: '📱', url: '/genie' },
    { id: 7, name: 'AdOptimizer', status: 'active', icon: '🎯', url: '/genie' },
  ],
  'support': [
    { id: 8, name: 'TicketBot', status: 'active', icon: '🎫', url: '/genie' },
    { id: 9, name: 'KnowledgeBase', status: 'training', icon: '📚', url: '/genie' },
  ],
}

export function SiteHeader() {
  const location = useLocation()
  const currentPath = location.pathname
  const currentPageName = routeNames[currentPath] || 'Dashboard'
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  
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
                  <BreadcrumbLink href="/">Vijay's project</BreadcrumbLink>
                </div>
                {isHovered && (
                  <div 
                    className="absolute top-full -left-1.5 w-48 bg-white border border-gray-200 rounded-md shadow-lg px-1.5 py-0.5 z-50"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div className="py-1">
                      <div 
                        className="relative"
                        onMouseEnter={() => setHoveredProject('vijay')}
                        onMouseLeave={() => setHoveredProject(null)}
                      >
                        <a href="/" className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 transition-colors">
                          <span>Vijay's project</span>
                          <ChevronRight className="h-4 w-4" />
                        </a>
                        {hoveredProject === 'vijay' && (
                          <div className="absolute left-full top-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                            <div className="py-1">
                              {projectGenies.vijay.map((genie) => (
                                <a 
                                  key={genie.id} 
                                  href={genie.url} 
                                  className="px-3 py-2 text-sm hover:bg-gray-100 transition-colors block"
                                  onClick={() => localStorage.setItem('selectedGenie', genie.name)}
                                >
                                  {genie.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div 
                        className="relative"
                        onMouseEnter={() => setHoveredProject('marketing')}
                        onMouseLeave={() => setHoveredProject(null)}
                      >
                        <a href="/genie" className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 transition-colors">
                          <span>Marketing Campaign</span>
                          <ChevronRight className="h-4 w-4" />
                        </a>
                        {hoveredProject === 'marketing' && (
                          <div className="absolute left-full top-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                            <div className="py-1">
                              {projectGenies.marketing.map((genie) => (
                                <a 
                                  key={genie.id} 
                                  href={genie.url} 
                                  className="px-3 py-2 text-sm hover:bg-gray-100 transition-colors block"
                                  onClick={() => localStorage.setItem('selectedGenie', genie.name)}
                                >
                                  {genie.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div 
                        className="relative"
                        onMouseEnter={() => setHoveredProject('support')}
                        onMouseLeave={() => setHoveredProject(null)}
                      >
                        <a href="/" className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 transition-colors">
                          <span>Support Center</span>
                          <ChevronRight className="h-4 w-4" />
                        </a>
                        {hoveredProject === 'support' && (
                          <div className="absolute left-full top-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                            <div className="py-1">
                              {projectGenies.support.map((genie) => (
                                <a 
                                  key={genie.id} 
                                  href={genie.url} 
                                  className="px-3 py-2 text-sm hover:bg-gray-100 transition-colors block"
                                  onClick={() => localStorage.setItem('selectedGenie', genie.name)}
                                >
                                  {genie.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
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
