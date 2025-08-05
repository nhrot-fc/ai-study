"use client";

import React from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import Footer from "./footer";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main
          className={cn(
            "flex-1 p-4 sm:p-6 overflow-auto",
            "transition-all duration-300 ease-in-out"
          )}
        >
          <div className="container mx-auto py-4">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PageLayout;
