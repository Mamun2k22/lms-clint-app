// LectureForm.tsx
"use client";

import { useState } from "react";
import { z } from "zod";
import { api } from "@/lib/apis/http";
import type { Module, Lecture } from "@/lib/types";
import { zodToFieldErrors } from "@/lib/utils";

const lectureSchema = z
  .object({
    moduleId: z.string().min(1, "Module is required"),
    title: z.string().min(2, "Title is required"),
    videoUrl: z.string().url("Valid YouTube URL required"),
    pdfName: z.string().optional(),
    pdfUrl: z.string().url("PDF URL must be valid").optional(),
  })
  .refine(
    (d) => (!d.pdfName && !d.pdfUrl) || (d.pdfName && d.pdfUrl),
    { message: "Both PDF name and URL required", path: ["pdfUrl"] }
  );

type Props = {
  modules: Module[];
  onCreated: (lecture: Lecture) => void;
};

type FieldErrors = Record<string, string | undefined>;

export default function LectureForm({ modules, onCreated }: Props) {
  const [moduleId, setModuleId] = useState(modules[0]?._id ?? "");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const check = lectureSchema.safeParse({
      moduleId,
      title,
      videoUrl,
      pdfName,
      pdfUrl,
    });

    if (!check.success) {
      setErrors(zodToFieldErrors(check.error));
      return;
    }

    setErrors({});
    const body = {
      moduleId: check.data.moduleId,
      title: check.data.title,
      videoUrl: check.data.videoUrl,
      pdfs:
        check.data.pdfName && check.data.pdfUrl
          ? [{ name: check.data.pdfName, url: check.data.pdfUrl }]
          : [],
    };

    try {
      setLoading(true);
      const created = await api<Lecture>("/lectures", {
        method: "POST",
        body: JSON.stringify(body),
      });
      onCreated(created);
      setTitle("");
      setVideoUrl("");
      setPdfName("");
      setPdfUrl("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-4">
      {/* Module */}
      <div className="flex flex-col">
        <select
          className="rounded-xl border px-3 py-2"
          value={moduleId}
          onChange={(e) => setModuleId(e.target.value)}
          aria-invalid={!!errors.moduleId}
        >
          <option value="">Select a module</option>
          {modules.map((m) => (
            <option key={m._id} value={m._id}>
              {`Module ${m.moduleNo} — ${m.title}`}
            </option>
          ))}
        </select>
        {errors.moduleId && (
          <span className="text-sm text-red-600 mt-1">{errors.moduleId}</span>
        )}
      </div>

      {/* Title */}
      <div className="flex flex-col">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Lecture title"
          className="rounded-xl border px-3 py-2"
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <span className="text-sm text-red-600 mt-1">{errors.title}</span>
        )}
      </div>

      {/* Video URL */}
      <div className="flex flex-col">
        <input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="YouTube URL"
          className="rounded-xl border px-3 py-2"
          aria-invalid={!!errors.videoUrl}
        />
        {errors.videoUrl && (
          <span className="text-sm text-red-600 mt-1">{errors.videoUrl}</span>
        )}
      </div>

      {/* Spacer to align grid */}
      <div />

      {/* PDFs row */}
      <div className="sm:col-span-4 grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col">
          <input
            value={pdfName}
            onChange={(e) => setPdfName(e.target.value)}
            placeholder="PDF name (optional)"
            className="rounded-xl border px-3 py-2"
            aria-invalid={!!errors.pdfName}
          />
          {errors.pdfName && (
            <span className="text-sm text-red-600 mt-1">{errors.pdfName}</span>
          )}
        </div>

        <div className="flex flex-col">
          <input
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            placeholder="PDF url (optional)"
            className="rounded-xl border px-3 py-2"
            aria-invalid={!!errors.pdfUrl}
          />
          {errors.pdfUrl && (
            <span className="text-sm text-red-600 mt-1">{errors.pdfUrl}</span>
          )}
        </div>

        <button
          disabled={loading}
          className="rounded-xl bg-black text-white px-4 py-2 hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Adding…" : "Add Lecture"}
        </button>
      </div>
    </form>
  );
}
