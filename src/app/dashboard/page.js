'use client'

import TodoForm from "@/components/TodoForm";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTodo from "@/components/SortableTodo";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        const res = await fetch('/api/todo', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }

        setTodos(data.todos || []);
      } catch (error) {
        console.error(error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    }

    fetchTodos();
  }, [router]);

  const handleAddTodo = (newTodo) => {
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleEditTodo = (updatedTodo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === updatedTodo._id ? updatedTodo : todo
      )
    );
  };

  const handleDeleteTodo = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/todo/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      toast.success("Todo deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete todo");
    }
  };

  const listVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex((todo) => todo._id === active.id);
    const newIndex = todos.findIndex((todo) => todo._id === over.id);

    const updatedTodos = arrayMove(todos, oldIndex, newIndex);
    setTodos(updatedTodos);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 py-8 text-white">

      <div className="max-w-4xl mx-auto px-4 py-8 text-white">
        <h1 className="text-3xl font-bold mb-6">Your Todos</h1>

        <TodoForm onAdd={handleAddTodo} />

        {todos.length === 0 ? (
          <p className="text-gray-400 mt-4">No todos found.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={todos.map((t) => t._id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-4 mt-6">
                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                >
                  <AnimatePresence>
                      {todos.map((todo) => (
                        <SortableTodo
                          key={todo._id}
                          id={todo._id}
                          todo={todo}
                          onEdit={handleEditTodo}
                          onDelete={handleDeleteTodo}
                        />
                      ))}
                  </AnimatePresence>
                </motion.div>
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </motion.div>
  );
}