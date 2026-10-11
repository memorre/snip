import "server-only";

import { cache } from "react";
import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, matchAcceptLanguage, type Locale } from "./config";
import { dictionaries } from "./dictionaries";
import { createTranslator } from "./translator";

/**
 * The request's locale: the shared "lang" cookie if valid, then the best Accept-Language match,
 * then English. Memoised per request, so layouts, pages and metadata share one lookup.
 */
export const getLocale = cache(async (): Promise<Locale> => {
  const cookieValue = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieValue)) return cookieValue;
  const accepted = matchAcceptLanguage((await headers()).get("accept-language"));
  return accepted ?? DEFAULT_LOCALE;
});

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

/** Translator for Server Components, Server Actions and Route Handlers. */
export async function getT() {
  const locale = await getLocale();
  return createTranslator(locale, getDictionary(locale));
}
