# Kanban Board App

A simple Kanban board application built with Next.js, TypeScript, and Tailwind CSS. 
This application allows users to manage tasks across columns, supporting drag-and-drop, keyboard navigation, and nested comments with localStorage persistence.

> **Deployed on Vercel:**  
> You can try the live app [here](https://kanban-board-app-ks.vercel.app/).

## Features
- Create, update, and delete tasks and columns
- Drag-and-drop task management
- Move selected task with keyboard navigation
- Persistent state using `localStorage`

## Getting Started
1. Clone the repository:
    ```sh
    git clone https://github.com/kosawat/Kanban-Board-App.git
    cd Kanban-Board-App
    ```

2. Install dependencies:
    ```sh
    npm install
    # or
    yarn install
    ```

3. Start the development server:
    ```sh
    npm run dev
    # or
    yarn dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

**Managing Columns**
- Add a Column: Enter a title in the input field at the top and click "Add Column".
- Rename a Column: Click the column title, edit it, and press Enter or click away.
- Delete a Column: Click the "Delete" button on a column (confirms before deleting, removing all tasks in the column).

**Managing Tasks**
- Add a Task: In a column, enter a title in the input field and click "Add Task" or press Enter.
- Edit a Task: Click the "Details" button on a task card to open the modal, update the title/description, and click "Save Task".
- Open Details: Click the "Details" button to view/edit the task in a modal.
- Delete a Task: Click the "Delete" button on a task card (confirms before deleting).

**Drag-and-Drop**
- Move Tasks: Use the drag handle (⋮⋮) on a task card to drag it within a column or to another column.
- Placement: Drop tasks above or below other tasks in a column for precise ordering.

**Keyboard Navigation**
* Select a Task: Click a task card to select it (indicated by a blue border).
* Move Tasks:
  + ArrowUp: Move the task up within the same column.
  + ArrowDown: Move the task down within the same column.
  + ArrowLeft: Move the task to the previous column.
  + ArrowRight: Move the task to the next column.

**Managing Comments**
- Add a Comment: In the task modal, enter text in the comment field and click "Add Comment".
- Reply to a Comment: Click "Reply" on a comment, enter text, and click "Add Reply".
- Edit a Comment: Click "Edit" on a comment, update the text, and click "Save".
- Delete a Comment: Click "Delete" on a comment (confirms before deleting).

## File Structure
- src/app/page.tsx: Root component,
- src/components/KanbanBoard.tsx: Main Kanban board component, handling the Kanban board layout, drag-and-drop logic, and keyboard navigation.
- src/components/Column.tsx: Renders a column with tasks, supporting renaming, deletion, and task addition.
- src/components/Task.tsx: Renders a draggable task card with selection and modal controls.
- src/components/modals/TaskModal.tsx: Displays a modal for task details and nested comments.
- src/contexts/KanbanContext.tsx: Manages global state (columns, tasks, selected task) using React Context and useReducer.
- src/hooks/useLocalStorage.ts: Custom hook for persisting state to localStorage with error handling.
- src/types/index.ts: TypeScript type definitions for Column, Task, and Comment.
- src/utils/uuid.ts: Utility for generating unique IDs.

## Technical Details
**Tech Stack:**
- Next.js: React framework with App Router.
- TypeScript: Ensures type safety for state, props, and actions.
- Tailwind CSS: Utility-first CSS for responsive and consistent styling.
- @dnd-kit/core & @dnd-kit/sortable: Drag-and-drop functionality with smooth transitions and precise placement.
- Headless UI: Accessible modal component for task details.
- Lucide React: Icons for drag handle and other UI elements.

**State Management:**
- Uses React Context API with useReducer for centralized state management.
- Persists state to localStorage via useLocalStorage hook.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
