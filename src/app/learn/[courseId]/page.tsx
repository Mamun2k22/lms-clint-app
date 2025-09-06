"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { api, serverApi } from "@/lib/apis/http";
import type { Module, Lecture } from "@/lib/types";

/**
 * UI goals covered:
 * - Left sidebar: modules -> lectures (expandable feel with headings)
 * - Search lectures by title
 * - Lock logic: user can only open first lecture or the next after completing previous
 * - Checkmarks for completed lectures, progress bar on top
 * - Next / Previous navigation
 * - Video embed (YouTube) + multiple PDF notes with download links
 */

export default function LearnPage() {
  const { courseId } = useParams<{ courseId: string }>();

  // data
  const [modules, setModules] = useState<Module[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [completed, setCompleted] = useState<string[]>([]); // ids
  const [current, setCurrent] = useState<Lecture | null>(null);

  // ui
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // load everything
  useEffect(() => {
    (async () => {
      setLoading(true);
      const [mods, lecs] = await Promise.all([
        serverApi<Module[]>(`/modules?course=${courseId}`),
        serverApi<Lecture[]>(`/lectures?course=${courseId}`),
      ]);

      // Sort globally by "order" (backend already does, but keep it safe)
      lecs.sort((a, b) => a.order - b.order);

      setModules(mods);
      setLectures(lecs);

      // Try to fetch completed (ignore error if API not implemented)
      try {
        const prog = await serverApi<{ completedLectureIds: string[] }>(
          `/progress?course=${courseId}`
        );
        setCompleted(prog.completedLectureIds ?? []);
      } catch {
        setCompleted([]);
      }

      setCurrent(lecs[0] ?? null);
      setLoading(false);
    })();
  }, [courseId]);

  // Helpers
  const total = lectures.length;
  const done = completed.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  // map moduleId -> lectures
  const grouped = useMemo(() => {
    const m = new Map<string, Lecture[]>();
    modules.forEach((mod) => m.set(mod._id, []));
    lectures.forEach((l) => m.get(l.moduleId)?.push(l));
    // keep module-local order by global "order"
    for (const [k, arr] of m.entries()) arr.sort((a, b) => a.order - b.order);
    return m;
  }, [modules, lectures]);

  // is lecture unlocked per sequential rule
  const isUnlocked = (lec: Lecture) => {
    if (lec.order === 1) return true;
    const prev = lectures.find((x) => x.order === lec.order - 1);
    if (!prev) return true;
    return completed.includes(prev._id);
  };

  // move to next unlocked lecture after completing current
async function handleNext() {
  if (!current) return;

  // mark complete
  try {
    const res = await api<{ completedLectureIds: string[] }>("/progress/complete", {
      method: "POST",
      body: JSON.stringify({ courseId, lectureId: current._id }),
    });
    setCompleted(res.completedLectureIds ?? []);
  } catch {
    // if progress API missing, still advance optimistically
    setCompleted((prev) =>
      prev.includes(current._id) ? prev : [...prev, current._id]
    );
  }

  // go next
  const idx = lectures.findIndex((x) => x._id === current._id);
  const next = lectures[idx + 1];
  if (next) setCurrent(next);
}

  function handlePrev() {
    if (!current) return;
    const idx = lectures.findIndex((x) => x._id === current._id);
    const prev = lectures[idx - 1];
    if (prev) setCurrent(prev);
  }

  // small util for YouTube embeds
  const toEmbed = (url: string) =>
    url?.includes("watch?v=") ? url.replace("watch?v=", "embed/") : url;

  if (loading) return <div className="p-6">Loading…</div>;
  if (!current) return <div className="p-6">No lectures available yet.</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 grid gap-4 md:gap-6 md:grid-cols-[320px_1fr]">
      {/* Sidebar */}
      <aside className="rounded-2xl border h-[82vh] overflow-auto p-3 space-y-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">
              {done}/{total} • {pct}%
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded bg-gray-200">
            <div
              className="h-2 rounded bg-black transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Search */}
        <input
          className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/70"
          placeholder="Search lesson…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Module -> lectures */}
        <div className="space-y-3">
          {modules.map((m) => {
            const list =
              (grouped.get(m._id) ?? []).filter((l) =>
                l.title.toLowerCase().includes(search.toLowerCase())
              ) || [];
            return (
              <div key={m._id} className="rounded-xl border">
                <div className="px-3 py-2 font-semibold bg-gray-50 rounded-t-xl">
                  Module {m.moduleNo}: {m.title}
                </div>
                <ul className="p-2 space-y-1">
                  {list.map((l) => {
                    const active = current._id === l._id;
                    const locked = !isUnlocked(l);
                    const done = completed.includes(l._id);
                    return (
                      <li key={l._id}>
                        <button
                          onClick={() => !locked && setCurrent(l)}
                          className={`w-full text-left px-2 py-1.5 rounded flex items-center gap-2 ${
                            active
                              ? "bg-black text-white"
                              : locked
                              ? "text-gray-400 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <span className="text-lg leading-none">
                            {done ? "✅" : locked ? "🔒" : "⭕"}
                          </span>
                          <span className="flex-1 truncate">{l.title}</span>
                          <span className="text-xs opacity-70">#{l.order}</span>
                        </button>
                      </li>
                    );
                  })}
                  {!list.length && (
                    <li className="px-2 py-1 text-sm text-gray-500">
                      No matching lessons
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Player + details */}
      <section className="space-y-4">
        <div className="rounded-2xl overflow-hidden bg-black aspect-video">
          <iframe
            className="w-full h-full"
            src={toEmbed(current.videoUrl)}
            title={current.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="font-semibold">{current.title}</div>
          <div className="space-x-2">
            <button onClick={handlePrev} className="px-3 py-2 rounded border">
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-3 py-2 rounded bg-black text-white"
            >
              Next
            </button>
          </div>
        </div>

        {/* PDFs */}
        <div className="rounded-2xl border p-4">
          <h3 className="font-semibold mb-2">Notes (PDF)</h3>
          {current.pdfs?.length ? (
            <ul className="list-disc ml-5 space-y-1">
              {current.pdfs.map((p) => (
                <li key={p.url}>
                  <a
                    className="underline"
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">No notes for this lecture.</div>
          )}
        </div>
      </section>
    </div>
  );
}
