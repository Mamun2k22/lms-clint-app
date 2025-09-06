// src/app/components/course/Instructor.tsx
"use client";

type Props = {
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  stats?: {
    students: number;
    courses: number;
    rating: number;
  };
};

export default function Instructor({
  name,
  title,
  bio,
  avatar = "/placeholder.webp",
  stats = { students: 1200, courses: 8, rating: 4.8 },
}: Props) {
  return (
    <section aria-labelledby="instructor" className="rounded-2xl border p-5">
      <h2 id="instructor" className="text-lg font-semibold mb-4">
        Instructor
      </h2>

      <div className="flex gap-4">
        <img
          src={avatar}
          alt={`${name} avatar`}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div className="min-w-0">
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-gray-600">{title}</div>
          <p className="mt-2 text-sm text-gray-700">{bio}</p>

          {stats && (
            <ul className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
              <li>⭐ {stats.rating} rating</li>
              <li>👩‍🎓 {stats.students.toLocaleString()} students</li>
              <li>🎓 {stats.courses} courses</li>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
