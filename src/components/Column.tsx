import React, { useState } from "react";
import { ColumnType } from "@/types";
import { useKanban } from "@/contexts/KanbanContext";
import Task from "./Task";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface ColumnProps {
  column: ColumnType;
}

export default function Column({ column }: ColumnProps) {
  const { state, dispatch } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const tasks = state.tasks.filter((task) => task.columnId === column.id);

  const handleRename = () => {
    if (title.trim()) {
      dispatch({ type: "RENAME_COLUMN", payload: { id: column.id, title } });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the "${column.title}" column? All tasks in this column will be deleted.`
      )
    ) {
      dispatch({ type: "DELETE_COLUMN", payload: { id: column.id } });
    }
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      dispatch({
        type: "ADD_TASK",
        payload: { title: newTaskTitle, columnId: column.id },
      });
      setNewTaskTitle("");
    }
  };

  return (
    <div
      className={`bg-gray-100 p-4 rounded-lg w-64 min-h-[200px] flex flex-col transition-colors ${
        isOver
          ? "border-2 border-blue-300 bg-blue-50"
          : "border border-transparent"
      }`}
      ref={setNodeRef}
    >
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename();
          }}
          className="w-full p-1 border rounded text-sm"
          autoFocus
        />
      ) : (
        <div className="flex justify-between items-center">
          <h2
            className="text-lg font-semibold cursor-pointer hover:text-blue-500"
            onClick={() => setIsEditing(true)}
          >
            {column.title}
          </h2>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-sm"
            aria-label={`Delete ${column.title} column`}
          >
            Delete
          </button>
        </div>
      )}
      {/* Tasks */}
      <div className="mt-4 flex-1">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No tasks yet</p>
        ) : (
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                onDelete={() =>
                  dispatch({ type: "DELETE_TASK", payload: { id: task.id } })
                }
                onEdit={(updatedTask) =>
                  dispatch({ type: "UPDATE_TASK", payload: updatedTask })
                }
              />
            ))}
          </SortableContext>
        )}
      </div>
      <div className="mt-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddTask();
          }}
          placeholder="New task title"
          className="w-full p-2 border rounded-lg text-sm"
        />
        <button
          onClick={handleAddTask}
          className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add Task
        </button>
      </div>
    </div>
  );
}
