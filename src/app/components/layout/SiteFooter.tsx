export default function SiteFooter() {
  return (
    <footer className="border-t bg-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-sm text-neutral-600">
        <p>© {new Date().getFullYear()} LMS. All rights reserved.</p>
        <p className="hidden sm:block">Built with Next.js & Tailwind CSS</p>
      </div>
    </footer>
  );
}
