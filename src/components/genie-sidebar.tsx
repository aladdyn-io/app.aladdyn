import * as React from "react"
import { useParams } from "react-router-dom"
import {
  BarChartIcon,
  CameraIcon,
  DatabaseIcon,
  FileCodeIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  Palette,
  MessageSquareText,
  PlayCircle,
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

export function GenieSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { genieId } = useParams<{ genieId?: string }>();
  
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: `/genie/${genieId || ''}`,
        icon: LayoutDashboardIcon,
      },
      {
        title: "Analytics",
        url: `/genie/${genieId || ''}/analytics`,
        icon: BarChartIcon,
      },
      {
        title: "Playground",
        url: `/genie/${genieId || ''}/playground`,
        icon: PlayCircle,
      },
      {
        title: "Leads",
        url: `/genie/${genieId || ''}/leads`,
        icon: UsersIcon,
      },
      {
        title: "Chat Logs",
        url: `/genie/${genieId || ''}/chatlogs`,
        icon: ListIcon,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: `/genie/${genieId || ''}/settings`,
        icon: SettingsIcon,
      },
      {
        title: "Get Help",
        url: "/about",
        icon: HelpCircleIcon,
      },
      {
        title: "Search",
        url: `/genie/${genieId || ''}`,
        icon: SearchIcon,
      },
    ],
    documents: [
      {
        name: "Train",
        url: `/genie/${genieId || ''}/train`,
        icon: DatabaseIcon,
      },
      {
        name: "Scripts",
        url: `/genie/${genieId || ''}/scripts`,
        icon: FileCodeIcon,
      },
      {
        name: "Prompts",
        url: `/genie/${genieId || ''}/prompts`,
        icon: MessageSquareText,
      },
      {
        name: "Customize",
        url: `/genie/${genieId || ''}/customize`,
        icon: Palette,
      },
    ],
  };

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
                <img className="h-7 w-7 " src="/gene.png" alt="genie" />
                <span className="text-xl font-semibold">Genie</span>
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
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}