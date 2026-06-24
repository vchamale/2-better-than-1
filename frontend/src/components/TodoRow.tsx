"use client";

import { Todo } from "@/lib/api";
import { useTodosStore } from "@/store/todos";
import { PriorityBadge } from "@/components/PriorityBadge";

export function TodoRow({ todo }: { todo: Todo }) {
  const toggleDone = useTodosStore((s) => s.toggleDone);
  const removeTodo = useTodosStore((s) => s.removeTodo);

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <button
        onClick={() => toggleDone(todo)}
        aria-label={todo.is_done ? "Marcar como pendiente" : "Marcar como hecho"}
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
          todo.is_done
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-300"
        }`}
      >
        {todo.is_done && (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4l2.3 2.29 6.3-6.3a1 1 0 0 1 1.4 0Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-base ${
            todo.is_done ? "text-slate-400 line-through" : "text-slate-900"
          }`}
        >
          {todo.title}
        </p>
        {todo.description && (
          <p className="truncate text-sm text-slate-500">{todo.description}</p>
        )}
      </div>

      <PriorityBadge priority={todo.priority} />

      <button
        onClick={() => removeTodo(todo.id)}
        aria-label="Eliminar"
        className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-red-600"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path
            fillRule="evenodd"
            d="M8.5 2a1 1 0 0 0-.95.68L7.2 4H4a1 1 0 0 0 0 2h.06l.66 9.24A2 2 0 0 0 6.71 17h6.58a2 2 0 0 0 1.99-1.76L15.94 6H16a1 1 0 1 0 0-2h-3.2l-.35-1.32A1 1 0 0 0 11.5 2h-3Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </li>
  );
}
