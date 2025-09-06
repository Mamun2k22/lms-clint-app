// src/components/course/CourseCard.tsx
import Link from "next/link";
import type { Course } from "@/lib/types";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <figure className="relative aspect-[16/9] overflow-hidden">
        <img
          src={course.thumbnailUrl || "/placeholder.webp"}
          alt={course.title}
          className="absolute inset-0 h-full w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
        {/* price pill */}
        <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-sm font-semibold shadow">
          ${course.price}
        </div>
      </figure>

      <div className="p-4">
        <h3 className="font-semibold text-lg leading-tight group-hover:underline underline-offset-2">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{course.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">Self-paced • Lifetime access</span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-black group-hover:gap-1.5 transition-all">
            View course
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
