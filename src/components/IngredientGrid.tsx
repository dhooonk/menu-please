"use client";

export function IngredientGrid({
  items,
  selected,
  onToggle,
  customItems,
  onRemoveCustom,
}: {
  items: string[];
  selected: string[];
  onToggle: (name: string) => void;
  customItems: string[];
  onRemoveCustom: (name: string) => void;
}) {
  const isSelected = (name: string) => selected.includes(name);

  return (
    <div className="flex flex-col gap-4">
      {customItems.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-semibold text-stone-500">
            직접 추가한 재료
          </div>
          <div className="flex flex-wrap gap-2">
            {customItems.map((name) => (
              <div key={name} className="group relative">
                <button
                  onClick={() => onToggle(name)}
                  className={`rounded-full px-3.5 py-1.5 pr-7 text-sm transition ${
                    isSelected(name)
                      ? "bg-brand-500 text-white"
                      : "bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {name}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveCustom(name);
                  }}
                  title="삭제"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        {customItems.length > 0 && (
          <div className="mb-2 text-xs font-semibold text-stone-500">
            기본 재료
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {items.map((name) => (
            <button
              key={name}
              onClick={() => onToggle(name)}
              className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                isSelected(name)
                  ? "bg-brand-500 text-white shadow-sm"
                  : "bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
