import * as React from "react"
import { useState, useEffect } from "react"
import {
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  CreditCardIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  ArrowRight,
  Sparkles,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import api from "@/services/api"
import { useNavigate } from "react-router-dom"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Lifecycle",
      url: "/notifications",
      icon: ListIcon,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChartIcon,
    },
    {
      title: "Projects",
      url: "/about",
      icon: FolderIcon,
    },
    {
      title: "Team",
      url: "/profile",
      icon: UsersIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Pricing",
      url: "/pricing",
      icon: CreditCardIcon,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "/about",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "/",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "/documents",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "/analytics",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "/documents",
      icon: FileIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  })
  const [subscription, setSubscription] = useState<any>(null)
  const [loadingSubscription, setLoadingSubscription] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        // Keep default user
      }
    }
    
    // Fetch subscription
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token || token.startsWith('test-token-')) {
        setLoadingSubscription(false)
        return
      }
      
      const response = await api.getActiveSubscription()
      if (response.success && response.data) {
        setSubscription(response.data)
      }
    } catch (error) {
      console.log('No active subscription or authentication failed')
    } finally {
      setLoadingSubscription(false)
    }
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <img className="h-7 w-7" src="/gene.png" alt="Aladdyn" />
                <span className="text-xl font-semibold">Aladdyn</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      
      {/* Subscription Plan Card */}
      {!loadingSubscription && (
        <div className="px-3 py-2 border-t">
          {subscription ? (
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-3 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-semibold">
                    {subscription.plan?.displayName || 'Current Plan'}
                  </span>
                </div>
                {subscription.status === 'ACTIVE' && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <div className="text-xs text-white/80 mb-3">
                {subscription.plan?.price > 0 ? (
                  <>₹{subscription.plan?.price}/{subscription.plan?.interval === 'yearly' ? 'year' : 'month'}</>
                ) : (
                  'Free Plan'
                )}
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-1.5 px-2 rounded flex items-center justify-center gap-1 transition-colors"
              >
                Upgrade Plan
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-3">
              <div className="text-center">
                <CreditCardIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-600 mb-2">Get started with a plan</p>
                <button
                  onClick={() => navigate('/pricing')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-2 rounded flex items-center justify-center gap-1 transition-colors"
                >
                  View Plans
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
