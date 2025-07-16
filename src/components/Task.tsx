import { TaskType } from "@/types";
import React, { useState } from "react";
import TaskModal from "./modals/TaskModal";

interface TaskCardProps {
  task: TaskType;
  onDelete: () => void;
  onEdit: (task: TaskType) => void;
}

export default function Task({ task, onDelete, onEdit }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="bg-white p-3 mb-2 rounded-lg shadow hover:shadow-md transition"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex justify-between items-center">
          <div className="flex-1">
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
      </div>
      <TaskModal
        task={task}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={onEdit}
      />
    </>
  );
}
