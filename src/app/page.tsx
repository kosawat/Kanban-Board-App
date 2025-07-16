import ColumnComponent from "@/components/Column";
import { Column } from "@/types";

const columns: Column[] = [
  { id: "1", title: "Todo" },
  { id: "2", title: "In Progress" },
  { id: "3", title: "Done" },
];
export default function Home() {
  return (
    <div className="flex gap-4 p-4">
      {columns.map((column) => (
        <ColumnComponent column={column} key={column.id} />
      ))}
    </div>
  );
}
