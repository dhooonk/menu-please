"use client";

import { useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  DEFAULT_TEMPLATE,
  KEY_TEMPLATE,
  TEMPLATE_PLACEHOLDERS,
} from "@/lib/template";
import { buildPrompt } from "@/lib/prompt";
import {
  EMPTY_SELECTED,
  KEY_SELECTED,
  type SelectedMap,
} from "@/lib/storage";
import {
  DEFAULT_OPTIONS,
  KEY_OPTIONS,
  type RecommendOptions,
} from "@/lib/options";

export default function SettingsPage() {
  const [template, setTemplate] = useLocalStorage<string>(
    KEY_TEMPLATE,
    DEFAULT_TEMPLATE
  );
  const [selected] = useLocalStorage<SelectedMap>(KEY_SELECTED, EMPTY_SELECTED);
  const [options] = useLocalStorage<RecommendOptions>(
    KEY_OPTIONS,
    DEFAULT_OPTIONS
  );

  const preview = useMemo(
    () => buildPrompt(selected, options, template),
    [selected, options, template]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">설정</h2>
        <p className="mt-1 text-sm text-stone-500">
          ChatGPT에 던지는 프롬프트 양식을 자유롭게 편집할 수 있어요.
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span>📝</span>
          <h3 className="text-sm font-semibold text-stone-700">
            프롬프트 템플릿
          </h3>
          <button
            onClick={() => {
              if (confirm("기본값으로 되돌릴까요?")) setTemplate(DEFAULT_TEMPLATE);
            }}
            className="ml-auto text-xs text-stone-400 hover:text-stone-700"
          >
            기본값으로
          </button>
        </div>
        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="min-h-[200px] w-full rounded-lg bg-stone-50 p-3 font-mono text-sm leading-relaxed text-stone-700 outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-brand-500"
        />
        <div className="mt-3">
          <div className="mb-1.5 text-xs font-semibold text-stone-500">
            사용 가능한 변수
          </div>
          <ul className="flex flex-col gap-0.5 text-xs text-stone-600">
            {TEMPLATE_PLACEHOLDERS.map((p) => (
              <li key={p.key}>
                <code className="rounded bg-stone-100 px-1 py-0.5 text-[11px]">
                  {`{{${p.key}}}`}
                </code>{" "}
                — {p.desc}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span>👀</span>
          <h3 className="text-sm font-semibold text-stone-700">
            현재 선택 기준 미리보기
          </h3>
        </div>
        <pre className="whitespace-pre-wrap break-words rounded-lg bg-stone-50 p-4 text-xs leading-relaxed text-stone-700 ring-1 ring-stone-100">
          {preview}
        </pre>
      </div>
    </div>
  );
}
