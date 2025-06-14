
import React from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, User, Plus } from "lucide-react";

/** Left sidebar: KIWI logo, nav */
export default function KiwiSidebar() {
  const navItems = [
    {
      title: "Dashboard",
      url: "/home",
      icon: LayoutDashboard,
    },
    {
      title: "Projects",
      url: "#projects",
      icon: Plus,
    },
    {
      title: "Teams",
      url: "#teams",
      icon: Users,
    },
    {
      title: "Account",
      url: "#account",
      icon: User,
    },
  ];
  return (
    <Sidebar className="min-h-screen bg-[#fffde8] border-r border-[#dbe186] shadow-md w-[200px] !rounded-none">
      <SidebarContent>
        {/* App Logo/Brand */}
        <div className="flex flex-row items-center gap-2 mt-4 mb-7 pl-2">
          <span
            className="rounded-full border border-[#badc5b] shadow"
            style={{ background: "#badc5b", width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            {/* Small kiwi SVG */}
            <svg width="18" height="16" viewBox="0 0 19 15">
              <ellipse cx="9.5" cy="7.5" rx="7.5" ry="6.6" fill="#baf661" stroke="#8eaa4d" strokeWidth="1.3" />
              <ellipse cx="9.5" cy="7.5" rx="5.5" ry="5" fill="#fafbd6" opacity="0.5" />
            </svg>
          </span>
          <span className="pixel-font font-bold text-[#7b6449] text-lg tracking-wider select-none">KIWI</span>
        </div>
        {/* Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="pixel-font text-xs text-[#8bb47e]">MENU</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex flex-row gap-2 items-center text-base py-2 px-2 hover:bg-[#e2fde4] rounded-sm transition-colors pixel-font text-[#233f24]">
                      <item.icon size={18} />
                      <span className="pt-0.5">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
