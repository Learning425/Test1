export interface Note {
  id: string;
  title: string;
  content: string;
  images: string[];
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  pinnedAt?: number;
  labels: string[];
  isPasswordProtected?: boolean;
  passwordHash?: string;
  sharedWith?: SharedUser[];
  ownerId?: string;
  readOnly?: boolean;
}

export interface SharedUser {
  email: string;
  canEdit: boolean;
  sharedAt: number;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export type ViewMode = 'grid' | 'list';