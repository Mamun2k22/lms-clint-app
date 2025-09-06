"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// tiny helper
function cn(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}

const COURSE_PATH = "/courses";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // ---- hydration-safe auth state ----
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setHasToken(!!localStorage.getItem("token"));
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem("token");
    // keep it simple; a hard refresh guarantees state resets everywhere
    window.location.href = "/";
  };
  // -----------------------------------

  const isActive = (href: string) => {
    const p = pathname || "/";
    return href === "/" ? p === "/" : p.startsWith(href);
  };

  // reuse in desktop & mobile
  const AuthButton = () => {
    // SSR + first client render -> always render "Login" to match HTML
    if (!mounted) {
      return (
        <Link
          href="/admin/login"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white text-[15px] font-medium inline-flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <circle cx="10" cy="7" r="6" />
            <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" />
          </svg>
          Login
        </Link>
      );
    }
    return hasToken ? (
      <button
        onClick={signOut}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white text-[15px] font-medium"
      >
        Sign out
      </button>
    ) : (
      <Link
        href="/admin/login"
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white text-[15px] font-medium inline-flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-white">
          <circle cx="10" cy="7" r="6" />
          <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" />
        </svg>
        Login
      </Link>
    );
  };

  return (
    <header className="flex shadow-[0px_0px_16px_rgba(17,_17,_26,_0.1)] py-4 px-4 sm:px-6 bg-white min-h-[70px] tracking-wide relative z-50">
      <div className="flex flex-wrap items-center justify-between gap-4 w-full max-w-screen-xl mx-auto">
        {/* Logo (desktop) */}
        <Link href="/" className="max-sm:hidden">
          <Image
            src="https://i.ibb.co/mrw6rY8C/images.jpg" // note: i.ibb.co (no .com twice)
            alt="logo"
            width={144}
            height={36}
            priority
            className="h-9 w-36 object-contain"
            unoptimized
          />
        </Link>

        {/* Logo (mobile) */}
        <Link href="/" className="hidden max-sm:block">
          <Image
            src="https://i.ibb.co/mrw6rY8C/images.jpg"
            alt="logo"
            width={120}
            height={24}
            priority
            className="h-6 w-auto object-contain"
            unoptimized
          />
        </Link>

        {/* Drawer / Collapsible Menu */}
        <div
          className={cn(
            "max-lg:hidden lg:!block",
            open &&
              "max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
          )}
        >
          {/* Close button (mobile only) */}
          {open && (
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white w-9 h-9 flex items-center justify-center border border-gray-200"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 fill-black" viewBox="0 0 320.591 320.591">
                <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" />
                <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" />
              </svg>
            </button>
          )}

          <ul
            className={cn(
              "lg:flex gap-x-5",
              "max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50",
              open ? "max-lg:block" : "max-lg:hidden"
            )}
          >
            {/* Drawer logo (mobile) */}
            <li className="mb-6 hidden max-lg:block">
              <Link href="/" onClick={() => setOpen(false)}>
                <Image
                  src="https://i.ibb.co/mrw6rY8C/images.jpg"
                  alt="logo"
                  width={144}
                  height={36}
                  className="h-9 w-36 object-contain"
                  unoptimized
                />
              </Link>
            </li>

            {/* Home */}
            <li className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={cn(
                  "block text-base font-medium hover:text-blue-700",
                  mounted && isActive("/") ? "text-blue-700" : "text-slate-900"
                )}
              >
                Home
              </Link>
            </li>

            {/* Course */}
            <li className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3">
              <Link
                href={COURSE_PATH}
                onClick={() => setOpen(false)}
                className={cn(
                  "block text-base font-medium hover:text-blue-700",
                  mounted && isActive(COURSE_PATH) ? "text-blue-700" : "text-slate-900"
                )}
              >
                Course
              </Link>
            </li>

            {/* Login / Sign out (mobile list item) */}
            <li className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3">
              {!mounted ? (
                <Link
                  href="/admin/login"
                  onClick={() => setOpen(false)}
                  className="block text-base font-medium text-slate-900 hover:text-blue-700"
                >
                  Login
                </Link>
              ) : hasToken ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="block text-left w-full text-base font-medium text-slate-900 hover:text-blue-700"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  href="/admin/login"
                  onClick={() => setOpen(false)}
                  className="block text-base font-medium text-slate-900 hover:text-blue-700"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>

        {/* Right side: Auth + Hamburger */}
        <div className="flex items-center max-lg:ml-auto space-x-4">
          <AuthButton />
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="drawer-menu"
          >
            <svg className="w-7 h-7" fill="#000" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Backdrop (mobile) */}
      {open && (
        <button
          aria-label="Close menu overlay"
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 lg:hidden"
        />
      )}
    </header>
  );
}
