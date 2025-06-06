import * as React from "react"

import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  versions: ["1.0.0", "Dashboard SENAI"],
  navMain: [
    {
      title: "Navegação",
      url: "#",
      items: [
        {
          title: "Início",
          url: "/",
        },
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Sobre o Projeto",
          url: "/sobre",
        },
      ],
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar className="bg-gray-50 border-r border-gray-200" {...props}>
      <SidebarHeader className="">
        <div className="w-fit">
          <Image 
            src="/senai-logo-2.png" 
            alt="Logo SENAI" 
            width={100} 
            height={100}
            className="mx-auto"
            priority
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-blue-600 font-medium">{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={item.isActive}
                      className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:bg-gray-200"
                    >
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail className="bg-gray-200" />
    </Sidebar>
  );
}
