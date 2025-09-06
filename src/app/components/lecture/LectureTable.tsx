"use client";

import { api } from "@/lib/apis/http";
import type { Lecture, Module } from "@/lib/types";

type Props = {
  lectures: Lecture[];
  modules: Module[];
  onDeleted: (id: string) => void;
};

export default function LectureTable({ lectures, modules, onDeleted }: Props) {
  async function remove(id: string) {
    await api(`/lectures/${id}`, { method: "DELETE" });
    onDeleted(id);
  }

  return (
    <div className="overflow-auto rounded-2xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Module</th>
            <th className="px-4 py-3">Video</th>
            <th className="px-4 py-3">PDFs</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {lectures.map((l) => {
            const m = modules.find((x) => x._id === l.moduleId);
            return (
              <tr key={l._id} className="border-t">
                <td className="px-4 py-3 font-medium">#{l.order}</td>
                <td className="px-4 py-3">{l.title}</td>
                <td className="px-4 py-3">{m ? `M${m.moduleNo} — ${m.title}` : "-"}</td>
                <td className="px-4 py-3">
                  <a href={l.videoUrl} target="_blank" rel="noreferrer" className="underline break-words">
                    {l.videoUrl}
                  </a>
                </td>
                <td className="px-4 py-3">
                  {l.pdfs?.length ? (
                    <ul className="list-disc ml-5">
                      {l.pdfs.map((p) => (
                        <li key={p.url}>
                          <a href={p.url} className="underline" target="_blank" rel="noreferrer">
                            {p.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => remove(l._id)}
                    className="rounded-xl border px-3 py-1 hover:bg-gray-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
          {!lectures.length && (
            <tr>
              <td className="px-4 py-6 text-gray-500" colSpan={6}>
                No lectures found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
