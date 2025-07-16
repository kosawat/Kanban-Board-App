import KanbanBoard from "@/components/KanbanBoard";
import { KanbanProvider } from "@/contexts/KanbanContext";

export default function Home() {
  // Root component with Kanban Provider
  return (
    <KanbanProvider>
      <KanbanBoard />
    </KanbanProvider>
  );
}
