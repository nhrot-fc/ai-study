export interface Attachment {
  id: string;
  resourceTitle: string;
  resourceSectionTitle: string;
}

export interface CourseSectionNode {
  id: string;
  title: string;
  description?: string;
  order: number;
  progress: number;
  children?: CourseSectionNode[];
  attachments: Attachment[];
}
