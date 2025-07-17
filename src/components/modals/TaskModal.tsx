"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { TaskType, CommentType } from "@/types";
import { useKanban } from "@/contexts/KanbanContext";

// Props for the TaskModal component
interface TaskModalProps {
  task: TaskType;
  isOpen: boolean; // Controls modal visibility
  onClose: () => void; // Callback to close the modal
  onUpdate: (task: TaskType) => void; // Callback to update the task
}

export default function TaskModal({
  task,
  isOpen,
  onClose,
  onUpdate,
}: TaskModalProps) {
  const { dispatch } = useKanban();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [newReply, setNewReply] = useState("");

  // Save task updates with validation
  const handleSaveTask = () => {
    if (title.trim()) {
      onUpdate({ ...task, title, description: description || undefined });
    }
  };

  // Add a new comment with validation
  const handleAddComment = () => {
    if (newComment.trim()) {
      dispatch({
        type: "ADD_COMMENT",
        payload: { taskId: task.id, content: newComment },
      });
      setNewComment("");
    }
  };

  // Add a reply to a comment with validation
  const handleAddReply = (parentId: string) => {
    if (newReply.trim()) {
      dispatch({
        type: "ADD_COMMENT",
        payload: { taskId: task.id, content: newReply, parentId },
      });
      setNewReply("");
      setReplyingToId(null);
    }
  };

  // Editing a comment
  const handleEditComment = (comment: CommentType) => {
    setEditingCommentId(comment.id);
    setEditedCommentContent(comment.content);
  };

  // Save edited comment with validation
  const handleSaveComment = (commentId: string) => {
    if (editedCommentContent.trim()) {
      dispatch({
        type: "UPDATE_COMMENT",
        payload: { id: commentId, content: editedCommentContent },
      });
      setEditingCommentId(null);
      setEditedCommentContent("");
    }
  };

  // Delete comment with confirmation
  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("Delete this comment?")) {
      dispatch({ type: "DELETE_COMMENT", payload: { id: commentId } });
    }
  };

  // Build comment tree for hierarchical display
  const buildCommentTree = (comments: CommentType[]): CommentType[] => {
    const commentMap = new Map<string, CommentType>();
    const tree: CommentType[] = [];

    // Initialize comment map with children arrays
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, children: [] });
    });

    // Build tree structure for nested comments
    comments.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(commentMap.get(comment.id)!);
        }
      } else {
        tree.push(commentMap.get(comment.id)!);
      }
    });

    return tree;
  };

  const commentTree = buildCommentTree(task.comments);

  // Render a comment with nested replies
  const renderComment = (
    comment: CommentType & { children?: CommentType[] },
    level = 0
  ) => (
    <div
      key={comment.id}
      className={`mt-2 ${
        level > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : ""
      }`}
    >
      {editingCommentId === comment.id ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={editedCommentContent}
            onChange={(e) => setEditedCommentContent(e.target.value)}
            className="p-2 border rounded text-sm w-full"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleSaveComment(comment.id)}
              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setEditingCommentId(null)}
              className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start">
            <p className="text-sm">{comment.content}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditComment(comment)}
                className="text-blue-500 hover:text-blue-700 text-xs"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-500 hover:text-red-700 text-xs"
                aria-label={`Delete comment`}
              >
                Delete
              </button>
            </div>
          </div>
          <button
            onClick={() => setReplyingToId(comment.id)}
            className="text-blue-500 hover:text-blue-700 text-xs mt-1"
          >
            Reply
          </button>
          {replyingToId === comment.id && (
            <div className="mt-2 flex flex-col gap-2">
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="p-2 border rounded text-sm w-full"
                placeholder="Add a reply..."
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddReply(comment.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Add Reply
                </button>
                <button
                  onClick={() => setReplyingToId(null)}
                  className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {comment.children &&
        comment.children.map((child) => renderComment(child, level + 1))}
    </div>
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
          <DialogTitle className="text-xl font-bold mb-4">
            Task Details
          </DialogTitle>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 border rounded text-sm"
              placeholder="Task title"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2 border rounded text-sm md:h-32"
              placeholder="Task description (optional)"
            />
            <button
              onClick={handleSaveTask}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Save Task
            </button>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Comments</h3>
            {commentTree.length === 0 ? (
              <p className="text-gray-500 text-sm">No comments yet</p>
            ) : (
              commentTree.map((comment) => renderComment(comment))
            )}
            <div className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="p-2 border rounded text-sm w-full"
                placeholder="Add a comment..."
              />
              <button
                onClick={handleAddComment}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Add Comment
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-6 text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            Close
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
