"use client";

import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  EMPTY_SELECTED,
  KEY_LAST_RESPONSE,
  KEY_SELECTED,
  totalCount,
  type SelectedMap,
} from "@/lib/storage";
import { KEY_HISTORY, type HistoryEntry } from "@/lib/history";
import { recipeSearchUrl } from "@/lib/parseMenu";

function formatDateTime(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    KEY_HISTORY,
    []
  );
  const [, setSelected] = useLocalStorage<SelectedMap>(
    KEY_SELECTED,
    EMPTY_SELECTED
  );
  const [, setResponse] = useLocalStorage<string>(KEY_LAST_RESPONSE, "");

  const restore = (e: HistoryEntry) => {
    setSelected(e.ingredients);
    setResponse(e.response);
    router.push("/recommend");
  };

  const remove = (id: string) =>
    setHistory((prev) => prev.filter((e) => e.id !== id));

  const clearAll = () => {
    if (history.length === 0) return;
    if (confirm("히스토리를 모두 비울까요?")) setHistory([]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">히스토리</h2>
          <p className="mt-1 text-sm text-stone-500">
            과거 추천 결과를 다시 불러올 수 있어요. (최대 50개 저장)
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-stone-400 hover:text-red-500"
          >
            전체 삭제
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-200 bg-white p-10 text-center">
          <div className="mb-2 text-3xl">🕒</div>
          <p className="text-sm text-stone-500">
            아직 저장된 히스토리가 없어요. ChatGPT 응답을 붙여넣으면 자동
            저장돼요.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {history.map((e) => (
            <li
              key={e.id}
              className="rounded-xl border border-stone-200 bg-white p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-700">
                  {formatDateTime(e.createdAt)}
                </span>
                <span className="text-xs text-stone-400">
                  · 재료 {totalCount(e.ingredients)}개 · 메뉴 {e.menus.length}개
                </span>
                <div className="ml-auto flex gap-1">
                  <button
                    onClick={() => restore(e)}
                    className="rounded-md bg-brand-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-brand-600"
                  >
                    다시 사용
                  </button>
                  <button
                    onClick={() => remove(e.id)}
                    className="rounded-md p-1 text-stone-400 hover:bg-red-50 hover:text-red-500"
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="mb-2 flex flex-wrap gap-1">
                {[
                  ...e.ingredients.상온,
                  ...e.ingredients.냉장,
                  ...e.ingredients.냉동,
                ]
                  .slice(0, 12)
                  .map((n) => (
                    <span
                      key={n}
                      className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] text-stone-600"
                    >
                      {n}
                    </span>
                  ))}
                {totalCount(e.ingredients) > 12 && (
                  <span className="text-[11px] text-stone-400">
                    +{totalCount(e.ingredients) - 12}
                  </span>
                )}
              </div>
              <ol className="flex flex-col gap-0.5">
                {e.menus.map((m, i) => (
                  <li key={`${m.name}-${i}`}>
                    <a
                      href={recipeSearchUrl(m.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-stone-700 hover:text-brand-600 hover:underline"
                    >
                      {i + 1}. {m.name}
                      {m.desc && (
                        <span className="ml-1 text-xs text-stone-400">
                          — {m.desc}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
