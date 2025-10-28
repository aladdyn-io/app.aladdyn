"use client"

import { useLocation } from "react-router-dom"
import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: LucideIcon
    badge?: string
  }[]
}) {
  const location = useLocation()

  const isActive = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + '/')
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Data Source</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const active = isActive(item.url)
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild className={active ? "bg-blue-100 text-blue-900 font-semibold hover:bg-blue-100" : ""}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
