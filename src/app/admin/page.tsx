// src/app/admin/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { serverApi } from "@/lib/apis/http";
import type { Course } from "@/lib/types";

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serverApi<Course[]>("/courses")
      .then((r) => setCourses(r))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = courses.length;
    const paid = courses.filter((c) => Number(c.price) > 0).length;
    const free = total - paid;
    const avgPrice = total
      ? courses.reduce((s, c) => s + Number(c.price || 0), 0) / total
      : 0;
    return { total, paid, free, avgPrice };
  }, [courses]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-600">
          Quick overview of your course catalog and recent updates.
        </p>
      </div>

      {/* Premium Stat Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Courses" value={stats.total} color="from-sky-500 to-cyan-500" />
        <StatCard label="Paid Courses" value={stats.paid} color="from-emerald-500 to-teal-500" />
        <StatCard label="Free Courses" value={stats.free} color="from-orange-400 to-pink-500" />
        <StatCard
          label="Avg. Price"
          value={`$${stats.avgPrice.toFixed(2)}`}
          color="from-violet-500 to-fuchsia-500"
        />
      </section>

      {/* Recent Courses – Premium Card */}
      <section className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm ring-1 ring-black/5">
        {/* Card header */}
        <div className="flex items-center justify-between gap-3 border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white shadow-sm">
              📚
            </span>
            <div>
              <h2 className="text-xl font-bold leading-tight">Recent Courses</h2>
              <p className="text-xs text-gray-600">
                Your latest published or updated items
              </p>
            </div>
          </div>

          <a
            href="/admin/courses"
            className="inline-flex items-center gap-1 rounded-xl border bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition hover:bg-gray-50"
          >
            View all <span aria-hidden>→</span>
          </a>
        </div>

        {/* Card body */}
        <div className="px-6 py-6 bg-gradient-to-br from-white/60 via-white/70 to-gray-50/70 rounded-b-3xl">
          {loading ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <li
                  key={i}
                  className="rounded-2xl border bg-white/70 p-5 shadow-sm ring-1 ring-gray-100"
                >
                  <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-gray-200" />
                  <div className="mt-5 h-9 w-full animate-pulse rounded bg-gray-200" />
                </li>
              ))}
            </ul>
          ) : courses.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-white/70 p-10 text-center shadow-sm ring-1 ring-gray-100">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-gray-100 text-lg">＋</div>
              <p className="text-sm text-gray-600">
                No courses yet. Create one from{" "}
                <a className="text-blue-600 underline" href="/admin/courses">Courses</a>.
              </p>
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses.slice(0, 12).map((c) => (
                <CourseCard key={c._id} course={c} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

/* ---------------- UI Bits ---------------- */

function StatCard({
  label,
  value,
  color = "from-indigo-500 to-purple-500",
}: {
  label: string;
  value: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
      {/* thin gradient bar on top for premium feel */}
      <div className={`h-1 w-full bg-gradient-to-r ${color}`} />
      <div className="p-5">
        <div className="text-xs uppercase tracking-wide/relaxed text-gray-600">
          {label}
        </div>
        <div className="mt-2 text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const price = Number(course.price ?? 0);
  const isPaid = price > 0;

  return (
    <li
      className="group relative rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* subtle inner highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_theme(colors.gray.100)]" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold tracking-tight">
            {course.title}
          </h3>
          <p className="mt-0.5 text-sm text-gray-500">/{course.slug}</p>
        </div>

        <span
          className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 shadow-sm ring-1 ring-gray-200"
          title={isPaid ? "Paid" : "Free"}
        >
          ${price.toFixed(2)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={`/admin/courses/${course._id}/content`}
          className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-black active:scale-[0.98]"
        >
          Manage
        </a>
        <a
          href={`/courses/${course.slug}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-xl border bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-50"
        >
          Preview
        </a>
      </div>
    </li>
  );
}
