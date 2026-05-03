import type { ParsedMenu } from "./parseMenu";
import type { SelectedMap } from "./storage";

export type HistoryEntry = {
  id: string;
  createdAt: number;
  ingredients: SelectedMap;
  response: string;
  menus: ParsedMenu[];
};

export const KEY_HISTORY = "mp:history";
export const MAX_HISTORY = 50;

export function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
