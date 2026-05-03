export const DEFAULT_TEMPLATE = `다음 재료들로 한국 가정에서 만들 수 있는 메뉴 5가지를 추천해줘.
- 인분: {{servings}}
- 조리시간: {{time}}
- 난이도: {{difficulty}}
- 식단/스타일: {{diets}}

각 메뉴는 한 줄에 하나씩 "1. 메뉴이름 - 한 줄 설명" 형식으로 답해줘.

재료: {{ingredients}}`;

export const KEY_TEMPLATE = "mp:template";

export function applyTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    vars[key] ?? `{{${key}}}`
  );
}

export const TEMPLATE_PLACEHOLDERS = [
  { key: "ingredients", desc: "선택한 재료 (콤마로 구분)" },
  { key: "servings", desc: "인분 옵션" },
  { key: "time", desc: "조리시간 옵션" },
  { key: "difficulty", desc: "난이도 옵션" },
  { key: "diets", desc: "식단/스타일 (콤마로 구분, 없으면 \"상관없음\")" },
];
