import type { FC } from "react";

import { AppSidebar } from "@/components/custom";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import React, { Fragment } from "react";

export const Layout: FC<{
  breadcrumbs: {
    title: string;
    url?: string;
  }[];
  children: React.ReactNode;
}> = React.memo(({ breadcrumbs, children }) => {
  const { user } = useAuth();
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => {
                  if (breadcrumb.url) {
                    return (
                      <Fragment key={index}>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href={breadcrumb.url}>
                            {breadcrumb.title}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                      </Fragment>
                    );
                  } else {
                    return (
                      <BreadcrumbItem key={index}>
                        <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                      </BreadcrumbItem>
                    );
                  }
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* role */}
          <div className="ml-auto flex items-center gap-2 pr-4 capitalize">
            <Badge
              className="rounded-sm border-blue-500 text-blue-600"
              variant={"outline"}
            >
              {user?.role.replace("_", " ")}
            </Badge>
          </div>
        </header>

        {/* content area */}
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col gap-4 p-4 pt-0 md:gap-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
});
