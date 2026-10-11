// Locale-aware formatting built on Intl. Formatter instances are cached per locale and options.

import type { Locale } from "./config";

const cache = new Map<string, unknown>();

function memo<T>(key: string, create: () => T): T {
  let value = cache.get(key) as T | undefined;
  if (!value) {
    value = create();
    cache.set(key, value);
  }
  return value;
}

export function numberFormat(locale: Locale, options: Intl.NumberFormatOptions = {}) {
  return memo(`n|${locale}|${JSON.stringify(options)}`, () => new Intl.NumberFormat(locale, options));
}

export function dateFormat(locale: Locale, options: Intl.DateTimeFormatOptions) {
  return memo(`d|${locale}|${JSON.stringify(options)}`, () => new Intl.DateTimeFormat(locale, options));
}

export function pluralRules(locale: Locale) {
  return memo(`p|${locale}`, () => new Intl.PluralRules(locale));
}

function relativeFormat(locale: Locale) {
  return memo(`r|${locale}`, () => new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "long" }));
}

export function formatNumber(locale: Locale, value: number, options?: Intl.NumberFormatOptions) {
  return numberFormat(locale, options).format(value);
}

export function formatDate(locale: Locale, value: Date | string | number, options: Intl.DateTimeFormatOptions) {
  return dateFormat(locale, options).format(new Date(value));
}

/**
 * A "YYYY-MM-DD" day bucket (UTC) as a short date, e.g. "Oct 11", "11 oct.", "10月11日".
 */
export function formatDay(locale: Locale, isoDay: string, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }) {
  return dateFormat(locale, { ...options, timeZone: "UTC" }).format(new Date(`${isoDay}T00:00:00Z`));
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

/**
 * Relative time such as "3 days ago", "il y a 3 jours", "hace 3 días", "3天前". Anything under a
 * minute comes back as null so callers can show their own "just now".
 */
export function formatRelative(locale: Locale, value: Date | string | number, now: number = Date.now()): string | null {
  const seconds = Math.round((new Date(value).getTime() - now) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 60) return null;
  for (const [unit, size] of UNITS) {
    if (abs >= size || unit === "minute") {
      return relativeFormat(locale).format(Math.trunc(seconds / size), unit);
    }
  }
  return null;
}

/** Country or region name for an ISO 3166 code in the active language, e.g. "US" -> "États-Unis". */
export function regionName(locale: Locale, code: string): string {
  try {
    const names = memo(`g|${locale}`, () => new Intl.DisplayNames([locale], { type: "region", fallback: "code" }));
    return names.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}
