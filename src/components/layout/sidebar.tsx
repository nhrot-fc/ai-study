"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HomeIcon,
  InfoIcon,
  MailIcon,
  Settings2Icon,
  BookOpenIcon,
  BarChart2Icon,
  ChevronDownIcon,
  ChevronRightIcon,
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

const SidebarItem = ({ icon, label, isActive, href = "#" }: SidebarItemProps) => {
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

const SidebarCollapsible = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          <div className="flex items-center">
            {icon}
            <span className="ml-2">{label}</span>
          </div>
          {isOpen ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6 space-y-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
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
            />
            <SidebarItem
              icon={<InfoIcon className="h-4 w-4" />}
              label="About"
            />
            <SidebarItem
              icon={<MailIcon className="h-4 w-4" />}
              label="Contact"
            />
          </SidebarSection>

          <Separator className="my-2" />

          <SidebarSection title="Analytics">
            <SidebarCollapsible
              icon={<BarChart2Icon className="h-4 w-4" />}
              label="Reports"
            >
              <SidebarItem
                icon={<ChevronRightIcon className="h-4 w-4" />}
                label="Overview"
              />
              <SidebarItem
                icon={<ChevronRightIcon className="h-4 w-4" />}
                label="Statistics"
              />
            </SidebarCollapsible>
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
            />
          </SidebarSection>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
