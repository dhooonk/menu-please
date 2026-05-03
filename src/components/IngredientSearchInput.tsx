"use client";

export function IngredientSearchInput({
  value,
  onChange,
  placeholder = "재료 검색…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white p-1.5 ring-1 ring-stone-200 focus-within:ring-2 focus-within:ring-brand-500">
      <span className="pl-2 text-stone-400">🔎</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-stone-400"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="px-2 text-xs text-stone-400 hover:text-stone-700"
        >
          ✕
        </button>
      )}
    </div>
  );
}
