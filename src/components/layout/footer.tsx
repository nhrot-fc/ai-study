"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { SiGithub, SiX, SiInstagram } from "@icons-pack/react-simple-icons";

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background p-4">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; 2025 My App. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <SiGithub className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <SiX className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <SiInstagram className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
