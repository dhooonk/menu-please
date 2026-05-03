"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  EMPTY_SELECTED,
  KEY_SELECTED,
  totalCount,
  type SelectedMap,
} from "@/lib/storage";
import { STORAGE_TYPES, type StorageType } from "@/data/ingredients";
import { popUndo, pushUndo, useUndoSize } from "@/lib/undo";
import { buildShareUrl } from "@/lib/share";

const NAV: { href: string; label: string; emoji: string }[] = [
  { href: "/", label: "재료 선택", emoji: "🥬" },
  { href: "/recommend", label: "메뉴 추천", emoji: "🍽️" },
  { href: "/favorites", label: "즐겨찾기", emoji: "⭐" },
  { href: "/history", label: "히스토리", emoji: "🕒" },
  { href: "/shopping", label: "장보기", emoji: "🛒" },
  { href: "/settings", label: "설정", emoji: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [selected, setSelected] = useLocalStorage<SelectedMap>(
    KEY_SELECTED,
    EMPTY_SELECTED
  );
  const undoSize = useUndoSize();
  const [shared, setShared] = useState(false);

  const total = totalCount(selected);

  const change = (
    updater: (prev: SelectedMap) => SelectedMap
  ) => {
    pushUndo(selected);
    setSelected(updater);
  };

  const onUndo = () => {
    const prev = popUndo();
    if (prev) setSelected(prev);
  };

  const onShare = async () => {
    if (total === 0) return;
    const url = buildShareUrl(selected);
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } catch {
      window.prompt("이 링크를 복사하세요:", url);
    }
  };

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-stone-200 bg-white p-4">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="text-2xl">🍳</span>
        <h1 className="text-lg font-bold text-stone-800">메뉴를 부탁해</h1>
      </div>

      <nav className="mb-5 flex flex-col gap-0.5">
        {NAV.map(({ href, label, emoji }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-brand-100 text-brand-700 font-semibold"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mb-2 flex items-center justify-between px-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          선택 재료
        </h2>
        <span className="text-xs text-stone-500">총 {total}개</span>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {total === 0 ? (
          <p className="text-xs text-stone-400">
            아직 선택한 재료가 없어요.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {STORAGE_TYPES.map((cat: StorageType) => {
              const items = Array.from(new Set(selected[cat]));
              if (items.length === 0) return null;
              return (
                <div key={cat}>
                  <div className="mb-1 text-[11px] font-semibold text-stone-400">
                    {cat} ({items.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {items.map((name) => (
                      <button
                        key={name}
                        onClick={() =>
                          change((prev) => ({
                            ...prev,
                            [cat]: prev[cat].filter((x) => x !== name),
                          }))
                        }
                        title="클릭하여 제거"
                        className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-700 hover:bg-red-100 hover:text-red-700 hover:line-through"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-stone-200 pt-4">
        <button
          disabled={total === 0}
          onClick={() => router.push("/recommend")}
          className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          메뉴 추천 받기 →
        </button>
        <div className="flex gap-2">
          <button
            disabled={undoSize === 0}
            onClick={onUndo}
            title={undoSize > 0 ? `되돌리기 (${undoSize}회 남음)` : "되돌릴 작업이 없어요"}
            className="flex-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ↶ 되돌리기
          </button>
          <button
            disabled={total === 0}
            onClick={onShare}
            title="현재 선택을 URL로 공유"
            className="flex-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {shared ? "✓ 복사됨" : "🔗 공유 링크"}
          </button>
        </div>
        <button
          disabled={total === 0}
          onClick={() => {
            if (confirm("선택한 재료를 모두 비울까요?")) {
              pushUndo(selected);
              setSelected(EMPTY_SELECTED);
            }
          }}
          className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs text-stone-500 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          전체 초기화
        </button>
      </div>
    </aside>
  );
}
