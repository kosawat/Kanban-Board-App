export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  comments: Comment[];
}

export interface Column {
  id: string;
  title: string;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
}
