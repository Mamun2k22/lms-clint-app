"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/apis/http";
import type { Course, Module, Lecture } from "@/lib/types";

export default function AdminLecturesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [moduleId, setModuleId] = useState<string>("");
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const cs = await api<Course[]>("/courses");
      setCourses(cs);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      // modules depend on selected course
      const ms = await api<Module[]>(`/modules${courseId ? `?course=${courseId}` : ""}`);
      setModules(ms);
      // reset module when course changes
      setModuleId("");
    })();
  }, [courseId]);

  useEffect(() => {
    (async () => {
      const qs: string[] = [];
      if (courseId) qs.push(`course=${courseId}`);
      if (moduleId) qs.push(`module=${moduleId}`);
      const url = `/lectures${qs.length ? `?${qs.join("&")}` : ""}`;
      const ls = await api<Lecture[]>(url);
      setLectures(ls);
    })();
  }, [courseId, moduleId]);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return text ? lectures.filter(l => l.title.toLowerCase().includes(text)) : lectures;
  }, [lectures, q]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold">Lecture List</h1>
        <p className="text-gray-600">Filter by course or module, search by title.</p>
      </header>

      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-3">
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="rounded-xl border px-3 py-2"
        >
          <option value="">All courses</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>

        <select
          value={moduleId}
          onChange={(e) => setModuleId(e.target.value)}
          className="rounded-xl border px-3 py-2"
        >
          <option value="">All modules</option>
          {modules.map(m => (
            <option key={m._id} value={m._id}>
              {`Module ${m.moduleNo}: ${m.title}`}
            </option>
          ))}
        </select>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by lecture title…"
          className="rounded-xl border px-3 py-2"
        />
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Lecture Title</th>
              <th className="px-4 py-3">Module</th>
              <th className="px-4 py-3">Video URL</th>
              <th className="px-4 py-3">PDFs</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => {
              const m = modules.find(x => x._id === l.moduleId);
              return (
                <tr key={l._id} className="border-t">
                  <td className="px-4 py-3 font-medium">#{l.order}</td>
                  <td className="px-4 py-3">{l.title}</td>
                  <td className="px-4 py-3">{m ? `M${m.moduleNo} — ${m.title}` : "-"}</td>
                  <td className="px-4 py-3">
                    <a href={l.videoUrl} target="_blank" className="underline break-words" rel="noreferrer">
                      {l.videoUrl}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {l.pdfs?.length ? (
                      <ul className="list-disc ml-5">
                        {l.pdfs.map(p => (
                          <li key={p.url}>
                            <a href={p.url} target="_blank" rel="noreferrer" className="underline">{p.name}</a>
                          </li>
                        ))}
                      </ul>
                    ) : <span className="text-gray-500">—</span>}
                  </td>
                </tr>
              );
            })}
            {!filtered.length && (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={5}>No lectures found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
