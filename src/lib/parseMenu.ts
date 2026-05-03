export type ParsedMenu = { name: string; desc?: string };

export function parseMenuList(text: string): ParsedMenu[] {
  if (!text) return [];
  const lines = text.split("\n");
  const out: ParsedMenu[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    // matches "1. 이름 - 설명", "1) 이름", "- 이름", "• 이름", "* 이름"
    const m = line.match(
      /^(?:\d+[.)]\s*|[-•*]\s+)(.+?)(?:\s*(?:-|:|–|—)\s*(.+))?$/
    );
    if (m) {
      const name = m[1].trim();
      const desc = m[2]?.trim();
      if (name) out.push({ name, desc });
    }
  }
  // fallback: if no bullet/number found and the text has multiple lines, treat each non-empty line as a menu
  if (out.length === 0) {
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;
      out.push({ name: line });
    }
  }
  return out;
}

export function recipeSearchUrl(menu: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(menu + " 레시피")}`;
}
