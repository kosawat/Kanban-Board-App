"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ColumnType, TaskType } from "../types";
import { generateId } from "../utils/uuid";

interface KanbanState {
  columns: ColumnType[];
  tasks: TaskType[];
  selectedTaskId: string | null; // For keyboard navigation
}

type Action =
  | { type: "ADD_COLUMN"; payload: { title: string } }
  | { type: "RENAME_COLUMN"; payload: { id: string; title: string } }
  | { type: "DELETE_COLUMN"; payload: { id: string } }
  | {
      type: "ADD_TASK";
      payload: { title: string; columnId: string; description?: string };
    }
  | { type: "UPDATE_TASK"; payload: TaskType }
  | { type: "DELETE_TASK"; payload: { id: string } }
  | {
      type: "ADD_COMMENT";
      payload: { taskId: string; content: string; parentId?: string };
    }
  | { type: "UPDATE_COMMENT"; payload: { id: string; content: string } }
  | { type: "DELETE_COMMENT"; payload: { id: string } }
  | {
      type: "MOVE_TASK";
      payload: { taskId: string; targetColumnId: string; targetIndex: number };
    }
  | { type: "SELECT_TASK"; payload: { taskId: string | null } };

interface KanbanContextType {
  state: KanbanState;
  dispatch: React.Dispatch<Action>;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

const initialState: KanbanState = {
  columns: [
    { id: generateId(), title: "To Do" },
    { id: generateId(), title: "In Progress" },
    { id: generateId(), title: "Done" },
  ],
  tasks: [],
  selectedTaskId: null,
};

function kanbanReducer(state: KanbanState, action: Action): KanbanState {
  switch (action.type) {
    case "ADD_COLUMN":
      return {
        ...state,
        columns: [
          ...state.columns,
          { id: generateId(), title: action.payload.title },
        ],
      };
    case "RENAME_COLUMN":
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.id === action.payload.id
            ? { ...col, title: action.payload.title }
            : col
        ),
      };
    case "DELETE_COLUMN":
      return {
        ...state,
        columns: state.columns.filter((col) => col.id !== action.payload.id),
        tasks: state.tasks.filter(
          (task) => task.columnId !== action.payload.id
        ),
        selectedTaskId:
          state.tasks.find((task) => task.id === state.selectedTaskId)
            ?.columnId === action.payload.id
            ? null
            : state.selectedTaskId,
      };
    case "ADD_TASK":
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: generateId(),
            title: action.payload.title,
            description: action.payload.description,
            columnId: action.payload.columnId,
            comments: [],
          },
        ],
      };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id),
        selectedTaskId:
          state.selectedTaskId === action.payload.id
            ? null
            : state.selectedTaskId,
      };
    case "ADD_COMMENT":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId
            ? {
                ...task,
                comments: [
                  ...task.comments,
                  {
                    id: generateId(),
                    content: action.payload.content,
                    taskId: action.payload.taskId,
                    parentId: action.payload.parentId,
                  },
                ],
              }
            : task
        ),
      };
    case "UPDATE_COMMENT":
      return {
        ...state,
        tasks: state.tasks.map((task) => ({
          ...task,
          comments: task.comments.map((comment) =>
            comment.id === action.payload.id
              ? { ...comment, content: action.payload.content }
              : comment
          ),
        })),
      };
    case "DELETE_COMMENT":
      return {
        ...state,
        tasks: state.tasks.map((task) => ({
          ...task,
          comments: task.comments.filter(
            (comment) => comment.id !== action.payload.id
          ),
        })),
      };
    case "MOVE_TASK":
      const { taskId, targetColumnId, targetIndex } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task) return state;

      // Remove task from current position
      const tasksWithoutMoved = state.tasks.filter((t) => t.id !== taskId);
      // Update task's columnId
      const updatedTask = { ...task, columnId: targetColumnId };
      // Get tasks in the target column
      const targetColumnTasks = tasksWithoutMoved.filter(
        (t) => t.columnId === targetColumnId
      );
      // Insert task at the target index
      targetColumnTasks.splice(targetIndex, 0, updatedTask);
      // Combine tasks from target column with tasks from other columns
      const otherColumnTasks = tasksWithoutMoved.filter(
        (t) => t.columnId !== targetColumnId
      );
      return {
        ...state,
        tasks: [...otherColumnTasks, ...targetColumnTasks],
        selectedTaskId: taskId, // Keep task selected after move
      };
    case "SELECT_TASK":
      return {
        ...state,
        selectedTaskId: action.payload.taskId,
      };
    default:
      return state;
  }
}

export function KanbanProvider({ children }: { children: ReactNode }) {
  const [persistedState, setPersistedState] = useLocalStorage<KanbanState>(
    "kanban-state",
    initialState
  );
  const [state, dispatch] = useReducer(kanbanReducer, persistedState);

  // Sync state with localStorage whenever it changes
  useEffect(() => {
    setPersistedState(state);
  }, [state, setPersistedState]);

  return (
    <KanbanContext.Provider value={{ state, dispatch }}>
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
}
