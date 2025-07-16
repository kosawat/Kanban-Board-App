import React from "react";
import Task from "./Task";
import { Column } from "@/types";

interface ColumnProps {
  column: Column;
}

export default function ColumnCompnent({ column }: ColumnProps) {
  return (
    <div>
      <h2>{column.title}</h2>
      <Task />
    </div>
  );
}
