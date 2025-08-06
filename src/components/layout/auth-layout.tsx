"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import PageLayout from "./page-layout";

// List of paths that don't require authentication and should use a blank layout
const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { isLoading } = useAuth();
  const pathname = usePathname();

  // Check if the current path is a public path
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // If we're loading auth status, we could show a loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For public paths like login, we use a minimal layout
  if (isPublicPath) {
    return (
      <div className="min-h-screen flex flex-col bg-background">{children}</div>
    );
  }

  // For protected paths, check if user is authenticated
  // If not, the user will be redirected in the page component using middleware or client-side redirection
  return <PageLayout>{children}</PageLayout>;
};

export default AuthLayout;
