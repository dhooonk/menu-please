"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { KEY_SHOPPING, type ShoppingItem } from "@/lib/shopping";

export default function ShoppingPage() {
  const [items, setItems] = useLocalStorage<ShoppingItem[]>(KEY_SHOPPING, []);
  const [text, setText] = useState("");

  const add = () => {
    const name = text.trim();
    if (!name) return;
    setItems((prev) => {
      if (prev.some((p) => p.name === name)) return prev;
      return [{ name, checked: false, addedAt: Date.now() }, ...prev];
    });
    setText("");
  };

  const toggle = (name: string) =>
    setItems((prev) =>
      prev.map((p) => (p.name === name ? { ...p, checked: !p.checked } : p))
    );

  const remove = (name: string) =>
    setItems((prev) => prev.filter((p) => p.name !== name));

  const clearChecked = () =>
    setItems((prev) => prev.filter((p) => !p.checked));

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">장보기 리스트</h2>
        <p className="mt-1 text-sm text-stone-500">
          메뉴 카드의 🛒 버튼이나 아래 입력창으로 항목을 추가할 수 있어요.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-white p-1.5 ring-1 ring-stone-200 focus-within:ring-2 focus-within:ring-brand-500">
        <span className="pl-2 text-stone-400">🛒</span>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            if (e.nativeEvent.isComposing || e.keyCode === 229) return;
            add();
          }}
          placeholder="살 재료 입력 후 Enter"
          className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-stone-400"
        />
        <button
          onClick={add}
          disabled={!text.trim()}
          className="rounded-md bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          추가
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-200 bg-white p-10 text-center">
          <div className="mb-2 text-3xl">🛒</div>
          <p className="text-sm text-stone-500">아직 장볼 재료가 없어요.</p>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-1.5">
            {items.map((it) => (
              <li
                key={it.name}
                className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2.5"
              >
                <input
                  type="checkbox"
                  checked={it.checked}
                  onChange={() => toggle(it.name)}
                  className="h-4 w-4 cursor-pointer accent-brand-500"
                />
                <span
                  onClick={() => toggle(it.name)}
                  className={`flex-1 cursor-pointer text-sm ${
                    it.checked
                      ? "text-stone-400 line-through"
                      : "text-stone-800"
                  }`}
                >
                  {it.name}
                </span>
                <button
                  onClick={() => remove(it.name)}
                  className="rounded-md p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          {checkedCount > 0 && (
            <button
              onClick={clearChecked}
              className="self-start rounded-md border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-50"
            >
              체크된 {checkedCount}개 비우기
            </button>
          )}
        </>
      )}
    </div>
  );
}
