"use client";

import { useState } from "react";

export function CustomIngredientInput({
  category,
  onAdd,
}: {
  category: string;
  onAdd: (name: string) => void;
}) {
  const [text, setText] = useState("");

  const submit = () => {
    const name = text.trim();
    if (!name) return;
    onAdd(name);
    setText("");
  };

  return (
    <div className="flex items-center gap-2 rounded-lg bg-white p-1.5 ring-1 ring-stone-200 focus-within:ring-2 focus-within:ring-brand-500">
      <span className="pl-2 text-stone-400">＋</span>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          // Ignore Enter while a Korean/Japanese IME is still composing —
          // browsers fire it twice (once during composition, once after),
          // which would split the input and add two ingredients.
          if (e.key !== "Enter") return;
          if (e.nativeEvent.isComposing || e.keyCode === 229) return;
          submit();
        }}
        placeholder={`${category}에 직접 재료 추가하기`}
        className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-stone-400"
      />
      <button
        onClick={submit}
        disabled={!text.trim()}
        className="rounded-md bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        추가
      </button>
    </div>
  );
}
