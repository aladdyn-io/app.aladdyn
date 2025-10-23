import * as React from "react"
import {
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/genie",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Analytics",
      url: "/genie/analytics",
      icon: BarChartIcon,
    },
    {
      title: "Playground",
      url: "/genie/playground",
      icon: FolderIcon,
    },
    {
      title: "Leads",
      url: "/genie/leads",
      icon: UsersIcon,
    },
    {
      title: "Chat Logs",
      url: "/genie/chatlogs",
      icon: ListIcon,
    },
  ],
  navClouds: [
    {
      title: "Train",
      icon: CameraIcon,
      isActive: true,
      url: "/genie/train",
      items: [
        {
          title: "Training Data",
          url: "/genie/train",
        },
      ],
    },
    {
      title: "Scripts",
      icon: FileCodeIcon,
      url: "/genie/scripts",
      items: [
        {
          title: "Active Scripts",
          url: "/genie/scripts",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/genie/settings",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "/about",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "/genie",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "/genie/train",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "/genie/analytics",
      icon: ClipboardListIcon,
    },
    {
      name: "Scripts",
      url: "/genie/scripts",
      icon: FileIcon,
    },
  ],
}

export function GenieSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/genie">
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