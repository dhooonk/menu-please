"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const close = () => setMobileOpen(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={mobileOpen} onClose={close} />

      {mobileOpen && (
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={close}
          className="fixed inset-0 z-30 bg-stone-900/40 md:hidden"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-stone-200 bg-white px-3 py-2 md:hidden">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-700 hover:bg-stone-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🍳</span>
            <h1 className="text-base font-bold text-stone-800">메뉴를 부탁해</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
