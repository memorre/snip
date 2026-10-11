import type { Locale } from "./config";

/**
 * The few strings app/global-error.tsx needs. It replaces the root layout, so it has no i18n provider,
 * and importing every dictionary there would ship all four to the browser. Keep in sync with
 * errors.unexpectedTitle / errors.unexpectedBody / errors.retry in the dictionaries.
 */
export const FALLBACK_ERROR_MESSAGES: Record<Locale, { title: string; body: string; retry: string }> = {
  "zh-CN": { title: "出了点问题", body: "请稍后重试。", retry: "重试" },
  en: { title: "Something went wrong", body: "Please try again in a moment.", retry: "Try again" },
  fr: { title: "Une erreur s’est produite", body: "Veuillez réessayer dans un instant.", retry: "Réessayer" },
  es: { title: "Algo salió mal", body: "Inténtalo de nuevo en un momento.", retry: "Reintentar" },
};
