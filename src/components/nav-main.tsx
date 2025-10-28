import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react"
import { useLocation } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  showActions = true,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
  showActions?: boolean
}) {
  const location = useLocation()

  const isActive = (url: string) => {
    // Exact match for root paths
    if (url === '/' || url.match(/^\/genie\/[^\/]+$/)) {
      return location.pathname === url
    }
    // For sub-routes, check if pathname starts with the URL
    return location.pathname === url || location.pathname.startsWith(url + '/')
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {showActions && (
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Quick Create"
                className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                asChild
              >
                <a href="/create">
                  <PlusCircleIcon />
                  <span>Quick Create</span>
                </a>
              </SidebarMenuButton>
              <Button
                size="icon"
                className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
                asChild
              >
                <a href="/notifications">
                  <MailIcon />
                  <span className="sr-only">Inbox</span>
                </a>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        <SidebarMenu>
          {items.map((item) => {
            const active = isActive(item.url)
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  asChild
                  className={active ? "bg-blue-100 text-blue-900 font-semibold hover:bg-blue-100" : ""}
                >
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
