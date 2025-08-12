"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CourseTree } from "@/components/course/CourseTree";
import { CourseSectionNode } from "@/components/course/types";
import { toast } from "sonner";

export default function CourseEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const isNew = !courseId;

  const [title, setTitle] = useState(isNew ? "" : "Course Title");
  const [description, setDescription] = useState(
    isNew ? "" : "Course Description"
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [sections, setSections] = useState<CourseSectionNode[]>([
    {
      id: "1",
      title: "Getting Started",
      description: "Introduction to the course",
      order: 0,
      progress: 0,
      attachments: [],
      children: [
        {
          id: "1-1",
          title: "Welcome",
          order: 0,
          progress: 0,
          attachments: [],
        },
        {
          id: "1-2",
          title: "Course Overview",
          order: 1,
          progress: 0,
          attachments: [
            {
              id: "att-1",
              resourceTitle: "Introduction Video",
              resourceSectionTitle: "Welcome Video",
            },
          ],
        },
      ],
    },
    {
      id: "2",
      title: "Fundamentals",
      description: "Basic concepts",
      order: 1,
      progress: 0,
      attachments: [],
    },
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { id } = event.active;
    setActiveId(id.toString());
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    // Return early if we have no over item
    if (!over) return;

    // Extract IDs and data
    const activeId = active.id.toString().replace("section-", "");
    const overId = over.id.toString().replace("section-", "");

    // Skip if it's the same item
    if (activeId === overId) return;

    const activeData = active.data.current;

    // Check if we need to move an item between different parents
    if (
      activeData?.type === "COURSE_SECTION" &&
      over.id.toString().startsWith("drop-course-section-")
    ) {
      // This indicates we're hovering over a droppable area of another section
      // We'll handle the reparenting in handleDragEnd
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id !== over.id) {
      // Extract the section IDs from the identifiers
      const activeId = active.id.toString().replace("section-", "");

      // Check if we're dropping onto a droppable zone (for reparenting)
      if (over.id.toString().startsWith("drop-course-section-")) {
        // This is a reparent operation
        const newParentId = over.id
          .toString()
          .replace("drop-course-section-", "");
        const oldParentId = active.data.current?.parentId;

        // Handle the move between different parents
        setSections((prevSections) => {
          // First, find and remove the item from its old location
          let itemToMove: CourseSectionNode | null = null;

          // Function to recursively remove the item from its source
          const removeItem = (
            sections: CourseSectionNode[]
          ): CourseSectionNode[] => {
            if (!oldParentId) {
              // Item is at root level
              const itemIndex = sections.findIndex((s) => s.id === activeId);
              if (itemIndex >= 0) {
                itemToMove = sections[itemIndex];
                return [
                  ...sections.slice(0, itemIndex),
                  ...sections.slice(itemIndex + 1),
                ];
              }
              return sections;
            } else {
              // Item is in a nested level
              return sections.map((section) => {
                if (section.id === oldParentId && section.children) {
                  const itemIndex = section.children.findIndex(
                    (s) => s.id === activeId
                  );
                  if (itemIndex >= 0) {
                    itemToMove = section.children[itemIndex];
                    return {
                      ...section,
                      children: [
                        ...section.children.slice(0, itemIndex),
                        ...section.children.slice(itemIndex + 1),
                      ],
                    };
                  }
                }

                if (section.children) {
                  return {
                    ...section,
                    children: removeItem(section.children),
                  };
                }

                return section;
              });
            }
          };

          // First pass: remove the item from its old location
          const updatedSections = removeItem([...prevSections]);

          if (!itemToMove) return prevSections;

          // Second pass: add the item to its new parent
          const addItem = (
            sections: CourseSectionNode[]
          ): CourseSectionNode[] => {
            return sections.map((section) => {
              if (section.id === newParentId) {
                const children = section.children || [];
                return {
                  ...section,
                  children: [
                    ...children,
                    { ...itemToMove!, order: children.length },
                  ],
                };
              }

              if (section.children) {
                return {
                  ...section,
                  children: addItem(section.children),
                };
              }

              return section;
            });
          };

          // If the new parent is the root level
          if (newParentId === "root") {
            return [
              ...updatedSections,
              { ...itemToMove!, order: updatedSections.length },
            ];
          }

          // Add the item to its new parent
          return addItem(updatedSections);
        });
      } else {
        // This is a regular reorder operation within the same parent
        const overId = over.id.toString().replace("section-", "");
        const parentId = active.data.current?.parentId;

        setSections((prevSections) => {
          // Handle root level reordering
          if (!parentId) {
            const oldIndex = prevSections.findIndex((s) => s.id === activeId);
            const newIndex = prevSections.findIndex((s) => s.id === overId);

            if (oldIndex !== -1 && newIndex !== -1) {
              return arrayMove(prevSections, oldIndex, newIndex);
            }
          } else {
            // Handle nested reordering
            return prevSections.map((section) => {
              if (section.id === parentId && section.children) {
                const oldIndex = section.children.findIndex(
                  (s) => s.id === activeId
                );
                const newIndex = section.children.findIndex(
                  (s) => s.id === overId
                );

                if (oldIndex !== -1 && newIndex !== -1) {
                  return {
                    ...section,
                    children: arrayMove(section.children, oldIndex, newIndex),
                  };
                }
              }

              // Recursively check for the parent in deeper children
              if (section.children) {
                return {
                  ...section,
                  children: section.children.map((child) => {
                    // Recursion for nested children if needed
                    return child;
                  }),
                };
              }

              return section;
            });
          }

          return prevSections;
        });
      }
    }

    setActiveId(null);
  };

  const handleAddSection = () => {
    const newSection: CourseSectionNode = {
      id: uuidv4(),
      title: "New Section",
      order: sections.length,
      progress: 0,
      attachments: [],
    };

    setSections([...sections, newSection]);
  };

  const handleAddChild = (parentId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === parentId) {
          const children = section.children || [];
          const newChild: CourseSectionNode = {
            id: `${parentId}-${children.length + 1}`,
            title: "New Subsection",
            order: children.length,
            progress: 0,
            attachments: [],
          };

          return {
            ...section,
            children: [...children, newChild],
          };
        } else if (section.children) {
          // Check in nested children
          const updatedChildren = addChildToNestedSection(
            section.children,
            parentId
          );
          if (updatedChildren !== section.children) {
            return { ...section, children: updatedChildren };
          }
        }
        return section;
      })
    );
  };

  const addChildToNestedSection = (
    children: CourseSectionNode[],
    parentId: string
  ): CourseSectionNode[] => {
    return children.map((child) => {
      if (child.id === parentId) {
        const subChildren = child.children || [];
        const newChild: CourseSectionNode = {
          id: `${parentId}-${subChildren.length + 1}`,
          title: "New Subsection",
          order: subChildren.length,
          progress: 0,
          attachments: [],
        };

        return {
          ...child,
          children: [...subChildren, newChild],
        };
      } else if (child.children) {
        // Recursively check deeper children
        const updatedChildren = addChildToNestedSection(
          child.children,
          parentId
        );
        if (updatedChildren !== child.children) {
          return { ...child, children: updatedChildren };
        }
      }
      return child;
    });
  };

  const handleRenameSection = (id: string, title: string) => {
    const updateSectionTitle = (
      sections: CourseSectionNode[]
    ): CourseSectionNode[] => {
      return sections.map((section) => {
        if (section.id === id) {
          return { ...section, title };
        } else if (section.children) {
          return {
            ...section,
            children: updateSectionTitle(section.children),
          };
        }
        return section;
      });
    };

    setSections((prevSections) => updateSectionTitle(prevSections));
  };

  const handleSaveCourse = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Please provide a course title");
      return;
    }

    // Here you would implement the actual save functionality
    // using an API call to save the course data
    toast.success(
      isNew ? "Course created successfully" : "Course updated successfully"
    );

    // Redirect to the course management page after save
    // router.push("/course");
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          {isEditingTitle ? (
            <Input
              autoFocus
              value={title}
              placeholder={isNew ? "New course title" : "Course title"}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditingTitle(false);
                if (e.key === "Escape") setIsEditingTitle(false);
              }}
              className="h-10 text-3xl font-bold tracking-tight"
            />
          ) : (
            <h1
              className="text-3xl font-bold tracking-tight cursor-text"
              onDoubleClick={() => setIsEditingTitle(true)}
              title="Doble clic para editar el título"
            >
              {title.trim() ||
                (isNew ? "Nuevo curso sin título" : "Curso sin título")}
            </h1>
          )}

          {isEditingDesc ? (
            <Textarea
              autoFocus
              value={description}
              placeholder="Añade una descripción del curso"
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setIsEditingDesc(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsEditingDesc(false);
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter")
                  setIsEditingDesc(false);
              }}
              className="min-h-10"
            />
          ) : (
            <p
              className="text-muted-foreground cursor-text"
              onDoubleClick={() => setIsEditingDesc(true)}
              title="Doble clic para editar la descripción"
            >
              {description.trim()
                ? description
                : isNew
                ? "Describe tu curso (doble clic para editar)"
                : "Añade o edita la descripción (doble clic)"}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSaveCourse}>
            {isNew ? "Create Course" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <Tabs defaultValue="structure" className="flex-1">
          <TabsList>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          <TabsContent value="structure" className="pt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Course Structure</CardTitle>
                <Button size="sm" onClick={handleAddSection}>
                  Add Section
                </Button>
              </CardHeader>
              <CardContent>
                <DndContext
                  sensors={sensors}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                >
                  <CourseTree
                    sections={sections}
                    onRenameSection={handleRenameSection}
                    onAddChild={handleAddChild}
                    onReorder={() => {
                      // This is called when a section is moved between levels
                      // The logic is handled in handleDragEnd
                    }}
                  />
                  <DragOverlay>
                    {activeId ? (
                      <div className="p-2 bg-card border rounded shadow-lg">
                        {/* You can render a preview of the dragged item here */}
                        Dragging section...
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="resources" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage course resources and attachments here.
                </p>
                {/* Resource management UI would go here */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
