import React, { useState } from "react";
// import Task from "./Task";
import { ColumnType } from "@/types";
import { useKanban } from "@/contexts/KanbanContext";

interface ColumnProps {
  column: ColumnType;
}

export default function Column({ column }: ColumnProps) {
  const { dispatch } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

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

  return (
    <div className="bg-gray-100 p-4 rounded-lg w-64 min-h-[200px] flex flex-col">
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
      {/* Placeholder for tasks, to be implemented later */}
      <div className="mt-4 flex-1">
        <p className="text-gray-500 text-sm">No tasks yet</p>
      </div>
    </div>
  );
}
