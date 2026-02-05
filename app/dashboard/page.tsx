"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

  /* ===================== FETCH TODOS ===================== */
  const fetchTodos = async () => {
    try {
      setFetching(true);
      const res = await axios.get("/api/todos");
      setTodos(res.data.todos);
    } catch (error) {
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

      await axios.post("/api/todos", {
        title,
        status,
        priority,
      });

      toast.success("Todo added successfully ✅");
      setTitle("");
      setStatus("pending");
      setPriority("low");
      fetchTodos();
    } catch (error) {
      toast.error("Failed to add todo ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== LOGOUT ===================== */
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logged out 👋");
      router.push("/login");
      router.refresh();
    } catch (error) {
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
          className="bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold hover:opacity-90"
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
          className="w-full bg-white text-slate-900 py-2 rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
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
              className="rounded-lg bg-white/5 border border-white/10 px-4 py-2"
            >
              <div className="font-semibold">{todo.title}</div>
              <div className="text-xs text-white/60">
                status: {todo.status} | priority: {todo.priority}
              </div>
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
