"use client";

import {
  CheckSquare,
  CreditCard,
  LayoutDashboard,
  ListTodo,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { authClient } from "@/lib/auth-client";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Tarefas",
      url: "/tasks",
      icon: ListTodo,
    },
    {
      title: "Planos",
      url: "/plans-admin",
      icon: CreditCard,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user
    ? {
        name: session.user.name ?? "Usuário",
        email: session.user.email ?? "",
        image:
          session.user.image ??
          `https://api.dicebear.com/10.x/adventurer-neutral/svg?seed=${session.user.name}`,
      }
    : null;
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CheckSquare className="size-5!" />
                <span className="text-base font-semibold">TodoApp</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {!isPending && user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
