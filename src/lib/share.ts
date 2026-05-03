import type { SelectedMap } from "./storage";

function toBase64Url(input: string): string {
  const b64 =
    typeof window !== "undefined"
      ? btoa(unescape(encodeURIComponent(input)))
      : Buffer.from(input, "utf8").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(token: string): string {
  const padded = token.replace(/-/g, "+").replace(/_/g, "/");
  const fill = "=".repeat((4 - (padded.length % 4)) % 4);
  return typeof window !== "undefined"
    ? decodeURIComponent(escape(atob(padded + fill)))
    : Buffer.from(padded + fill, "base64").toString("utf8");
}

export function encodeSelected(s: SelectedMap): string {
  return toBase64Url(JSON.stringify(s));
}

export function decodeSelected(token: string): SelectedMap | null {
  try {
    const json = fromBase64Url(token);
    const parsed = JSON.parse(json);
    if (
      parsed &&
      Array.isArray(parsed.상온) &&
      Array.isArray(parsed.냉장) &&
      Array.isArray(parsed.냉동)
    ) {
      return {
        상온: parsed.상온.filter((x: unknown) => typeof x === "string"),
        냉장: parsed.냉장.filter((x: unknown) => typeof x === "string"),
        냉동: parsed.냉동.filter((x: unknown) => typeof x === "string"),
      };
    }
  } catch {
    // ignore
  }
  return null;
}

export function buildShareUrl(s: SelectedMap): string {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.origin);
  url.searchParams.set("s", encodeSelected(s));
  return url.toString();
}
