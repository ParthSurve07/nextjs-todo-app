"use client";

import { useEffect, useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { GripVertical, Pencil, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function SortableTodo({ id, todo, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.title);
  const [showGlow, setShowGlow] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    if (!editedText.trim()) return;

    try {
      const res = await fetch(`/api/todo/${todo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editedText }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      onEdit(data.todo); // Call parent's handler
      toast.success("Todo updated");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || "Failed to update todo");
    }
  };

  const handleToggleComplete = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/todo/${todo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      onEdit(data.todo);

      if (!todo.completed) {
        setShowGlow(true);
        setTimeout(() => setShowGlow(false), 600);
      }

      toast.success("Todo updated");
    } catch (err) {
      toast.error(err.message || "Failed to update todo");
    }
  };


  useEffect(() => {
    setEditedText(todo.title);
  }, [todo.title]);

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      {...attributes}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`bg-gray-800/60 backdrop-blur-lg p-4 rounded-2xl shadow-md transition-shadow hover:shadow-lg mb-4 flex justify-between items-center gap-3 ${
        showGlow ? "glow-on-complete" : ""
      }`}
    >
      {isEditing ? (
        <input
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
          className="flex-1 bg-transparent border-b border-white focus:outline-none"
        />
      ) : (
        // <span className="flex-1">{todo.title}</span>
        <label className="flex-1 flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
            className="form-checkbox h-4 w-4 accent-green-500"
          />
          <span className={todo.completed ? "line-through text-gray-400" : ""}>
            {todo.title}
          </span>
        </label>
      )}

      <div className="flex items-center gap-3">
        {isEditing ? (
          <Check
            onClick={handleSaveEdit}
            className="w-4 h-4 text-green-400 cursor-pointer"
          />
        ) : (
          <Pencil
            onClick={() => setIsEditing(true)}
            className="w-4 h-4 text-blue-400 cursor-pointer"
          />
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Trash2 className="w-4 h-4 text-red-400 cursor-pointer" />
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-gray-900 border border-gray-700 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this todo?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Are you sure you want to delete
                this todo?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(todo._id)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <GripVertical className="w-4 h-4 text-gray-400" {...listeners} />
      </div>
    </motion.li>
  );
}
