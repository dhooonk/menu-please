"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CategoryTabs } from "@/components/CategoryTabs";
import { IngredientGrid } from "@/components/IngredientGrid";
import { CustomIngredientInput } from "@/components/CustomIngredientInput";
import { IngredientSearchInput } from "@/components/IngredientSearchInput";
import { INGREDIENTS, type StorageType } from "@/data/ingredients";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  EMPTY_SELECTED,
  KEY_CUSTOM,
  KEY_SELECTED,
  totalCount,
  type SelectedMap,
} from "@/lib/storage";
import { pushUndo } from "@/lib/undo";
import { decodeSelected } from "@/lib/share";

export function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shareToken = searchParams.get("s");

  const [active, setActive] = useState<StorageType>("상온");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useLocalStorage<SelectedMap>(
    KEY_SELECTED,
    EMPTY_SELECTED
  );
  const [custom, setCustom] = useLocalStorage<SelectedMap>(
    KEY_CUSTOM,
    EMPTY_SELECTED
  );
  const [importPreview, setImportPreview] = useState<SelectedMap | null>(null);

  // share link import banner
  useEffect(() => {
    if (!shareToken) return;
    const decoded = decodeSelected(shareToken);
    if (decoded && totalCount(decoded) > 0) setImportPreview(decoded);
  }, [shareToken]);

  // Cleanup any duplicate entries left over from earlier versions.
  // Re-runs whenever selected/custom change so it also catches data loaded
  // from localStorage after the initial render. Idempotent: when there are
  // no dupes the updater returns prev and useLocalStorage skips the rerender.
  useEffect(() => {
    const dedupeMap = (m: SelectedMap): SelectedMap => ({
      상온: Array.from(new Set(m.상온)),
      냉장: Array.from(new Set(m.냉장)),
      냉동: Array.from(new Set(m.냉동)),
    });
    const sameLengths = (a: SelectedMap, b: SelectedMap) =>
      a.상온.length === b.상온.length &&
      a.냉장.length === b.냉장.length &&
      a.냉동.length === b.냉동.length;

    setCustom((prev) => {
      const next = dedupeMap(prev);
      return sameLengths(prev, next) ? prev : next;
    });
    setSelected((prev) => {
      const next = dedupeMap(prev);
      return sameLengths(prev, next) ? prev : next;
    });
  }, [selected, custom, setCustom, setSelected]);

  const change = (
    updater: (prev: SelectedMap) => SelectedMap,
    state: SelectedMap = selected
  ) => {
    pushUndo(state);
    setSelected(updater);
  };

  const toggle = (name: string) => {
    change((prev) => {
      const has = prev[active].includes(name);
      return {
        ...prev,
        [active]: has
          ? prev[active].filter((x) => x !== name)
          : [...prev[active], name],
      };
    });
  };

  const addCustom = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const isDefault = INGREDIENTS[active].includes(trimmed);

    // Add to custom only if it's not a default and not already in custom.
    // Dedupe inside the updater so rapid re-adds can't insert duplicates.
    if (!isDefault) {
      setCustom((prev) => {
        if (prev[active].includes(trimmed)) return prev;
        return { ...prev, [active]: [...prev[active], trimmed] };
      });
    }

    // Ensure selected. Dedupe inside the updater for the same reason.
    change((prev) =>
      prev[active].includes(trimmed)
        ? prev
        : { ...prev, [active]: [...prev[active], trimmed] }
    );
  };

  const removeCustom = (name: string) => {
    setCustom((prev) => ({
      ...prev,
      [active]: prev[active].filter((x) => x !== name),
    }));
    change((prev) => ({
      ...prev,
      [active]: prev[active].filter((x) => x !== name),
    }));
  };

  const filterFn = (name: string) =>
    !query.trim() || name.toLowerCase().includes(query.trim().toLowerCase());

  const filteredItems = useMemo(
    () => INGREDIENTS[active].filter(filterFn),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active, query]
  );
  const filteredCustom = useMemo(
    () => Array.from(new Set(custom[active].filter(filterFn))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active, query, custom]
  );
  const selectedActive = useMemo(
    () => Array.from(new Set(selected[active])),
    [active, selected]
  );

  const applyImport = () => {
    if (!importPreview) return;
    pushUndo(selected);
    // merge: union of existing + imported
    setSelected((prev) => ({
      상온: Array.from(new Set([...prev.상온, ...importPreview.상온])),
      냉장: Array.from(new Set([...prev.냉장, ...importPreview.냉장])),
      냉동: Array.from(new Set([...prev.냉동, ...importPreview.냉동])),
    }));
    setImportPreview(null);
    router.replace("/");
  };

  const dismissImport = () => {
    setImportPreview(null);
    router.replace("/");
  };

  return (
    <div className="flex flex-col gap-6">
      {importPreview && (
        <div className="rounded-xl border border-brand-500 bg-brand-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span>🔗</span>
            <span className="text-sm font-semibold text-brand-700">
              공유받은 재료가 있어요
            </span>
          </div>
          <p className="mb-3 text-xs text-stone-600">
            상온 {importPreview.상온.length}개 · 냉장 {importPreview.냉장.length}
            개 · 냉동 {importPreview.냉동.length}개를 현재 선택에 추가할까요?
          </p>
          <div className="flex gap-2">
            <button
              onClick={applyImport}
              className="rounded-md bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600"
            >
              적용
            </button>
            <button
              onClick={dismissImport}
              className="rounded-md border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-50"
            >
              무시
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-stone-800">재료 선택</h2>
        <p className="mt-1 text-sm text-stone-500">
          냉장고에 있는 재료를 골라주세요. 좌측 사이드바에서 선택 현황과 공유
          링크를 확인할 수 있어요.
        </p>
      </div>

      <CategoryTabs active={active} onChange={setActive} />

      <IngredientSearchInput value={query} onChange={setQuery} />

      <CustomIngredientInput category={active} onAdd={addCustom} />

      <IngredientGrid
        items={filteredItems}
        selected={selectedActive}
        onToggle={toggle}
        customItems={filteredCustom}
        onRemoveCustom={removeCustom}
      />

      {filteredItems.length === 0 && filteredCustom.length === 0 && (
        <p className="rounded-lg border border-dashed border-stone-200 bg-white p-6 text-center text-sm text-stone-400">
          {query
            ? `"${query}"에 해당하는 재료가 없어요. 위의 "직접 추가"로 등록할 수 있어요.`
            : "이 카테고리에는 아직 재료가 없어요."}
        </p>
      )}
    </div>
  );
}
