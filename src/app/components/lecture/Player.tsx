"use client";

import type { Lecture } from "@/lib/types";

export default function Player({ lecture }: { lecture: Lecture }) {
  // Accept normal YouTube links and transform to embed
  const embed = toEmbed(lecture.videoUrl);

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full overflow-hidden rounded-2xl border">
        <iframe
          className="h-full w-full"
          src={embed}
          title={lecture.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {!!lecture.pdfs?.length && (
        <div className="rounded-2xl border p-4">
          <h4 className="font-semibold mb-2">Resources</h4>
          <ul className="list-disc ml-5 space-y-1">
            {lecture.pdfs.map((p) => (
              <li key={p.url}>
                <a href={p.url} target="_blank" className="underline" rel="noreferrer">
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function toEmbed(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}`;
    }
  } catch {}
  // fallback keep same url (some providers allow direct)
  return url;
}
