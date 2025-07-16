import KanbanBoard from "@/components/KanbanBoard";
import { KanbanProvider } from "@/contexts/KanbanContext";

export default function Home() {
  return (
    <KanbanProvider>
      <KanbanBoard />
    </KanbanProvider>
  );
}
