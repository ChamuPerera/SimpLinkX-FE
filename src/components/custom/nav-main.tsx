import type { IconProps } from "@radix-ui/react-icons/dist/types";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { IconType } from "react-icons/lib";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?:
      | LucideIcon
      | ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
      | IconType;
    isActive?: boolean;
    permissions?: string[];
    items?: {
      title: string;
      url: string;
      permissions?: string[];
    }[];
  }[];
}) {
  const [hash, setHash] = useState<string | null>(null);
  // get url
  const location = useLocation();
  const { pathname } = location;

  // update hash
  useEffect(() => {
    setHash(location.hash);
  }, [location.hash]);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          // if submenu available
          if (item.items) {
            return (
              <PermissionWrapper
                key={item.title}
                permissions={item.permissions ?? null}
              >
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <PermissionWrapper
                            key={subItem.title}
                            permissions={subItem.permissions ?? null}
                          >
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                asChild
                                isActive={
                                  hash
                                    ? `${pathname}${hash}` === subItem.url
                                    : pathname === subItem.url
                                }
                              >
                                <Link to={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </PermissionWrapper>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </PermissionWrapper>
            );
          } else {
            // if submenu not available
            return (
              <PermissionWrapper
                key={item.title}
                permissions={item.permissions ?? null}
              >
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link to={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </PermissionWrapper>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
