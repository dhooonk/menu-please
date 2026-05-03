"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { PromptCard } from "@/components/PromptCard";
import { MenuList } from "@/components/MenuList";
import { OptionsPanel } from "@/components/OptionsPanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  EMPTY_SELECTED,
  KEY_LAST_RESPONSE,
  KEY_SELECTED,
  totalCount,
  type SelectedMap,
} from "@/lib/storage";
import { buildPrompt } from "@/lib/prompt";
import { parseMenuList } from "@/lib/parseMenu";
import {
  DEFAULT_OPTIONS,
  KEY_OPTIONS,
  type RecommendOptions,
} from "@/lib/options";
import { DEFAULT_TEMPLATE, KEY_TEMPLATE } from "@/lib/template";
import {
  KEY_HISTORY,
  MAX_HISTORY,
  makeId,
  type HistoryEntry,
} from "@/lib/history";

export default function RecommendPage() {
  const [selected] = useLocalStorage<SelectedMap>(KEY_SELECTED, EMPTY_SELECTED);
  const [response, setResponse] = useLocalStorage<string>(
    KEY_LAST_RESPONSE,
    ""
  );
  const [options, setOptions] = useLocalStorage<RecommendOptions>(
    KEY_OPTIONS,
    DEFAULT_OPTIONS
  );
  const [template] = useLocalStorage<string>(KEY_TEMPLATE, DEFAULT_TEMPLATE);
  const [, setHistory] = useLocalStorage<HistoryEntry[]>(KEY_HISTORY, []);

  const total = totalCount(selected);
  const prompt = useMemo(
    () => buildPrompt(selected, options, template),
    [selected, options, template]
  );
  const menus = useMemo(() => parseMenuList(response), [response]);

  // auto-save history when response is parsed and stable
  const lastSavedRef = useRef<string>("");
  useEffect(() => {
    const trimmed = response.trim();
    if (!trimmed || menus.length === 0) return;
    if (trimmed === lastSavedRef.current) return;
    const t = setTimeout(() => {
      lastSavedRef.current = trimmed;
      setHistory((prev) => {
        // dedupe: same response text, same selected hash
        const last = prev[0];
        if (last && last.response.trim() === trimmed) return prev;
        const entry: HistoryEntry = {
          id: makeId(),
          createdAt: Date.now(),
          ingredients: selected,
          response: trimmed,
          menus,
        };
        return [entry, ...prev].slice(0, MAX_HISTORY);
      });
    }, 1500);
    return () => clearTimeout(t);
  }, [response, menus, selected, setHistory]);

  if (total === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-stone-800">메뉴 추천</h2>
        <div className="rounded-xl border border-dashed border-stone-200 bg-white p-10 text-center">
          <div className="mb-3 text-4xl">🥬</div>
          <p className="mb-1 text-sm font-semibold text-stone-700">
            먼저 재료를 선택해주세요
          </p>
          <p className="mb-4 text-xs text-stone-500">
            냉장고에 있는 재료를 골라야 메뉴를 추천받을 수 있어요.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            재료 선택하러 가기 →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">메뉴 추천</h2>
        <p className="mt-1 text-sm text-stone-500">
          옵션을 골라 프롬프트를 다듬고, ChatGPT에 붙여넣은 답변을 다시 아래에
          붙여넣으세요.
        </p>
      </div>

      <OptionsPanel options={options} onChange={setOptions} />

      <PromptCard prompt={prompt} />

      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span>📥</span>
          <h3 className="text-sm font-semibold text-stone-700">
            ChatGPT 응답 붙여넣기
          </h3>
          <span className="ml-auto text-xs text-stone-400">
            붙여넣으면 자동으로 히스토리에 저장됩니다
          </span>
        </div>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder={`예시)\n1. 김치찌개 - 신김치와 돼지고기로 끓인 매콤한 찌개\n2. 두부조림 - 간장 양념의 부드러운 두부조림`}
          className="min-h-[140px] w-full rounded-lg bg-stone-50 p-3 text-sm leading-relaxed text-stone-700 outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-brand-500"
        />
        {response && (
          <button
            onClick={() => setResponse("")}
            className="mt-2 text-xs text-stone-400 hover:text-stone-600"
          >
            지우기
          </button>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <span>🍽️</span>
          <h3 className="text-sm font-semibold text-stone-700">
            추천 메뉴 {menus.length > 0 && `(${menus.length})`}
          </h3>
          <span className="ml-auto text-xs text-stone-400">
            ★ 즐겨찾기 · 🛒 장보기 · 🔍 레시피 검색
          </span>
        </div>
        <MenuList menus={menus} />
      </div>
    </div>
  );
}
