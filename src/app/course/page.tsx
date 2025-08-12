"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { DataTable } from "@/components/data-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, PlusIcon, LoaderIcon, BookIcon } from "lucide-react";

// Mocked data - In a real app you would fetch from an API
type CourseListItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  sectionCount: number;
  resourceCount: number;
};

const MOCK_COURSES: CourseListItem[] = [
  {
    id: "1",
    title: "Introduction to AI",
    description: "Learn the basics of artificial intelligence",
    createdAt: "2025-07-12T10:30:00Z",
    updatedAt: "2025-08-05T14:15:00Z",
    sectionCount: 5,
    resourceCount: 12,
  },
  {
    id: "2",
    title: "Web Development with React",
    description: "Master modern web development with React",
    createdAt: "2025-06-22T08:45:00Z",
    updatedAt: "2025-08-01T11:20:00Z",
    sectionCount: 8,
    resourceCount: 24,
  },
];

export default function CoursePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Simulate API call to fetch courses
    const loadCourses = async () => {
      try {
        // In a real app, you would fetch from an API
        // const response = await getCourses();
        // setCourses(response.data);
        setCourses(MOCK_COURSES);
        setError(null);
      } catch (err) {
        console.error("Error loading courses:", err);
        setError("Failed to load courses. Please try again.");
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "sectionCount",
      header: "Sections",
      cell: ({ row }: any) => (
        <div className="text-center">{row.getValue("sectionCount")}</div>
      ),
    },
    {
      accessorKey: "resourceCount",
      header: "Resources",
      cell: ({ row }: any) => (
        <div className="text-center">{row.getValue("resourceCount")}</div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }: any) => {
        const date = new Date(row.getValue("updatedAt"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const course = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/course/edit?id=${course.id}`)}
            >
              Edit
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/course/${course.id}`}>View</Link>
            </Button>
          </div>
        );
      },
    },
  ];

  // If still loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoaderIcon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If there was an error
  if (error) {
    return (
      <EmptyState
        title="Error"
        description={error}
        isError
        action={{
          label: "Try Again",
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Manage your learning courses and curriculum
          </p>
        </div>
        <Button onClick={() => router.push("/course/edit")}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="my">My Courses</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="pt-4">
          {courses.length === 0 ? (
            <EmptyState
              title="No courses found"
              description="No courses have been created yet."
              icon={<BookIcon className="h-6 w-6 text-muted-foreground" />}
              action={{
                label: "Create Course",
                onClick: () => router.push("/course/edit"),
              }}
            />
          ) : (
            <DataTable
              columns={columns}
              data={courses}
              searchColumn="title"
              searchPlaceholder="Search courses..."
            />
          )}
        </TabsContent>
        <TabsContent value="my" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Courses you manage</CardDescription>
            </CardHeader>
            <CardContent>
              {courses.length === 0 ? (
                <EmptyState
                  title="No personal courses"
                  description="You haven't created any courses yet."
                  icon={<BookOpen className="h-6 w-6 text-muted-foreground" />}
                  action={{
                    label: "Create Course",
                    onClick: () => router.push("/course/edit"),
                  }}
                />
              ) : (
                <DataTable
                  columns={columns}
                  data={courses.filter((_, i) => i < 1)} // Just showing fewer courses for demo
                  searchColumn="title"
                  searchPlaceholder="Search your courses..."
                />
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/course/edit")}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create New Course
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
