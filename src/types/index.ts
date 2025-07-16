export interface TaskType {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  comments: CommentType[];
}

export interface ColumnType {
  id: string;
  title: string;
}

export interface CommentType {
  id: string;
  content: string;
  taskId: string;
  parentId?: string; // For sub-comment
  children?: CommentType[]; // For nested sub-comments
}
