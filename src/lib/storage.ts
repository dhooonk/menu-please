import type { StorageType } from "@/data/ingredients";

export type SelectedMap = Record<StorageType, string[]>;

export const EMPTY_SELECTED: SelectedMap = { 상온: [], 냉장: [], 냉동: [] };

export const KEY_SELECTED = "mp:selected";
export const KEY_CUSTOM = "mp:custom";
export const KEY_LAST_RESPONSE = "mp:lastResponse";

export function flatten(map: SelectedMap): string[] {
  return [...map.상온, ...map.냉장, ...map.냉동];
}

export function totalCount(map: SelectedMap): number {
  return map.상온.length + map.냉장.length + map.냉동.length;
}
