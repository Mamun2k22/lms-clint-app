"use client";

import { useEffect, useState } from "react";
import { api, serverApi } from "@/lib/apis/http";
import type { Course } from "@/lib/types";

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const data = await serverApi<Course[]>("/courses");
    setCourses(data);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function createCourse(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    await api("/courses", {
      method: "POST",
      body: JSON.stringify({
        title,
        price: Number(price),
        slug,
        description,
      }),
    });
    setTitle("");
    setPrice(0);
    setSlug("");
    setDescription("");
    setCreating(false);
    await load();
  }

  async function del(id: string) {
    await api(`/courses/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 space-y-8">
        {/* Toolbar / Page header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Admin
              </span>
              <span>›</span>
              <span className="font-medium text-gray-700">Courses</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Courses
            </h1>
            <p className="text-sm text-gray-600">
              Create, manage and organize your course catalog.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm">
              <span className="inline-flex h-2 w-2 rounded-full bg-gray-300" />
              Total:
              <span className="font-semibold">{courses.length}</span>
            </span>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
              aria-label="Refresh courses"
              title="Refresh"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992V4.356M2.985 14.652H7.98v4.992"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.015 9.348A8.016 8.016 0 0012 4.332c-2.78 0-5.26 1.42-6.73 3.586M2.985 14.652A8.016 8.016 0 0012 19.668c2.78 0 5.26-1.42 6.73-3.586"
                />
              </svg>
              Refresh
            </button>
          </div>
        </header>

        {/* Create Form Card */}
        <section className="rounded-2xl border bg-white/80 backdrop-blur shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4">
            <h2 className="text-base font-semibold">Add new course</h2>
          </div>

          <form
            onSubmit={createCourse}
            className="grid gap-5 px-5 py-5 sm:grid-cols-2"
            aria-label="Create course form"
          >
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none ring-0 focus:border-gray-300 focus:ring-2 focus:ring-gray-900/10 transition"
                placeholder="e.g. Next.js Basics"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                The headline shown across the site.
              </p>
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium" htmlFor="slug">
                Slug
              </label>
              <input
                id="slug"
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none ring-0 focus:border-gray-300 focus:ring-2 focus:ring-gray-900/10 transition"
                placeholder="nextjs-basics"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                Used in URL, like <code>/courses/your-slug</code>.
              </p>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium" htmlFor="price">
                Price
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                  $
                </span>
                <input
                  id="price"
                  type="number"
                  min={0}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-7 pr-3 text-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-900/10 transition"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
              </div>
              <p className="text-xs text-gray-500">Set 0 for free courses.</p>
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1.5">
              <label
                className="block text-sm font-medium"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-900/10 transition"
                placeholder="Short summary of what learners will get."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <button
                className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black active:scale-[0.98] sm:w-auto"
                type="submit"
                aria-label="Create course"
                disabled={creating}
              >
                {creating ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Creating…
                  </>
                ) : (
                  <>
                    <span className="mr-2">➕</span> Create Course
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Courses list */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">All courses</h2>

          {loading ? (
            /* Skeletons */
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <li
                  key={i}
                  className="rounded-2xl border bg-white/70 p-4 shadow-sm ring-1 ring-gray-100"
                >
                  <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-gray-200" />
                  <div className="mt-6 h-9 w-full animate-pulse rounded bg-gray-200" />
                </li>
              ))}
            </ul>
          ) : courses.length === 0 ? (
            <div className="rounded-2xl border bg-white/70 p-8 text-center text-sm text-gray-600 shadow-sm ring-1 ring-gray-100">
              No courses yet. Create your first course from the form above.
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <li
                  key={c._id}
                  className="group rounded-2xl border bg-white/80 p-4 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold tracking-tight">
                        {c.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-2 text-sm text-gray-600">
                        /{c.slug}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border bg-white px-2.5 py-1 text-xs font-medium text-gray-800 shadow-sm">
                      ${Number(c.price ?? 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <a
                      className="inline-flex items-center justify-center rounded-lg border bg-white px-3 py-2 text-sm transition hover:bg-gray-50"
                      href={`/admin/courses/${c._id}/content`}
                      aria-label={`Manage course ${c.title}`}
                    >
                      Manage
                    </a>
                    <button
                      onClick={() => del(c._id)}
                      className="inline-flex items-center justify-center rounded-lg border bg-white px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 hover:border-red-200"
                      aria-label={`Delete course ${c.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
