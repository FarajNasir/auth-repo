"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Check,
  RotateCcw,
  Pencil,
  Trash2,
} from "lucide-react";

type Todo = {
  id: string;
  title: string;
  is_done: boolean;
  status: string;
  priority: string;
};

const Page = () => {
  const router = useRouter();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("low");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  /* ===================== FETCH TODOS ===================== */
  const fetchTodos = async () => {
    try {
      setFetching(true);
      const res = await axios.get("/api/todos");
      setTodos(res.data.todos);
    } catch {
      toast.error("Failed to load todos ❌");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  /* ===================== ADD TODO ===================== */
  const addTodo = async () => {
    if (!title.trim()) {
      toast.error("Todo title is required ⚠️");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/todos", { title, status, priority });

      toast.success("Todo added ✅");
      setTitle("");
      setStatus("pending");
      setPriority("low");
      fetchTodos();
    } catch {
      toast.error("Failed to add todo ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== TOGGLE DONE ===================== */
  const toggleDone = async (todo: Todo) => {
    try {
      await axios.patch(`/api/todos/${todo.id}`, {
        is_done: !todo.is_done,
        status: !todo.is_done ? "done" : "pending",
      });

      // no toast (silent update)
      fetchTodos();
    } catch {
      toast.error("Update failed ❌");
    }
  };

  /* ===================== UPDATE TITLE ===================== */
  const updateTitle = async (id: string) => {
    if (!editTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      await axios.patch(`/api/todos/${id}`, {
        title: editTitle,
      });

      toast.success("Title updated ✏️");
      setEditingId(null);
      setEditTitle("");
      fetchTodos();
    } catch {
      toast.error("Update failed ❌");
    }
  };

  /* ===================== DELETE TODO ===================== */
  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      toast.success("Todo deleted 🗑️");
      fetchTodos();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  /* ===================== LOGOUT ===================== */
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logged out 👋");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Logout failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center gap-8 p-8">
      {/* ===================== HEADER ===================== */}
      <div className="w-full max-w-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* ===================== ADD TODO ===================== */}
      <div className="w-full max-w-md space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Todo title"
          className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-white/20"
        />

        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex-1 rounded-lg bg-white/10 border border-white/10 px-4 py-2"
          >
            <option value="pending">pending</option>
            <option value="done">done</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="flex-1 rounded-lg bg-white/10 border border-white/10 px-4 py-2"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </div>

        <button
          onClick={addTodo}
          disabled={loading}
          className="w-full bg-white text-slate-900 py-2 rounded-lg font-semibold disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Adding..." : "Add Todo"}
        </button>
      </div>

      {/* ===================== TODO LIST ===================== */}
      <div className="w-full max-w-md space-y-2">
        {fetching && (
          <p className="text-sm text-white/50 text-center">
            Loading todos...
          </p>
        )}

        {!fetching &&
          todos.map((todo) => (
            <div
              key={todo.id}
              className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 flex justify-between items-center"
            >
              {editingId === todo.id ? (
                <div className="flex gap-2 flex-1">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 rounded bg-white/10 px-2 py-1 text-sm outline-none"
                  />

                  <button
                    onClick={() => updateTitle(todo.id)}
                    className="text-green-400 hover:text-green-300 transition cursor-pointer"
                  >
                    <Check size={16} />
                  </button>

                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditTitle("");
                    }}
                    className="text-gray-400 hover:text-gray-300 transition cursor-pointer"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        todo.is_done
                          ? "line-through text-white/50"
                          : ""
                      }`}
                    >
                      {todo.title}
                    </p>
                    <p className="text-xs text-white/50">
                      {todo.status} · {todo.priority}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleDone(todo)}
                      className="text-green-400 hover:text-green-300 transition cursor-pointer"
                      title={todo.is_done ? "Undo" : "Done"}
                    >
                      {todo.is_done ? (
                        <RotateCcw size={18} />
                      ) : (
                        <Check size={18} />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(todo.id);
                        setEditTitle(todo.title);
                      }}
                      className="text-blue-400 hover:text-blue-300 transition cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-400 hover:text-red-300 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

        {!fetching && todos.length === 0 && (
          <p className="text-sm text-white/50 text-center">
            No todos yet 💤
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
