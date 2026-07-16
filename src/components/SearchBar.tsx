"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

function SearchForm({ onComplete }: { onComplete?: () => void }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = value.trim();
    if (!query) return;
    router.push(`/list?name=${encodeURIComponent(query)}`);
    setValue("");
    onComplete?.();
  };

  return (
    <form onSubmit={submit} role="search" className="flex h-11 items-center rounded-lg border border-line bg-white px-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-cyan-100">
      <label htmlFor={onComplete ? "mobile-site-search" : "desktop-site-search"} className="sr-only">Search baby products</label>
      <input
        id={onComplete ? "mobile-site-search" : "desktop-site-search"}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search products"
        className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
        autoFocus={Boolean(onComplete)}
      />
      {value && (
        <button type="button" onClick={() => setValue("")} className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted hover:bg-page hover:text-ink" aria-label="Clear search">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-md text-brand-hover hover:bg-brand-soft" aria-label="Submit search">
        <Search className="h-5 w-5" aria-hidden="true" />
      </button>
    </form>
  );
}

export default function SearchBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [mobileOpen]);

  return (
    <div className="relative">
      <button type="button" onClick={() => setMobileOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-secondary hover:bg-brand-soft hover:text-brand-hover lg:hidden" aria-label="Open product search" aria-expanded={mobileOpen}>
        <Search className="h-5 w-5" aria-hidden="true" />
      </button>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-ink/40 p-4" onMouseDown={(event) => event.target === event.currentTarget && setMobileOpen(false)}>
          <div ref={panelRef} className="mx-auto flex max-w-xl items-center gap-2 rounded-card bg-white p-3 shadow-elevated">
            <button type="button" onClick={() => setMobileOpen(false)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-page hover:text-ink" aria-label="Close product search">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="min-w-0 flex-1"><SearchForm onComplete={() => setMobileOpen(false)} /></div>
          </div>
        </div>
      )}
      <div className="hidden w-52 xl:w-64 lg:block"><SearchForm /></div>
    </div>
  );
}
