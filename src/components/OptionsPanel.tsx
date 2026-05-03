"use client";

import {
  DIET_PRESETS,
  DIFFICULTY_OPTIONS,
  SERVINGS_OPTIONS,
  TIME_OPTIONS,
  type RecommendOptions,
} from "@/lib/options";

function ChipRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (next: T) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold text-stone-500">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`rounded-full px-3 py-1 text-xs transition ${
              value === opt
                ? "bg-brand-500 text-white"
                : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function OptionsPanel({
  options,
  onChange,
}: {
  options: RecommendOptions;
  onChange: (next: RecommendOptions) => void;
}) {
  const toggleDiet = (name: string) => {
    const has = options.diets.includes(name);
    onChange({
      ...options,
      diets: has
        ? options.diets.filter((d) => d !== name)
        : [...options.diets, name],
    });
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span>⚙️</span>
        <h3 className="text-sm font-semibold text-stone-700">추천 옵션</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <ChipRow
          label="인분"
          value={options.servings}
          options={SERVINGS_OPTIONS}
          onChange={(v) => onChange({ ...options, servings: v })}
        />
        <ChipRow
          label="조리시간"
          value={options.time}
          options={TIME_OPTIONS}
          onChange={(v) => onChange({ ...options, time: v })}
        />
        <ChipRow
          label="난이도"
          value={options.difficulty}
          options={DIFFICULTY_OPTIONS}
          onChange={(v) => onChange({ ...options, difficulty: v })}
        />
      </div>
      <div className="mt-4">
        <div className="mb-1.5 text-xs font-semibold text-stone-500">
          식단 / 스타일 (복수 선택)
        </div>
        <div className="flex flex-wrap gap-1.5">
          {DIET_PRESETS.map((d) => {
            const selected = options.diets.includes(d);
            return (
              <button
                key={d}
                onClick={() => toggleDiet(d)}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  selected
                    ? "bg-brand-500 text-white"
                    : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
