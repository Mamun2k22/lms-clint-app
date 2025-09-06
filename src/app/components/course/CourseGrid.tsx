// src/components/course/CourseGrid.tsx
"use client";

import { useMemo, useState } from "react";
import type { Course } from "@/lib/types";
import CourseCard from "./CourseCard";

type Props = { courses: Course[] };
type SortKey = "relevance" | "price_asc" | "price_desc" | "title";

export default function CourseGrid({ courses }: Props) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("relevance");

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();

    const list = text
      ? courses.filter(
          (c) =>
            c.title.toLowerCase().includes(text) ||
            (c.description ?? "").toLowerCase().includes(text)
        )
      : [...courses];

    switch (sort) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "title":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // relevance = keep original order (usually newest first from backend)
        break;
    }
    return list;
  }, [courses, q, sort]);

  return (
    <>
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search courses (e.g. TypeScript)…"
          className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/70"
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 hidden sm:block">Sort by</label>
          <select
            value={sort}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSort(e.target.value as SortKey)
            }
            className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/70"
          >
            <option value="relevance">Relevance</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="title">Title (A–Z)</option>
          </select>
        </div>
      </div>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <CourseCard key={c._id} course={c} />
        ))}
        {filtered.length === 0 && (
          <div className="text-gray-500">No course matched your search.</div>
        )}
      </section>
    </>
  );
}
