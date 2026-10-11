// Locale settings shared by the server and the browser. Keep this file free of server-only imports.

export const LOCALES = ["zh-CN", "en", "fr", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Cookie shared with yetao.org and its other subdomains. */
export const LOCALE_COOKIE = "lang";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Menu labels, always written in their own language. */
export const LOCALE_LABELS: Record<Locale, string> = {
  "zh-CN": "简体中文",
  en: "English",
  fr: "Français",
  es: "Español",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Maps any language tag onto a supported locale: zh* -> zh-CN, fr* -> fr, es* -> es, en* -> en. */
export function normalizeLocale(tag: string | null | undefined): Locale | null {
  const v = String(tag ?? "").trim().toLowerCase();
  if (v.startsWith("zh")) return "zh-CN";
  if (v.startsWith("fr")) return "fr";
  if (v.startsWith("es")) return "es";
  if (v.startsWith("en")) return "en";
  return null;
}

/** Picks the best supported locale from an Accept-Language header, honouring q-values. */
export function matchAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const quality = q ? Number.parseFloat(q.slice(2)) : 1;
      return { tag, quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter((entry) => entry.tag && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const { tag } of ranked) {
    const locale = normalizeLocale(tag);
    if (locale) return locale;
  }
  return null;
}

/** The cookie is shared across yetao.org subdomains in production, and host-only elsewhere (localhost). */
export function localeCookieDomain(hostname: string): string | undefined {
  const host = hostname.toLowerCase();
  return host === "yetao.org" || host.endsWith(".yetao.org") ? "yetao.org" : undefined;
}

export function serializeLocaleCookie(locale: Locale, hostname: string): string {
  const domain = localeCookieDomain(hostname);
  return [
    `${LOCALE_COOKIE}=${locale}`,
    "Path=/",
    `Max-Age=${LOCALE_COOKIE_MAX_AGE}`,
    "SameSite=Lax",
    domain ? `Domain=${domain}` : null,
  ]
    .filter(Boolean)
    .join("; ");
}
