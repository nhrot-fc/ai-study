"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  HomeIcon,
  BookIcon,
  FileTextIcon,
  Settings2Icon,
  BookOpenIcon,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  href?: string;
}

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

const SidebarItem = ({
  icon,
  label,
  isActive,
  href = "#",
}: SidebarItemProps) => {
  return (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      className={cn("w-full justify-start")}
    >
      <a href={href}>
        {icon}
        <span className="ml-2">{label}</span>
      </a>
    </Button>
  );
};

const SidebarSection = ({ title, children }: SidebarSectionProps) => {
  return (
    <div className="py-2">
      <h3 className="px-4 py-1 text-sm font-medium text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-full border-r bg-background">
      <ScrollArea className="h-full">
        <div className="py-4 px-2">
          <SidebarSection title="Navigation">
            <SidebarItem
              icon={<HomeIcon className="h-4 w-4" />}
              label="Home"
              isActive={true}
              href={ROUTES.HOME}
            />
            <SidebarItem
              icon={<BookIcon className="h-4 w-4" />}
              label="Courses"
              href={ROUTES.COURSES}
            />
            <SidebarItem
              icon={<FileTextIcon className="h-4 w-4" />}
              label="Resources"
              href={ROUTES.RESOURCES}
            />
          </SidebarSection>

          <Separator className="my-2" />

          <SidebarSection title="Others">
            <SidebarItem
              icon={<BookOpenIcon className="h-4 w-4" />}
              label="Documentation"
            />
            <SidebarItem
              icon={<Settings2Icon className="h-4 w-4" />}
              label="Settings"
              href={ROUTES.SETTINGS}
            />
          </SidebarSection>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
