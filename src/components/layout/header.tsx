"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ROUTES, APP_TITLE } from "@/lib/constants";
import Link from "next/link";
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
  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm flex items-center justify-between px-4 py-2">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gradient text-gradient-primary">{APP_TITLE}</h1>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <BellIcon className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Nickname</p>
                <p className="text-xs leading-none text-muted-foreground">
                  user@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
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
            <DropdownMenuItem>
              <HelpCircleIcon className="mr-2 h-4 w-4" />
              <span>Help</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              // Remove auth token and redirect to login
              // localStorage.removeItem('token');
              // router.push('/login');
            }}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
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
                <Button asChild variant="ghost" className="w-full justify-start">
                  <a href={ROUTES.HOME}>
                    <HomeIcon className="mr-2 h-4 w-4" />
                    Home
                  </a>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <a href={ROUTES.COURSES}>
                    <BookIcon className="mr-2 h-4 w-4" />
                    Courses
                  </a>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <a href={ROUTES.RESOURCES}>
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    Resources
                  </a>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <a href={ROUTES.SETTINGS}>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                  </a>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
