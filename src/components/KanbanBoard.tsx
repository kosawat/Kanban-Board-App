"use client";

import { useKanban } from "@/contexts/KanbanContext";
import React, { useEffect, useState } from "react";
import Column from "./Column";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import Task from "./Task";

export default function KanbanBoard() {
  const { state, dispatch } = useKanban();
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [draggedTask, setDraggedTask] = useState<UniqueIdentifier | null>(null);

  // Add a new column with validation
  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      dispatch({ type: "ADD_COLUMN", payload: { title: newColumnTitle } });
      setNewColumnTitle("");
    }
  };

  // Handle drag start to track the dragged task for overlay
  const handleDragStart = (event: DragStartEvent) => {
    setDraggedTask(event.active.id);
  };

  // Handle drag end to move tasks between or within columns
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedTask(null);
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Determine if the drop target is a column or a task
    const isOverColumn = state.columns.some((col) => col.id === overId);
    const isOverTask = state.tasks.some((task) => task.id === overId);

    if (!isOverColumn && !isOverTask) return;

    let targetColumnId: string;
    let targetIndex: number;
    let targetColumnTasks;

    if (isOverColumn) {
      // Dropped directly on a column
      targetColumnId = overId;
      targetColumnTasks = state.tasks.filter(
        (task) => task.columnId === targetColumnId
      );
      targetIndex = targetColumnTasks.length; // Append to end of column
    } else {
      // Dropped on a task
      const overTask = state.tasks.find((task) => task.id === overId)!;
      targetColumnId = overTask.columnId;
      targetColumnTasks = state.tasks.filter(
        (task) => task.columnId === targetColumnId
      );
      const overIndex = targetColumnTasks.findIndex(
        (task) => task.id === overId
      );

      // Adjust index based on drag direction (above or below)
      const activeRect = active.rect.current.translated;
      const overRect = over.rect;
      const isDraggingDown =
        activeRect && overRect && activeRect.top < overRect.top;

      targetIndex = isDraggingDown ? overIndex + 1 : overIndex;
    }

    dispatch({
      type: "MOVE_TASK",
      payload: { taskId, targetColumnId, targetIndex },
    });
  };

  // Handle keyboard navigation for selected task
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!state.selectedTaskId) return;

    const task = state.tasks.find((t) => t.id === state.selectedTaskId);
    if (!task) return;

    const currentColumnId = task.columnId;
    const currentColumnTasks = state.tasks.filter(
      (t) => t.columnId === currentColumnId
    );
    const currentIndex = currentColumnTasks.findIndex((t) => t.id === task.id);
    const columnIds = state.columns.map((col) => col.id);
    const currentColumnIndex = columnIds.indexOf(currentColumnId);

    switch (event.key) {
      case "ArrowUp":
        if (currentIndex > 0) {
          dispatch({
            type: "MOVE_TASK",
            payload: {
              taskId: task.id,
              targetColumnId: currentColumnId,
              targetIndex: currentIndex - 1,
            },
          });
        }
        break;
      case "ArrowDown":
        if (currentIndex < currentColumnTasks.length - 1) {
          dispatch({
            type: "MOVE_TASK",
            payload: {
              taskId: task.id,
              targetColumnId: currentColumnId,
              targetIndex: currentIndex + 1,
            },
          });
        }
        break;
      case "ArrowLeft":
        if (currentColumnIndex > 0) {
          const targetColumnId = columnIds[currentColumnIndex - 1];
          const targetColumnTasks = state.tasks.filter(
            (t) => t.columnId === targetColumnId
          );
          dispatch({
            type: "MOVE_TASK",
            payload: {
              taskId: task.id,
              targetColumnId,
              targetIndex: targetColumnTasks.length,
            },
          });
        }
        break;
      case "ArrowRight":
        if (currentColumnIndex < columnIds.length - 1) {
          const targetColumnId = columnIds[currentColumnIndex + 1];
          const targetColumnTasks = state.tasks.filter(
            (t) => t.columnId === targetColumnId
          );
          dispatch({
            type: "MOVE_TASK",
            payload: {
              taskId: task.id,
              targetColumnId,
              targetIndex: targetColumnTasks.length,
            },
          });
        }
        break;
    }
  };

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.selectedTaskId, state.tasks, state.columns]);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>

        {/* Form to add new column */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="New column title"
            className="p-2 border rounded"
          />
          <button
            onClick={handleAddColumn}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Column
          </button>
        </div>

        {/* Render columns */}
        <div className="flex gap-4 flex-wrap">
          {state.columns.map((column) => (
            <Column column={column} key={column.id} />
          ))}
        </div>
      </div>

      {/* Overlay for dragged task */}
      <DragOverlay>
        {draggedTask && (
          <Task
            task={state.tasks.find((task) => task.id === draggedTask)!}
            onDelete={() => {}}
            onEdit={() => {}}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
