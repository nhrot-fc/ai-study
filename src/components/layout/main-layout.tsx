"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { BookOpen, GraduationCap, Library, User, Settings } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: GraduationCap, key: "dashboard" },
  { name: "Courses", href: "/courses", icon: BookOpen, key: "courses" },
  { name: "Resources", href: "/resources", icon: Library, key: "resources" },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-card border-b border-border/50">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CourseForge
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={
            "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transition-transform duration-300 lg:translate-x-0 translate-x-0"
          }
        >
          <GlassCard className="h-full rounded-none border-r border-border/50 p-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </GlassCard>
        </aside>

        {/* Main Content */}
        <main className={"flex-1 transition-all duration-300 lg:ml-64"}>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
