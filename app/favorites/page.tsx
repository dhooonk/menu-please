"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { KEY_FAVORITES, type Favorite } from "@/lib/favorites";
import { recipeSearchUrl } from "@/lib/parseMenu";

function formatDate(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function FavoritesPage() {
  const [favs, setFavs] = useLocalStorage<Favorite[]>(KEY_FAVORITES, []);

  const remove = (name: string) =>
    setFavs((prev) => prev.filter((f) => f.name !== name));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">즐겨찾기</h2>
        <p className="mt-1 text-sm text-stone-500">
          ★ 표시한 메뉴들이 여기에 모입니다. 이름을 클릭하면 레시피를 검색해요.
        </p>
      </div>

      {favs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-200 bg-white p-10 text-center">
          <div className="mb-2 text-3xl">⭐</div>
          <p className="text-sm text-stone-500">
            아직 즐겨찾기한 메뉴가 없어요. 추천받은 메뉴 카드의 ☆ 버튼을 눌러
            저장하세요.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {favs.map((f) => (
            <li
              key={f.name}
              className="group flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-4 hover:border-brand-500 hover:shadow-sm"
            >
              <span className="text-yellow-500">★</span>
              <a
                href={recipeSearchUrl(f.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0"
              >
                <div className="truncate font-semibold text-stone-800 group-hover:text-brand-700">
                  {f.name}
                </div>
                {f.desc && (
                  <div className="mt-0.5 truncate text-xs text-stone-500">
                    {f.desc}
                  </div>
                )}
              </a>
              <span className="text-xs text-stone-400">
                {formatDate(f.savedAt)}
              </span>
              <button
                onClick={() => remove(f.name)}
                className="rounded-md p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500"
                title="즐겨찾기 해제"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
