import { DEFAULT_OPTIONS, type RecommendOptions } from "./options";
import { DEFAULT_TEMPLATE, applyTemplate } from "./template";
import { flatten, type SelectedMap } from "./storage";

export function buildPrompt(
  selected: SelectedMap,
  options: RecommendOptions = DEFAULT_OPTIONS,
  template: string = DEFAULT_TEMPLATE
): string {
  const ingredients = flatten(selected).join(", ") || "(없음)";
  const diets = options.diets.length > 0 ? options.diets.join(", ") : "상관없음";
  return applyTemplate(template, {
    ingredients,
    servings: options.servings,
    time: options.time,
    difficulty: options.difficulty,
    diets,
  });
}
