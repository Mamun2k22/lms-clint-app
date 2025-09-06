// src/app/courses/[slug]/page.tsx
import { serverApi } from "@/lib/apis/http";
import type { Course, Module, Lecture } from "@/lib/types";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> }; // <-- Promise

function formatPrice(n: number | string | undefined) {
  const v = Number(n ?? 0);
  return v === 0 ? "$0" : `$${v.toFixed(2)}`;
}

export default async function CourseDetails({ params }: Props) {
  const { slug } = await params; // <-- await params

  const course = await serverApi<Course>(`/courses/${slug}`);
  const modules = await serverApi<Module[]>(`/modules?course=${course._id}`);
  const lectures = await serverApi<Lecture[]>(`/lectures?course=${course._id}`);
  const totalLectures = lectures.length;

  // tiny derived info for better UX
  const estDuration = Math.max(1, Math.round((totalLectures * 8) / 6)) * 0.6; // ~8min/lecture
  const hours = Math.max(1, Math.round(estDuration));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src={course.thumbnailUrl || "/placeholder.webp"}
            alt={course.title}
            className="h-72 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <nav className="mb-4 text-sm text-white/80">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/courses" className="hover:underline">Courses</Link>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">{course.title}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow">
            {course.title}
          </h1>
          <p className="mt-2 max-w-3xl text-white/90">
            {course.description || "Master the core concepts step-by-step with hands-on lessons."}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] text-white/85">
            <span className="inline-flex items-center rounded-full border border-white/30 px-3 py-1">
              {modules.length} module{modules.length !== 1 ? "s" : ""}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/30 px-3 py-1">
              {totalLectures} lecture{totalLectures !== 1 ? "s" : ""}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/30 px-3 py-1">
              ~{hours} hr total • Lifetime access
            </span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        {/* LEFT */}
        <div className="space-y-8">
          {/* Overview */}
          <section className="rounded-2xl border bg-white/80 backdrop-blur p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-3 leading-7 text-gray-700">
              {course.description ||
                "This course guides you from fundamentals to practical skills with real examples and concise lessons. Learn at your own pace and track your progress as you go."}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                "Core concepts explained clearly",
                "Hands-on demos & mini projects",
                "Best practices & patterns",
                "Assessments and notes per lecture",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-black" />
                  <span className="text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Curriculum */}
          <section className="rounded-2xl border bg-white/80 backdrop-blur p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Curriculum</h2>
              <span className="rounded-full border bg-white px-3 py-1 text-xs text-gray-700 shadow-sm">
                {totalLectures} lesson{totalLectures !== 1 ? "s" : ""}
              </span>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              A quick look at the modules and lessons included.
            </p>

            <div className="space-y-3">
              {modules.map((m) => {
                const list = lectures.filter((l) => l.moduleId === m._id);
                return (
                  <details
                    key={m._id}
                    className="open:shadow-xs group rounded-xl border bg-white p-4 transition"
                    open={m.moduleNo === 1}
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-2 font-medium">
                      <span className="truncate">
                        Module {m.moduleNo}: {m.title}
                      </span>
                      <span className="text-sm text-gray-600">
                        {list.length} lesson{list.length !== 1 ? "s" : ""}
                      </span>
                    </summary>

                    <ul className="mt-3 space-y-2">
                      {list.map((l) => (
                        <li
                          key={l._id}
                          className="flex items-center justify-between rounded-lg border px-3 py-2"
                        >
                          <span className="truncate">{l.title}</span>
                          <span className="text-xs text-gray-500">#{l.order}</span>
                        </li>
                      ))}
                      {!list.length && (
                        <li className="text-sm text-gray-500">No lessons yet.</li>
                      )}
                    </ul>
                  </details>
                );
              })}
              {!modules.length && (
                <div className="text-gray-500">Modules will appear here once added.</div>
              )}
            </div>
          </section>

          {/* Instructor + Static Reviews */}
          <section className="rounded-2xl border bg-white/80 backdrop-blur p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-xl font-semibold">Instructor</h2>
            <div className="mt-3 flex items-center gap-4">
              <img
                src="https://dreamslms-wp.dreamstechnologies.com/wp-content/uploads/2023/02/login-img.png"
                alt="Instructor"
                className="h-12 w-12 rounded-full object-cover border-2 border-b-blue-700"
              />
              <div>
                <div className="font-medium">Alex Carter</div>
                <div className="text-sm text-gray-600">Senior Engineer • 10+ years teaching</div>
              </div>
            </div>
            <p className="mt-3 text-gray-700">
              Alex focuses on clear explanations and practical examples so you can apply concepts immediately.
            </p>

            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">What learners say</h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                <li className="rounded-xl border bg-white p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-500">★★★★★</div>
                  <p className="mt-2 text-sm text-gray-700">
                    “Crystal-clear explanations. The mini-projects made the concepts stick.”
                  </p>
                  <div className="mt-2 text-xs text-gray-500">— Priya S.</div>
                </li>
                <li className="rounded-xl border bg-white p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-500">★★★★★</div>
                  <p className="mt-2 text-sm text-gray-700">
                    “Perfect pace for busy people. Loved the downloadable notes.”
                  </p>
                  <div className="mt-2 text-xs text-gray-500">— Daniel K.</div>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* RIGHT: Sticky purchase / CTA */}
        <aside className="self-start lg:sticky lg:top-6">
          <div className="rounded-2xl border bg-white/80 backdrop-blur p-6 shadow-sm ring-1 ring-gray-100">
            <div className="text-3xl font-extrabold">{formatPrice(course.price)}</div>
            <p className="mt-1 text-sm text-gray-600">
              One-time payment • Lifetime access
            </p>

            <Link
              href={`/learn/${course._id}`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 font-medium text-white shadow-sm transition hover:opacity-90"
            >
              {Number(course.price || 0) === 0 ? "Enroll for free" : "Start learning"}
            </Link>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>✅ Track progress with checkmarks</li>
              <li>✅ Download notes (PDFs)</li>
              <li>✅ Watch anywhere, anytime</li>
              <li>✅ {modules.length} module • {totalLectures} lectures</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
