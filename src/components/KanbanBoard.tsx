"use client";

import { useKanban } from "@/contexts/KanbanContext";
import React, { useEffect, useState } from "react";
import Column from "./Column";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

export default function KanbanBoard() {
  const { state, dispatch } = useKanban();
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      dispatch({ type: "ADD_COLUMN", payload: { title: newColumnTitle } });
      setNewColumnTitle("");
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const targetColumnId = over.id as string;

    // Validate that targetColumnId is a column
    const isValidColumn = state.columns.some(
      (col) => col.id === targetColumnId
    );
    if (!isValidColumn) return;

    // Find the tasks in the target column to determine the index
    const targetColumnTasks = state.tasks.filter(
      (task) => task.columnId === targetColumnId
    );
    const targetIndex =
      over.data.current?.sortable?.index ?? targetColumnTasks.length;

    dispatch({
      type: "MOVE_TASK",
      payload: { taskId, targetColumnId, targetIndex },
    });
  };
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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.selectedTaskId, state.tasks, state.columns]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
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
        <div className="flex gap-4 flex-wrap">
          {state.columns.map((column) => (
            <Column column={column} key={column.id} />
          ))}
        </div>
      </div>
    </DndContext>
  );
}
