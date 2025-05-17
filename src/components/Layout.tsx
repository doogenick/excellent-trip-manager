
import { AppSidebar } from "./AppSidebar";
import { Toaster } from "./ui/toaster";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <header className="p-4 border-b">
              <SidebarTrigger />
            </header>
            <main className="flex-1">
              {children}
              <Toaster />
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
