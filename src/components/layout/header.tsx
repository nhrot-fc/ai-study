"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ROUTES, APP_TITLE } from "@/lib/constants";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MenuIcon,
  UserIcon,
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon,
  BellIcon,
  BookIcon,
  HomeIcon,
  FileTextIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm flex items-center justify-between px-4 py-2">
      <div className="flex items-center">
        <Link href={ROUTES.HOME}>
          <h1 className="text-xl font-bold text-gradient text-gradient-primary">
            {APP_TITLE}
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Notification button - shown to all users */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <BellIcon className="h-5 w-5" />
        </Button>

        {/* Mobile menu button - always visible on mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigation options for mobile view.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <div className="space-y-1">
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Link href={ROUTES.HOME}>
                      <HomeIcon className="mr-2 h-4 w-4" />
                      Home
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Link href={ROUTES.COURSES}>
                      <BookIcon className="mr-2 h-4 w-4" />
                      Courses
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Link href={ROUTES.RESOURCES}>
                      <FileTextIcon className="mr-2 h-4 w-4" />
                      Resources
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Link href={ROUTES.SETTINGS}>
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </Button>

                  {/* Authentication options in mobile menu */}
                  {isAuthenticated ? (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={async () => {
                        await logout();
                      }}
                    >
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  ) : (
                    <>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <Link href={ROUTES.LOGIN}>
                          <LogOutIcon className="mr-2 h-4 w-4" />
                          Log in
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* User profile dropdown - only shown when authenticated */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.avatar_url || ""}
                    alt={user?.nickname || "User"}
                  />
                  <AvatarFallback>
                    {user?.nickname?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.nickname || "Guest"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "Not logged in"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={ROUTES.SETTINGS}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={ROUTES.SETTINGS}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#">
                  <HelpCircleIcon className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await logout();
                }}
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Login button for non-authenticated users (hidden on mobile)
          <Button asChild variant="outline" className="hidden md:flex">
            <Link href={ROUTES.LOGIN}>Log in</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
