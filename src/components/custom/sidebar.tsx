import { NavMain, NavUser } from "@/components/custom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui";
import { sidebarData } from "@/constants/side-bar";
import { useAuth } from "@/hooks/use-auth";
import * as React from "react";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { user } = useAuth();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div
          className={`mt-2 flex items-end gap-2 overflow-hidden duration-100 ${
            open ? "translate-x-2" : ""
          }`}
        >
          <img
            src="/logo.png"
            alt="logo"
            width={100}
            height={100}
            className="h-8 w-8 rounded-md"
          />
          <p className="truncate text-xl font-medium">SimpLinkX</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "Guest",
            email: user?.email || "",
            role: user?.role || "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
