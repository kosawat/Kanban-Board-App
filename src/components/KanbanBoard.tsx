"use client";

import { useKanban } from "@/contexts/KanbanContext";
import React, { useState } from "react";

export default function KanbanBoard() {
  const { state, dispatch } = useKanban();
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      dispatch({ type: "ADD_COLUMN", payload: { title: newColumnTitle } });
      setNewColumnTitle("");
    }
  };

  return (
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
          <div key={column.id} className="bg-gray-100 p-4 rounded-lg w-64">
            <h2 className="text-lg font-bold">{column.title}</h2>
            {/* Tasks will go here */}
          </div>
        ))}
      </div>
    </div>
  );
}
