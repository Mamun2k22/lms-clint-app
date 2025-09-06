// src/app/admin/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode; 
};

function IconDashboard() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h8v8H3v-8zm10 5h8v3h-8v-3z" />
    </svg>
  );
}
function IconCourses() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5V18a2 2 0 01-2 2H7l-3 2V6.5z" />
    </svg>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav: NavItem[] = [
    { href: "/admin", label: "Dashboard", icon: <IconDashboard /> },
    { href: "/admin/courses", label: "Courses", icon: <IconCourses /> },
  ];

  const NavLink = ({ href, label, icon }: NavItem) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        onClick={() => setOpen(false)}
        className={[
          "group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
          "ring-1 ring-transparent",
          active
            ? "bg-gray-900 text-white shadow-sm ring-gray-800"
            : "text-gray-700 hover:bg-gray-100/80 hover:ring-gray-200"
        ].join(" ")}
      >
        <span className={active ? "text-white" : "text-gray-600 group-hover:text-gray-900"}>{icon}</span>
        <span className="font-medium">{label}</span>
        {active && <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />}
      </Link>
    );
  };

  return (
    <div className="min-h-dvh grid grid-cols-1 md:grid-cols-[260px_1fr] bg-gradient-to-b from-white to-gray-50">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:block sticky top-0 h-dvh border-r bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-[260px] flex-col px-4 py-5">
          {/* Brand */}
          <div className="mb-6 flex items-center gap-2">
            <Link href="/" className="text-lg font-extrabold tracking-tight">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-900 text-white">L</span>
              <span className="ml-2">LMS</span>
              <span className="ml-1 text-gray-400">/Admin</span>
            </Link>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {nav.map((n) => (
              <NavLink key={n.href} {...n} />
            ))}
          </nav>

          {/* Tips card */}
          <div className="mt-8 rounded-2xl border bg-white p-4 text-xs text-gray-600 shadow-sm">
            <div className="mb-1.5 font-medium text-gray-800">Quick tips</div>
            Use “Courses” to add, edit or manage content.
          </div>

          {/* Sidebar footer */}
          <div className="mt-auto pt-6 text-[11px] text-gray-500">
            <div className="rounded-xl border bg-white px-3 py-2 shadow-sm">
              Signed in as <span className="font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex min-h-dvh flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            {/* Left: mobile menu button + title */}
            <div className="flex items-center gap-3">
              {/* Hamburger (mobile) */}
              <button
                onClick={() => setOpen(true)}
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border"
                aria-label="Open menu"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3 5h14M3 10h14M3 15h14"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="font-semibold">Admin Dashboard</div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/admin/courses"
                className="rounded-lg border bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Manage Courses
              </Link>
           <Link
  href="/"
  className="hidden sm:inline-flex rounded-lg bg-black px-3 py-1.5 text-sm text-white hover:opacity-95"
>
  View Site
</Link>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl p-4 md:p-6">{children}</main>
      </div>

      {/* Mobile drawer sidebar */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-[82%] max-w-[280px] bg-white/95 backdrop-blur-sm border-r shadow-xl md:hidden">
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <Link href="/" onClick={() => setOpen(false)} className="text-lg font-extrabold tracking-tight">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-900 text-white">L</span>
                <span className="ml-2">LMS</span>
                <span className="ml-1 text-gray-400">/Admin</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border"
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {nav.map((n) => (
                <NavLink key={n.href} {...n} />
              ))}
            </nav>

            <div className="px-4">
              <div className="mt-4 rounded-2xl border bg-white p-4 text-xs text-gray-600 shadow-sm">
                <div className="mb-1.5 font-medium text-gray-800">Quick tips</div>
                Use “Courses” to add, edit or manage content.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
