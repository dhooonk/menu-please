# 메뉴를 부탁해 🍳

냉장고 안의 재료로 무엇을 해먹을지 ChatGPT에게 빠르게 물어보고, 추천받은 메뉴의 레시피를 한 번에 검색하는 웹앱.

- 백엔드 없음, 100% 클라이언트 (모든 상태는 브라우저 `localStorage`)
- 좌측 사이드바는 모든 화면에서 영구 유지 (Next.js App Router의 layout 보존)
- ChatGPT API 미사용 — 자동 생성된 프롬프트를 복사해 ChatGPT에 붙여넣고 받은 답변을 다시 붙여넣는 방식

## 동작 흐름

1. **재료 선택** (`/`) — 상온/냉장/냉동 탭에서 자주 쓰는 재료(약 100개)를 체크하거나 직접 추가합니다. 검색창과 사이드바 즉시 반영.
2. **메뉴 추천** (`/recommend`) — 인분/시간/난이도/식단 옵션을 고르면 프롬프트가 자동 갱신됩니다. **복사하기** + **ChatGPT 열기** → 응답을 다시 textarea에 붙여넣기 → 메뉴 카드 자동 파싱.
3. **레시피 검색** — 메뉴 카드의 🔍 버튼이나 카드 영역 클릭 → 새 탭에서 `메뉴이름 레시피` 구글 검색.
4. **즐겨찾기 / 히스토리 / 장보기** — 카드의 ★, 🛒 버튼 또는 사이드바 네비로 관리.

## 라우트 (6개)

| 경로 | 화면 | 핵심 기능 |
|---|---|---|
| `/` | 재료 선택 | 카테고리 탭, 재료 검색, 직접 추가, 공유 링크 import 배너 |
| `/recommend` | 메뉴 추천 | 옵션 패널, 프롬프트 카드(복사·ChatGPT 열기), 응답 파싱, 메뉴 카드 |
| `/favorites` | 즐겨찾기 | ★ 표시한 메뉴 모음, 클릭 시 레시피 검색 |
| `/history` | 히스토리 | 자동 저장된 추천 세션(최대 50개), "다시 사용"으로 복원 |
| `/shopping` | 장보기 | 부족한 재료 체크리스트, 체크된 항목 일괄 비우기 |
| `/settings` | 설정 | 프롬프트 템플릿 편집, 미리보기 |

## 사이드바 액션 (모든 화면)

- **메뉴 추천 받기** — 선택 재료가 1개 이상일 때 활성화
- **↶ 되돌리기** — 재료 선택 변경 직전 상태로 복원 (in-memory 스택, 최대 30단계)
- **🔗 공유 링크** — 현재 선택을 base64 URL로 인코딩해 클립보드 복사. 받은 링크를 열면 import 배너 노출
- **전체 초기화** — 선택 재료 일괄 비우기

## 스택

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS 3
- 외부 상태 라이브러리 미사용 (`useLocalStorage` 훅의 module-level subscribe 패턴)

## 개발

```bash
npm install
npm run dev    # http://localhost:3000
```

빌드:
```bash
npm run build
npm start
```

## 디렉터리 구조

```
menu-please/
├── app/
│   ├── layout.tsx              # 사이드바 + 메인 (사이드바 영구 유지)
│   ├── page.tsx                # / — Suspense + HomeClient
│   ├── recommend/page.tsx      # /recommend
│   ├── favorites/page.tsx      # /favorites
│   ├── history/page.tsx        # /history
│   ├── shopping/page.tsx       # /shopping
│   ├── settings/page.tsx       # /settings
│   └── globals.css
├── src/
│   ├── components/             # Sidebar, OptionsPanel, MenuList, …
│   ├── data/ingredients.ts     # 100여개 재료 (3카테고리)
│   ├── hooks/useLocalStorage.ts
│   └── lib/                    # prompt, parseMenu, options, template,
│                               # storage, share, undo, favorites,
│                               # history, shopping
├── package.json
└── README.md
```

## localStorage 키

| 키 | 설명 |
|---|---|
| `mp:selected` | 선택된 재료 (`SelectedMap`) |
| `mp:custom` | 사용자가 직접 추가한 재료 |
| `mp:lastResponse` | 마지막으로 붙여넣은 ChatGPT 응답 |
| `mp:options` | 추천 옵션 (인분/시간/난이도/식단) |
| `mp:template` | 사용자 정의 프롬프트 템플릿 |
| `mp:favorites` | 즐겨찾기 메뉴 배열 |
| `mp:history` | 추천 히스토리 (최대 50개) |
| `mp:shopping` | 장보기 항목 |
