
import { useState } from "react";
import { Sidebar } from "./ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  CreditCard,
  Settings,
  Users,
  FileText,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr] lg:grid-cols-[240px_1fr]">
      <Sidebar 
        className="hidden border-r md:block" 
        // Remove the invalid 'collapsed' and 'onCollapsedChange' props
        // And use collapsible="icon" instead as per the component's API
        collapsible="icon"
      >
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <NavLink
              to="/"
              className="flex items-center gap-2 font-semibold"
            >
              <FileText className="h-6 w-6" />
              <span>Nomad Admin</span>
            </NavLink>
            <Button
              variant="outline"
              size="icon"
              className="ml-auto h-8 w-8"
              onClick={() => setCollapsed(!collapsed)}
            >
              <span className="sr-only">Toggle Sidebar</span>
              {collapsed ? (
                <Home className="h-4 w-4" />
              ) : (
                <Home className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium">
              <NavLink
                to="/"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  location.pathname === "/" && "bg-muted"
                )}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/quotes"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  location.pathname.includes("/quotes") && "bg-muted"
                )}
              >
                <FileText className="h-4 w-4" />
                <span>Quotes</span>
              </NavLink>
              <NavLink
                to="/confirmed-tours"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  location.pathname.includes("/confirmed-tours") && "bg-muted"
                )}
              >
                <Calendar className="h-4 w-4" />
                <span>Confirmed Tours</span>
              </NavLink>
              <NavLink
                to="/bookings"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  location.pathname.includes("/bookings") && "bg-muted"
                )}
              >
                <CreditCard className="h-4 w-4" />
                <span>Bookings</span>
              </NavLink>
              <NavLink
                to="/clients"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  location.pathname.includes("/clients") && "bg-muted"
                )}
              >
                <Users className="h-4 w-4" />
                <span>Clients</span>
              </NavLink>
              <NavLink
                to="/stats"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  location.pathname.includes("/stats") && "bg-muted"
                )}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Statistics</span>
              </NavLink>
              <NavLink
                to="/settings"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  location.pathname.includes("/settings") && "bg-muted"
                )}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </NavLink>
            </nav>
          </div>
        </div>
      </Sidebar>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
