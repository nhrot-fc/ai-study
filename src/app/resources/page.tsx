"use client";

import React from "react";
import { APP_TITLE, PAGE_TITLES } from "@/lib/constants";
import { 
  Card,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  SearchIcon, 
  PlusIcon, 
  BookIcon, 
  FileTextIcon, 
  VideoIcon, 
  LinkIcon 
} from "lucide-react";

const ResourcesPage = () => {
  // Sample resources data
  const resources = [
    {
      id: "1",
      title: "Machine Learning Papers Collection",
      description: "A curated collection of important ML research papers.",
      type: "papers",
      tags: ["AI", "Research", "Academic"],
    },
    {
      id: "2",
      title: "Advanced CSS Techniques",
      description: "In-depth guide on modern CSS techniques and best practices.",
      type: "book",
      tags: ["CSS", "Frontend", "Design"],
    },
    {
      id: "3",
      title: "React State Management Explained",
      description: "Comprehensive video tutorial on React state management options.",
      type: "video",
      tags: ["React", "Tutorial", "State"],
    },
    {
      id: "4",
      title: "Effective TypeScript",
      description: "62 specific ways to improve your TypeScript code.",
      type: "book",
      tags: ["TypeScript", "Programming", "JavaScript"],
    }
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "book":
        return <BookIcon className="h-4 w-4" />;
      case "papers":
        return <FileTextIcon className="h-4 w-4" />;
      case "video":
        return <VideoIcon className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{PAGE_TITLES.RESOURCES}</h1>
          <p className="text-muted-foreground mt-2">
            Access and manage educational resources in the {APP_TITLE} platform
          </p>
        </div>
        <Button className="bg-gradient-secondary hover:glow-secondary">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search resources..." 
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <SearchIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="papers">Papers</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} icon={getResourceIcon(resource.type)} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="books">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {resources
              .filter((resource) => resource.type === "book")
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} icon={getResourceIcon(resource.type)} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="papers">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {resources
              .filter((resource) => resource.type === "papers")
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} icon={getResourceIcon(resource.type)} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="videos">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {resources
              .filter((resource) => resource.type === "video")
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} icon={getResourceIcon(resource.type)} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ResourceCardProps {
  resource: {
    id: string;
    title: string;
    description: string;
    type: string;
    tags: string[];
  };
  icon: React.ReactNode;
}

const ResourceCard = ({ resource, icon }: ResourceCardProps) => {
  return (
    <Card className="hover-animate card-glow">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="bg-muted p-2 rounded-full">{icon}</div>
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <CardTitle>{resource.title}</CardTitle>
        <CardDescription>{resource.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" className="w-full">View Resource</Button>
      </CardFooter>
    </Card>
  );
};

export default ResourcesPage;
