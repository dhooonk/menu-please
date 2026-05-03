export type Favorite = {
  name: string;
  desc?: string;
  savedAt: number;
};

export const KEY_FAVORITES = "mp:favorites";

export function isFavorite(list: Favorite[], name: string): boolean {
  return list.some((f) => f.name === name);
}

export function toggleFavorite(
  list: Favorite[],
  entry: { name: string; desc?: string }
): Favorite[] {
  if (isFavorite(list, entry.name)) {
    return list.filter((f) => f.name !== entry.name);
  }
  return [
    { name: entry.name, desc: entry.desc, savedAt: Date.now() },
    ...list,
  ];
}
