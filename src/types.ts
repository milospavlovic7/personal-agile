export interface Subtask {
  id: string;
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  description: string;
  categoryId: string;
  subcategoryId: string; // Defaults to "General"
  sprintWeek: string | null; // e.g., "2026-W21", or null for backlog
  status: 'backlog' | 'tasks' | 'in_progress' | 'done';
  priority: number | null; // 1 | 2 | 3 | 4 | null
  notes: string;
  effort: string | null; // 'XS' | 'S' | 'M' | 'L' | 'XL' | null
  pinned: boolean;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Subcategory {
  id: string;
  name: string;
  order: number;
  description?: string;
}
