import { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, FolderOpen, Play, Workflow, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

interface AppLayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Workflows",
    url: "/workflows",
    icon: FolderOpen,
  },
  {
    title: "Runs",
    url: "/runs",
    icon: Play,
  },
];

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="none">
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Workflow className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-sidebar-primary">Agentic Builder</h2>
                <p className="text-xs text-sidebar-foreground/60">Workflow Automation</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2">
            <SidebarGroup className="py-4">
              <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50 px-2 mb-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={({ isActive }) =>
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator className="my-2" />

            <div className="px-4 py-3 space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-sidebar-accent/50">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-sidebar-foreground mb-1">
                    Quick Tip
                  </h3>
                  <p className="text-xs text-sidebar-foreground/70 leading-relaxed">
                    Use the visual editor to create workflows by dragging and connecting nodes.
                  </p>
                </div>
              </div>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t">
            <div className="p-4 text-xs text-sidebar-foreground/60 space-y-1">
              <div className="flex items-center justify-between">
                <span>Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="pt-2 text-sidebar-foreground/50">
                Built by Aditya
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col w-full">
          <header className="h-12 border-b bg-card flex items-center px-4">
            <SidebarTrigger />
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
