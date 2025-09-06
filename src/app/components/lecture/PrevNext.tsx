"use client";

import { useState } from "react";
import { api } from "@/lib/apis/http";

type MinimalLecture = { _id: string; title: string; order: number };
type Props = {
  courseId: string;
  lectures: MinimalLecture[];
  currentId: string;
  onChange: (id: string) => void; // parent will load that lecture
};

export default function PrevNext({ courseId, lectures, currentId, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const idx = lectures.findIndex((l) => l._id === currentId);
  const prev = idx > 0 ? lectures[idx - 1] : null;
  const next = idx >= 0 && idx < lectures.length - 1 ? lectures[idx + 1] : null;

  async function goNext() {
    if (!next) return;
    try {
      setLoading(true);
      await api("/progress/complete", {
        method: "POST",
        body: JSON.stringify({ courseId, lectureId: currentId }),
      });
      onChange(next._id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <button
        disabled={!prev}
        className="rounded-xl border px-4 py-2 disabled:opacity-50 hover:bg-gray-50"
        onClick={() => prev && onChange(prev._id)}
      >
        ← Previous
      </button>

      <button
        disabled={!next || loading}
        className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-50 hover:opacity-90"
        onClick={goNext}
      >
        {loading ? "Saving…" : "Next →"}
      </button>
    </div>
  );
}
