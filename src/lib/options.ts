export type Servings = "1인분" | "2인분" | "4인분" | "상관없음";
export type CookTime = "10분 이내" | "30분 이내" | "1시간 이내" | "상관없음";
export type Difficulty = "간단" | "보통" | "고급" | "상관없음";

export const SERVINGS_OPTIONS: Servings[] = [
  "1인분",
  "2인분",
  "4인분",
  "상관없음",
];
export const TIME_OPTIONS: CookTime[] = [
  "10분 이내",
  "30분 이내",
  "1시간 이내",
  "상관없음",
];
export const DIFFICULTY_OPTIONS: Difficulty[] = [
  "간단",
  "보통",
  "고급",
  "상관없음",
];

export const DIET_PRESETS = [
  "다이어트",
  "자취생",
  "아이 반찬",
  "해장",
  "야식",
  "건강식",
];

export type RecommendOptions = {
  servings: Servings;
  time: CookTime;
  difficulty: Difficulty;
  diets: string[];
};

export const DEFAULT_OPTIONS: RecommendOptions = {
  servings: "상관없음",
  time: "상관없음",
  difficulty: "상관없음",
  diets: [],
};

export const KEY_OPTIONS = "mp:options";
