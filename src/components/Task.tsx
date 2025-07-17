import { TaskType } from "@/types";
import React, { useState } from "react";
import TaskModal from "./modals/TaskModal";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useKanban } from "@/contexts/KanbanContext";

// Props for the Task component
interface TaskProps {
  task: TaskType;
  onDelete: () => void; // Callback to delete the task
  onEdit: (task: TaskType) => void; // Callback to update the task
}

export default function Task({ task, onDelete, onEdit }: TaskProps) {
  const { state, dispatch } = useKanban();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Configure drag-and-drop with @dnd-kit/sortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const isSelected = state.selectedTaskId === task.id;

  // Apply styles for drag-and-drop animations
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    opacity: isDragging ? 0.6 : 1, // Reduce opacity during drag
    boxShadow: isDragging ? "0 8px 16px rgba(0, 0, 0, 0.2)" : undefined, // Stronger shadow during drag
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-white p-3 mb-2 rounded-lg shadow hover:shadow-md transition ${
          isSelected ? "border-2 border-blue-500" : "border border-transparent"
        }`}
        onClick={() => {
          dispatch({ type: "SELECT_TASK", payload: { taskId: task.id } });
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h3 className="font-medium text-sm">{task.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {/* Drag handle for drag-and-drop */}
            <button
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label="Drag handle"
            >
              <GripVertical size={16} />
            </button>

            {/* Button to open task details modal */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click from triggering
                setIsModalOpen(true);
              }}
              className="text-blue-500 hover:text-blue-700 text-xs"
              aria-label={`View details for task ${task.title}`}
            >
              Details
            </button>

            {/* Button to delete task with confirmation */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click from triggering
                if (window.confirm(`Delete task "${task.title}"?`)) onDelete();
              }}
              className="text-red-500 hover:text-red-700 text-xs"
              aria-label={`Delete task ${task.title}`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Modal for task details and comments */}
      <TaskModal
        task={task}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={onEdit}
      />
    </>
  );
}
