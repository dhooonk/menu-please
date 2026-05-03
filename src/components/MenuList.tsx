"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  KEY_FAVORITES,
  isFavorite,
  toggleFavorite,
  type Favorite,
} from "@/lib/favorites";
import { recipeSearchUrl, type ParsedMenu } from "@/lib/parseMenu";
import { KEY_SHOPPING, type ShoppingItem } from "@/lib/shopping";

export function MenuList({ menus }: { menus: ParsedMenu[] }) {
  const [favs, setFavs] = useLocalStorage<Favorite[]>(KEY_FAVORITES, []);
  const [shopping, setShopping] = useLocalStorage<ShoppingItem[]>(
    KEY_SHOPPING,
    []
  );

  if (menus.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-200 bg-white p-8 text-center">
        <p className="text-sm text-stone-400">
          위에 ChatGPT 응답을 붙여넣으면 추천 메뉴가 여기에 표시돼요.
        </p>
      </div>
    );
  }

  const onShop = (menuName: string) => {
    const input = window.prompt(
      `"${menuName}" 만들기에 부족한 재료를 입력하세요.\n(여러 개는 콤마로 구분)`
    );
    if (!input) return;
    const items = input
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    if (items.length === 0) return;
    setShopping((prev) => {
      const existing = new Set(prev.map((p) => p.name));
      const additions: ShoppingItem[] = items
        .filter((n) => !existing.has(n))
        .map((n) => ({ name: n, checked: false, addedAt: Date.now() }));
      return [...additions, ...prev];
    });
  };

  return (
    <ol className="flex flex-col gap-2">
      {menus.map((m, i) => {
        const fav = isFavorite(favs, m.name);
        return (
          <li
            key={`${m.name}-${i}`}
            className="group flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-4 transition hover:border-brand-500 hover:shadow-sm"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {i + 1}
            </span>
            <a
              href={recipeSearchUrl(m.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-0"
              title="클릭하면 새 탭에서 레시피를 검색합니다"
            >
              <div className="truncate font-semibold text-stone-800 group-hover:text-brand-700">
                {m.name}
              </div>
              {m.desc && (
                <div className="mt-0.5 truncate text-xs text-stone-500">
                  {m.desc}
                </div>
              )}
            </a>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onShop(m.name)}
                title="이 메뉴에 부족한 재료를 장보기 리스트에 추가"
                className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                🛒
              </button>
              <button
                onClick={() =>
                  setFavs((prev) =>
                    toggleFavorite(prev, { name: m.name, desc: m.desc })
                  )
                }
                title={fav ? "즐겨찾기 해제" : "즐겨찾기에 추가"}
                className={`rounded-md p-1.5 transition ${
                  fav
                    ? "text-yellow-500 hover:bg-yellow-50"
                    : "text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                }`}
              >
                {fav ? "★" : "☆"}
              </button>
              <a
                href={recipeSearchUrl(m.name)}
                target="_blank"
                rel="noopener noreferrer"
                title="레시피 검색"
                className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                🔍
              </a>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
