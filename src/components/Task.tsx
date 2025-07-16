import { TaskType } from "@/types";
import React, { useState } from "react";

interface TaskCardProps {
  task: TaskType;
  onDelete: () => void;
  onEdit: (task: TaskType) => void;
}

export default function Task({ task, onDelete, onEdit }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  const handleEdit = () => {
    if (title.trim()) {
      onEdit({ ...task, title, description: description || undefined });
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white p-3 mb-2 rounded-lg shadow hover:shadow-md transition">
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-1 border rounded text-sm"
            placeholder="Task title"
            autoFocus
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-1 border rounded text-sm"
            placeholder="Task description (optional)"
          />
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div
            className="cursor-pointer flex-1"
            onClick={() => setIsEditing(true)}
          >
            <h3 className="font-medium text-sm">{task.title}</h3>
            {task.description && (
              <p className="text-gray-500 text-xs mt-1">{task.description}</p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete task "${task.title}"?`)) onDelete();
            }}
            className="text-red-500 hover:text-red-700 text-sm"
            aria-label={`Delete task ${task.title}`}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
