"use client";

import { useMemo, useState } from "react";

type Item = {
  _id: string;
  moduleNo: number;
  moduleTitle: string;
  title: string;
  order: number;
  locked: boolean;
  completed: boolean;
};

type Props = {
  items: Item[]; // flat list (course-wide with module info)
  currentId: string;
  onPick: (id: string) => void;
};

export default function SidebarSearch({ items, currentId, onPick }: Props) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? items.filter((i) => i.title.toLowerCase().includes(t)) : items;
  }, [items, q]);

  return (
    <aside className="rounded-2xl border p-3 space-y-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search lesson title…"
        className="w-full rounded-xl border px-3 py-2"
      />
      <ul className="space-y-1 max-h-[70vh] overflow-auto pr-1">
        {filtered.map((i) => {
          const active = i._id === currentId;
          return (
            <li key={i._id}>
              <button
                onClick={() => !i.locked && onPick(i._id)}
                className={`w-full text-left rounded-xl px-3 py-2 border 
                 ${active ? "bg-gray-50 border-black" : "hover:bg-gray-50"} 
                 ${i.locked ? "opacity-60 cursor-not-allowed" : ""}`}
                title={i.locked ? "Locked" : "Open"}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    <span className="text-gray-500 mr-2">M{i.moduleNo}</span>
                    {i.title}
                  </span>
                  <span className="text-xs">
                    {i.completed ? "✅" : i.locked ? "🔒" : "⭕"}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
