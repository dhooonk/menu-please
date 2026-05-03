"use client";

import { useState } from "react";

export function PromptCard({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback: select textarea
      alert("복사에 실패했어요. 텍스트를 직접 선택해 복사해주세요.");
    }
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span>📋</span>
        <h3 className="text-sm font-semibold text-stone-700">
          ChatGPT용 프롬프트
        </h3>
      </div>
      <pre className="mb-4 whitespace-pre-wrap break-words rounded-lg bg-stone-50 p-4 text-sm leading-relaxed text-stone-700 ring-1 ring-stone-100">
        {prompt}
      </pre>
      <div className="flex gap-2">
        <button
          onClick={copy}
          className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
        >
          {copied ? "✓ 복사됨" : "복사하기"}
        </button>
        <a
          href="https://chat.openai.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          ChatGPT 열기 ↗
        </a>
      </div>
    </div>
  );
}
