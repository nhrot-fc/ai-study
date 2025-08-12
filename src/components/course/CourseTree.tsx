"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "./ProgressBar";
import { CourseSectionNode, Attachment } from "./types";

interface CourseTreeProps {
  sections: CourseSectionNode[];
  onRenameSection: (id: string, title: string) => void;
  onAddChild: (parentId: string) => void;
  onReorder: (
    parentId: string | null,
    activeId: string,
    overId: string
  ) => void;
}

export const CourseTree = ({
  sections,
  onRenameSection,
  onAddChild,
  onReorder,
}: CourseTreeProps) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<string>("");

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const SectionRow = ({
    node,
    parentId,
    depth = 0,
  }: {
    node: CourseSectionNode;
    parentId: string | null;
    depth?: number;
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: `section-${node.id}`,
      data: { type: "COURSE_SECTION", parentId },
    });

    const { setNodeRef: setDropRef, isOver } = useDroppable({
      id: `drop-course-section-${node.id}`,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const hasChildren = (node.children?.length ?? 0) > 0;
    const isOpen = expanded.has(node.id);

    const startEdit = () => {
      setEditing(node.id);
      setDraft(node.title);
    };
    const commitEdit = () => {
      if (editing === node.id) {
        onRenameSection(node.id, draft.trim() || node.title);
        setEditing(null);
      }
    };

    return (
      <div className="px-2 py-1">
        <div
          ref={setNodeRef}
          style={style}
          className={"rounded-lg " + (isDragging ? "opacity-70" : "")}
        >
          <div
            ref={setDropRef}
            className={`flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-accent focus-within:ring-2 focus-within:ring-ring ${
              isOver ? "ring-2 ring-ring bg-accent" : ""
            }`}
            style={{ paddingLeft: depth * 12 + 8 }}
          >
            <button
              className="h-5 w-5 flex items-center justify-center"
              onClick={() => hasChildren && toggle(node.id)}
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              {hasChildren ? (
                isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              ) : (
                <span className="inline-block w-4" />
              )}
            </button>
            <span
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" />
            </span>
            <div className="flex-1 min-w-0">
              {editing === node.id ? (
                <Input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                  className="h-8"
                />
              ) : (
                <div
                  className="truncate text-sm font-medium"
                  onDoubleClick={startEdit}
                  title="Double-click to rename"
                >
                  {node.title}
                </div>
              )}
              <div className="mt-1">
                <ProgressBar value={node.progress} />
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onAddChild(node.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Attachments */}
          {node.attachments.length > 0 && (
            <div
              className="pl-10 pr-2 mt-1 space-y-1"
              style={{ paddingLeft: depth * 12 + 38 }}
            >
              {node.attachments.map((a: Attachment) => (
                <div
                  key={a.id}
                  className="text-xs rounded-md border bg-card px-2 py-1 flex items-center gap-2"
                >
                  <Paperclip className="h-3 w-3" />
                  <span className="truncate">
                    {a.resourceTitle} ▸ {a.resourceSectionTitle}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && isOpen && (
          <div className="mt-1">
            <SortableContext
              items={(node.children || []).map((c) => `section-${c.id}`)}
              strategy={verticalListSortingStrategy}
            >
              {node.children!.map((child) => (
                <SectionRow
                  key={child.id}
                  node={child}
                  parentId={node.id}
                  depth={depth + 1}
                />
              ))}
            </SortableContext>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <SortableContext
        items={sections.map((s) => `section-${s.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {sections.map((s) => (
          <SectionRow key={s.id} node={s} parentId={null} />
        ))}
      </SortableContext>
    </div>
  );
};
