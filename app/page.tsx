import { Suspense } from "react";
import { HomeClient } from "@/components/HomeClient";

export default function HomePage() {
  return (
    <Suspense
      fallback={<div className="text-sm text-stone-400">불러오는 중…</div>}
    >
      <HomeClient />
    </Suspense>
  );
}
