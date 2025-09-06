"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { api, serverApi } from "@/lib/apis/http";
import type { Course, Module, Lecture } from "@/lib/types";

export default function CourseContentPage() {
  const { id } = useParams<{ id: string }>();

  // data
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  // forms
  const [mTitle, setMTitle] = useState("");
  const [lTitle, setLTitle] = useState("");
  const [lVideo, setLVideo] = useState("");
  const [lModuleId, setLModuleId] = useState("");
  const [lPdfName, setLPdfName] = useState("");
  const [lPdfUrl, setLPdfUrl] = useState("");
  const [search, setSearch] = useState("");

  async function loadAll() {
    setLoading(true);
    const [allCourses, mods, lecs] = await Promise.all([
      serverApi<Course[]>("/courses"),
      serverApi<Module[]>(`/modules?course=${id}`),
      serverApi<Lecture[]>(`/lectures?course=${id}`),
    ]);
    setCourse(allCourses.find((c) => c._id === id) ?? null);
    setModules(mods);
    setLectures(lecs);
    if (mods[0]) setLModuleId(mods[0]._id);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, [id]);

  const grouped = useMemo(() => {
    const m = new Map<string, Lecture[]>();
    modules.forEach((md) => m.set(md._id, []));
    lectures.forEach((l) => m.get(l.moduleId)?.push(l));
    return m;
  }, [modules, lectures]);

  // actions
  async function createModule(e: React.FormEvent) {
    e.preventDefault();
    await api("/modules", {
      method: "POST",
      body: JSON.stringify({ courseId: id, title: mTitle }),
    });
    setMTitle("");
    await loadAll();
  }
  async function deleteModule(mid: string) {
    await api(`/modules/${mid}`, { method: "DELETE" });
    await loadAll();
  }
  async function createLecture(e: React.FormEvent) {
    e.preventDefault();
    const pdfs = lPdfName && lPdfUrl ? [{ name: lPdfName, url: lPdfUrl }] : [];
    await api("/lectures", {
      method: "POST",
      body: JSON.stringify({
        moduleId: lModuleId,
        title: lTitle,
        videoUrl: lVideo,
        pdfs,
      }),
    });
    setLTitle("");
    setLVideo("");
    setLPdfName("");
    setLPdfUrl("");
    await loadAll();
  }
  async function deleteLecture(lid: string) {
    await api(`/lectures/${lid}`, { method: "DELETE" });
    await loadAll();
  }

  const filteredLectures = (list: Lecture[]) =>
    list.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <div className="h-8 w-2/3 rounded bg-gray-200 animate-pulse" />
        <div className="h-40 rounded-2xl border bg-white/70 ring-1 ring-gray-100 animate-pulse" />
        <div className="h-80 rounded-2xl border bg-white/70 ring-1 ring-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Admin
            </span>
            <span>›</span>
            <span>Courses</span>
            <span>›</span>
            <span className="font-medium text-gray-700">Manage</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Manage: <span className="font-extrabold">{course?.title}</span>
          </h1>
          <p className="text-sm text-gray-600">
            Add modules and lectures. Changes are applied instantly.
          </p>
        </div>

        <a
          href={`/learn/${id}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black active:scale-[0.98]"
        >
          <span className="-ml-1">▶</span> Open Learn View
        </a>
      </div>

      {/* MODULES */}
      <section className="rounded-2xl border bg-white/80 backdrop-blur shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
              📦
            </span>
            <div>
              <h2 className="text-base font-semibold">Modules</h2>
              <p className="text-xs text-gray-600">
                Organize your course into sections.
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 space-y-5">
          <form onSubmit={createModule} className="flex flex-col gap-2 sm:flex-row">
            <input
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-900/10 transition"
              placeholder="Module title"
              value={mTitle}
              onChange={(e) => setMTitle(e.target.value)}
            />
            <button
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black active:scale-[0.98]"
              type="submit"
            >
              Add
            </button>
          </form>

          {modules.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-white/70 p-8 text-center text-sm text-gray-600 ring-1 ring-gray-100">
              No modules yet. Create your first module above.
            </div>
          ) : (
            <ul className="grid gap-3">
              {modules.map((m) => (
                <li
                  key={m._id}
                  className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm ring-1 ring-gray-100"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      Module {m.moduleNo}: {m.title}
                    </div>
                    <div className="mt-0.5 text-[11px] text-gray-500">{m._id}</div>
                  </div>
                  <button
                    onClick={() => deleteModule(m._id)}
                    className="inline-flex items-center justify-center rounded-lg border bg-white px-3 py-1.5 text-sm text-red-600 shadow-sm ring-1 ring-gray-200 transition hover:bg-red-50 hover:border-red-200"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* LECTURES */}
      <section className="rounded-2xl border bg-white/80 backdrop-blur shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
              🎬
            </span>
            <div>
              <h2 className="text-base font-semibold">Lectures</h2>
              <p className="text-xs text-gray-600">
                Add videos and documents under each module.
              </p>
            </div>
          </div>

          <div className="relative">
            <input
              placeholder="Search lecture by title…"
              className="h-10 w-72 rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-900/10 transition max-sm:w-56"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔎
            </span>
          </div>
        </div>

        {/* Create lecture form */}
        <div className="px-5 py-5">
          <form
            onSubmit={createLecture}
            className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
          >
            <select
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-900/10 transition"
              value={lModuleId}
              onChange={(e) => setLModuleId(e.target.value)}
            >
              {modules.map((m) => (
                <option key={m._id} value={m._id}>
                  Module {m.moduleNo} — {m.title}
                </option>
              ))}
            </select>

            <input
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-900/10 transition"
              placeholder="Lecture title"
              value={lTitle}
              onChange={(e) => setLTitle(e.target.value)}
            />
            <input
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-900/10 transition"
              placeholder="YouTube URL"
              value={lVideo}
              onChange={(e) => setLVideo(e.target.value)}
            />

            <input
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-900/10 transition"
              placeholder="PDF name (optional)"
              value={lPdfName}
              onChange={(e) => setLPdfName(e.target.value)}
            />
            <input
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-900/10 transition"
              placeholder="PDF url (optional)"
              value={lPdfUrl}
              onChange={(e) => setLPdfUrl(e.target.value)}
            />

            <button
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black active:scale-[0.98]"
              type="submit"
            >
              Add Lecture
            </button>
          </form>
        </div>

        {/* table by module */}
        <div className="px-5 pb-6 space-y-5">
          {modules.map((m) => (
            <div key={m._id} className="rounded-2xl border bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold">
                  Module {m.moduleNo}: {m.title}
                </div>
                <span className="rounded-full border bg-white px-2.5 py-1 text-xs text-gray-700 shadow-sm">
                  {grouped.get(m._id)?.length ?? 0} lecture(s)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="py-2 pr-3">Order</th>
                      <th className="py-2 pr-3">Title</th>
                      <th className="py-2 pr-3">Video</th>
                      <th className="py-2 pr-3">PDFs</th>
                      <th className="py-2 pr-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLectures(grouped.get(m._id) ?? []).map((l, i) => (
                      <tr
                        key={l._id}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}
                      >
                        <td className="py-2 pr-3">{l.order}</td>
                        <td className="py-2 pr-3">{l.title}</td>
                        <td className="py-2 pr-3 max-w-[320px] truncate">
                          {l.videoUrl}
                        </td>
                        <td className="py-2 pr-3">
                          {l.pdfs?.length ? (
                            l.pdfs.map((p) => (
                              <a
                                key={p.url}
                                href={p.url}
                                target="_blank"
                                className="mr-2 inline-flex items-center gap-1 rounded-full border bg-white px-2.5 py-1 text-xs underline decoration-gray-300 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
                              >
                                📄 {p.name}
                              </a>
                            ))
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-2 pr-0 text-right">
                          <button
                            onClick={() => deleteLecture(l._id)}
                            className="inline-flex items-center justify-center rounded-lg border bg-white px-2.5 py-1.5 text-xs text-red-600 shadow-sm ring-1 ring-gray-200 transition hover:bg-red-50 hover:border-red-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!(grouped.get(m._id)?.length) && (
                      <tr>
                        <td className="py-3 text-gray-500" colSpan={5}>
                          No lectures
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
