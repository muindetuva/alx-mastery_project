import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-canvas/90 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-18 max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Primary navigation">
        <Link className="flex items-center gap-2 text-xl font-black tracking-tight" href="/">
          <span className="grid size-9 place-items-center rounded-xl bg-brand text-white">S</span>
          Signal
        </Link>
        <ul className="flex items-center gap-3 text-sm font-bold sm:gap-6">
          <li><Link className="rounded-lg px-2 py-2 hover:text-brand" href="/articles">Articles</Link></li>
          <li><Link className="rounded-lg px-2 py-2 hover:text-brand" href="/live-ticker">Live ticker</Link></li>
        </ul>
      </nav>
    </header>
  );
}
