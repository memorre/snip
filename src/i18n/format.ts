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

type RelativeStyle = "long" | "short";

function relativeFormat(locale: Locale, style: RelativeStyle) {
  return memo(`r|${locale}|${style}`, () => new Intl.RelativeTimeFormat(locale, { numeric: "auto", style }));
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
 * minute comes back as null so callers can show their own "just now". The "short" style
 * ("38 min. ago", "il y a 38 min", "hace 38 min") suits narrow columns.
 */
export function formatRelative(
  locale: Locale,
  value: Date | string | number,
  style: RelativeStyle = "long",
  now: number = Date.now()
): string | null {
  const seconds = Math.round((new Date(value).getTime() - now) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 60) return null;
  for (const [unit, size] of UNITS) {
    if (abs >= size || unit === "minute") {
      return relativeFormat(locale, style).format(Math.trunc(seconds / size), unit);
    }
  }
  return null;
}

/**
 * Names that read better than ICU's defaults: mainland Chinese readers expect "中国台湾", and the
 * official long names for Hong Kong and Macao ("Hong Kong SAR China", "R.A.S. chinoise de Hong Kong")
 * are too long for the breakdown rows. style "short" is not an option: it abbreviates US/UK too.
 */
const REGION_OVERRIDES: Partial<Record<Locale, Record<string, string>>> = {
  "zh-CN": { TW: "中国台湾", HK: "中国香港", MO: "中国澳门" },
  en: { HK: "Hong Kong", MO: "Macao" },
  fr: { HK: "Hong Kong", MO: "Macao" },
  es: { HK: "Hong Kong", MO: "Macao" },
};

function displayRegion(locale: Locale, code: string): string {
  const upper = code.toUpperCase();
  const override = REGION_OVERRIDES[locale]?.[upper];
  if (override) return override;
  try {
    const names = memo(`g|${locale}`, () => new Intl.DisplayNames([locale], { type: "region", fallback: "code" }));
    return names.of(upper) ?? code;
  } catch {
    return code;
  }
}

/** Country or region name for an ISO 3166 code in the active language, e.g. "US" -> "États-Unis". */
export function regionName(locale: Locale, code: string): string {
  return displayRegion(locale, code);
}

/**
 * Whether a city name from the geo header (always English, e.g. "Singapore", "Hong Kong") is just the
 * name of its country, as for city-states. Callers then show the localized country name alone instead
 * of "Singapore · Singapour".
 */
export function isCountryCity(city: string, code: string | null | undefined): boolean {
  if (!code) return false;
  const name = city.trim().toLowerCase();
  const candidates = [displayRegion("en", code), regionNameEnglishDefault(code)];
  if (code.toUpperCase() === "MO") candidates.push("Macau");
  return candidates.some((c) => c.toLowerCase() === name);
}

function regionNameEnglishDefault(code: string): string {
  try {
    const names = memo("g|en|default", () => new Intl.DisplayNames(["en"], { type: "region", fallback: "code" }));
    return names.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}
