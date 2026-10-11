import type { Locale } from "../config";
import type { Dictionary } from "../types";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { zhCN } from "./zh-CN";

export const dictionaries: Record<Locale, Dictionary> = {
  "zh-CN": zhCN,
  en,
  fr,
  es,
};
