'use client'

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import LoaderSpinner from "./LoaderSpinner";

export default function TodoForm({ onAdd }) {
  const [todoText, setTodoText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTodo = async (e) => {
    e.preventDefault();

    if (!todoText.trim()) {
      toast.error("Todo can't be empty");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: todoText }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add todo");
        return;
      }

      toast.success("Todo added");
      onAdd(data.todo);
      setTodoText("");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleAddTodo} className="flex items-center gap-3 w-full">
      <Input
        placeholder="What do you want to do?"
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
        className="flex-1 transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:outline-none"
      />
      <Button
        type="submit"
        disabled={loading}
        className="transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
      >
        {loading ? <LoaderSpinner size={4} /> : "Add"}
      </Button>
    </form>
  );
}