"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  BookOpen,
  Edit3,
  Trash2,
  Search,
  Clock,
  Users,
  BarChart3,
} from "lucide-react";

// Mock data for courses
const mockCourses = [
  {
    id: "1",
    title: "Introduction to React",
    description: "Learn the fundamentals of React development",
    chapters: 8,
    students: 124,
    progress: 75,
    lastUpdated: "2 days ago",
    color: "from-blue-500 to-purple-600",
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    description: "Master advanced TypeScript concepts and patterns",
    chapters: 12,
    students: 89,
    progress: 50,
    lastUpdated: "1 week ago",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    description: "Create beautiful and functional user interfaces",
    chapters: 6,
    students: 156,
    progress: 90,
    lastUpdated: "3 days ago",
    color: "from-green-500 to-blue-600",
  },
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses] = useState(mockCourses);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Course Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your course content
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4 mr-2" />
          Create New Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 rounded-full bg-primary/20">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">{courses.length}</h3>
          <p className="text-muted-foreground">Total Courses</p>
        </GlassCard>

        <GlassCard className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 rounded-full bg-secondary/20">
              <Users className="h-6 w-6 text-secondary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">
            {courses.reduce((sum, course) => sum + course.students, 0)}
          </h3>
          <p className="text-muted-foreground">Total Students</p>
        </GlassCard>

        <GlassCard className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 rounded-full bg-accent/20">
              <BarChart3 className="h-6 w-6 text-accent" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">
            {Math.round(
              courses.reduce((sum, course) => sum + course.progress, 0) /
                courses.length
            )}
            %
          </h3>
          <p className="text-muted-foreground">Avg. Progress</p>
        </GlassCard>
      </div>

      {/* Search and Filter */}
      <GlassCard>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass border-border/50"
            />
          </div>
        </div>
      </GlassCard>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <GlassCard
            key={course.id}
            className="group hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-up"
          >
            <div className="space-y-4">
              <div
                className={`h-32 rounded-lg bg-gradient-to-br ${course.color} p-4 flex items-center justify-center`}
                data-course-id={course.id}
              >
                <BookOpen className="h-12 w-12 text-white" />
              </div>

              {/* Course Info */}
              <div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {course.description}
                </p>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{course.chapters} chapters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{course.students} students</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                    data-progress={course.progress}
                  />
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Updated {course.lastUpdated}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <GlassCard className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by creating your first course"}
          </p>
          <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4 mr-2" />
            Create New Course
          </Button>
        </GlassCard>
      )}
    </div>
  );
}
