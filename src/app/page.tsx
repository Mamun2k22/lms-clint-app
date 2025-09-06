// src/app/page.tsx
import { serverApi } from "@/lib/apis/http";
import type { Course } from "@/lib/types";
import CourseGrid from "../app/components/course/CourseGrid"; // <-- fix this line

export const revalidate = 0;

export default async function Home() {
  const courses = await serverApi<Course[]>("/courses");
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Explore Courses</h1>
          <p className="text-gray-600 mt-1">Learn with bite-sized lessons and track your progress.</p>
        </div>
      </header>

      <CourseGrid courses={courses} />
    </main>
  );
}
