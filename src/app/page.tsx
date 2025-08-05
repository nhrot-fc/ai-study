"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GlobeIcon, FileIcon, LayoutIcon } from "lucide-react";

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod
          nunc non risus congue, vel scelerisque nibh hendrerit.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          Learn more
        </Button>
      </CardFooter>
    </Card>
  );
};

const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to My App</h1>
        <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          A modern web application built with Next.js, Tailwind CSS, and
          shadcn/ui
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<GlobeIcon className="h-6 w-6 text-primary" />}
          title="Global Access"
          description="Access your content from anywhere in the world."
        />
        <FeatureCard
          icon={<FileIcon className="h-6 w-6 text-primary" />}
          title="File Management"
          description="Manage all your files in one centralized location."
        />
        <FeatureCard
          icon={<LayoutIcon className="h-6 w-6 text-primary" />}
          title="Modern Interface"
          description="Enjoy a clean, intuitive and responsive design."
        />
      </div>

      <div className="flex justify-center mt-8">
        <Button size="lg">Get Started</Button>
      </div>
    </div>
  );
};

export default HomePage;
