"use client";

import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { APP_TITLE, PAGE_TITLES } from "@/lib/constants";
import {
  SearchIcon,
  PlusIcon,
  BookOpenIcon,
  ArrowRightIcon,
} from "lucide-react";

const CoursesPage = () => {
  // Sample courses data
  const courses = [
    {
      id: "1",
      title: "Introduction to Machine Learning",
      description: "Learn the basics of ML algorithms and techniques.",
      enrolled: 1243,
      progress: 0,
      tags: ["AI", "Beginner", "Python"],
      image:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: "2",
      title: "Web Development Fundamentals",
      description: "HTML, CSS, JavaScript and more for beginners.",
      enrolled: 2456,
      progress: 65,
      tags: ["Web", "Frontend", "Beginner"],
      image:
        "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: "3",
      title: "Advanced React Patterns",
      description: "Master advanced React concepts and patterns.",
      enrolled: 980,
      progress: 34,
      tags: ["React", "Advanced", "Frontend"],
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
  ];

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {PAGE_TITLES.COURSES}
          </h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage your courses in the {APP_TITLE} platform
          </p>
        </div>
        <Button className="bg-gradient-primary hover:glow-primary">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search courses..." className="pl-9" />
        </div>
        <Button variant="outline">
          <SearchIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden hover-animate card-glow"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
                width={800}
                height={480}
              />
              {course.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <BookOpenIcon className="mr-2 h-4 w-4" />
                {course.enrolled} students enrolled
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="default" className="w-full">
                {course.progress > 0 ? "Continue" : "Start Learning"}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
