
import { useState } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Calendar, FileText, Home, Plus, Search, Send, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: FileText, label: "Quotes", path: "/quotes" },
    { icon: Calendar, label: "Bookings", path: "/bookings" },
    { icon: Users, label: "Clients & Agents", path: "/clients" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar
          defaultCollapsed={false}
          collapsible="icon"
          onCollapsedChange={setCollapsed}
        >
          <SidebarHeader className="flex h-14 items-center border-b px-4">
            <div className="flex items-center gap-2">
              {!collapsed && (
                <span className="font-bold text-xl">Nomad Trips</span>
              )}
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "flex items-center gap-4 px-3 py-2 hover:bg-sidebar-accent",
                        location.pathname === item.path && "bg-sidebar-accent"
                      )}
                      onClick={() => navigate(item.path)}
                    >
                      <div>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="pt-4">
              <div className="px-4">
                <Button 
                  className="w-full flex items-center gap-2 bg-sand-500 hover:bg-sand-600"
                  onClick={() => navigate("/quotes/new")}
                >
                  <Plus className="h-4 w-4" />
                  {!collapsed && <span>New Quote</span>}
                </Button>
              </div>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="h-14 border-b flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="text-lg font-semibold">
                {location.pathname === "/" && "Dashboard"}
                {location.pathname === "/quotes" && "Quotes"}
                {location.pathname === "/quotes/new" && "Create New Quote"}
                {location.pathname.startsWith("/quotes/") && 
                  location.pathname !== "/quotes/new" && "Quote Details"}
                {location.pathname === "/bookings" && "Bookings"}
                {location.pathname === "/clients" && "Clients & Agents"}
                {location.pathname === "/settings" && "Settings"}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Send className="h-5 w-5 text-muted-foreground" />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
