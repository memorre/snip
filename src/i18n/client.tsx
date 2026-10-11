"use client";

import * as React from "react";
import type { Locale } from "./config";
import { formatDate, formatDay, formatNumber, formatRelative, regionName } from "./format";
import { createTranslator, type Translator } from "./translator";
import type { Dictionary } from "./types";

type I18nValue = {
  locale: Locale;
  t: Translator;
  fmt: {
    number: (value: number, options?: Intl.NumberFormatOptions) => string;
    date: (value: Date | string | number, options: Intl.DateTimeFormatOptions) => string;
    day: (isoDay: string, options?: Intl.DateTimeFormatOptions) => string;
    /** "3 days ago" in the active language, or the localized "just now" under a minute. */
    relative: (value: Date | string | number) => string;
    /** Like relative(), but null under a minute so callers can phrase "just now" themselves. */
    since: (value: Date | string | number) => string | null;
    region: (code: string) => string;
  };
};

const I18nContext = React.createContext<I18nValue | null>(null);

/** Fed from the root layout with the request's locale and its dictionary (only the active one ships). */
export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const value = React.useMemo<I18nValue>(() => {
    const t = createTranslator(locale, dictionary);
    return {
      locale,
      t,
      fmt: {
        number: (value, options) => formatNumber(locale, value, options),
        date: (value, options) => formatDate(locale, value, options),
        day: (isoDay, options) => formatDay(locale, isoDay, options),
        relative: (value) => formatRelative(locale, value) ?? t("common.justNow"),
        since: (value) => formatRelative(locale, value),
        region: (code) => regionName(locale, code),
      },
    };
  }, [locale, dictionary]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = React.useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}

export function useT(): Translator {
  return useI18n().t;
}
