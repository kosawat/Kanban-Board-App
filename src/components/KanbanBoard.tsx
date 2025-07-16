"use client";

import { useKanban } from "@/contexts/KanbanContext";
import React, { useState } from "react";
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
