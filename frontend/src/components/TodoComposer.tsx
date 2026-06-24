"use client";

import { useState } from "react";

import { Priority } from "@/lib/api";
import { useTodosStore } from "@/store/todos";

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
];

export function TodoComposer() {
  const addTodo = useTodosStore((s) => s.addTodo);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [submitting, setSubmitting] = useState(false);

  const trimmed = title.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    await addTodo({ title: trimmed, priority });
    setSubmitting(false);
    setTitle("");
    setPriority("medium");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="¿Qué hay que hacer?"
        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:border-slate-400"
      />
      <div className="flex items-center gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!trimmed || submitting}
          className="ml-auto rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition active:scale-95 disabled:opacity-40"
        >
          Añadir
        </button>
      </div>
    </form>
  );
}
