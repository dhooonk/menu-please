"use client";

import { STORAGE_TYPES, type StorageType } from "@/data/ingredients";

const EMOJI: Record<StorageType, string> = {
  상온: "🌡️",
  냉장: "❄️",
  냉동: "🧊",
};

export function CategoryTabs({
  active,
  onChange,
}: {
  active: StorageType;
  onChange: (next: StorageType) => void;
}) {
  return (
    <div className="flex gap-2">
      {STORAGE_TYPES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            active === cat
              ? "bg-brand-500 text-white shadow-sm"
              : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
          }`}
        >
          <span className="mr-1">{EMOJI[cat]}</span>
          {cat}
        </button>
      ))}
    </div>
  );
}
