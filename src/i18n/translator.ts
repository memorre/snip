import type { Locale } from "./config";
import { formatNumber, pluralRules } from "./format";
import type { Dictionary, MessageKey, MessageVars, PluralForms } from "./types";

export type Translator = ((key: MessageKey, vars?: MessageVars) => string) & { locale: Locale };

function isPlural(value: unknown): value is PluralForms {
  return typeof value === "object" && value !== null && typeof (value as PluralForms).other === "string";
}

/** Replaces {name} placeholders. Numbers are formatted for the locale (1,234 / 1 234 / 1.234). */
export function interpolate(locale: Locale, message: string, vars?: MessageVars): string {
  if (!vars) return message;
  return message.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = vars[name];
    if (value === undefined) return match;
    return typeof value === "number" ? formatNumber(locale, value) : value;
  });
}

export function createTranslator(locale: Locale, dictionary: Dictionary): Translator {
  const t = (key: MessageKey, vars?: MessageVars) => {
    let node: unknown = dictionary;
    for (const part of key.split(".")) {
      node = (node as Record<string, unknown> | undefined)?.[part];
    }
    if (typeof node === "string") return interpolate(locale, node, vars);
    if (isPlural(node)) {
      const count = Number(vars?.count ?? 0);
      const category = pluralRules(locale).select(count);
      return interpolate(locale, node[category] ?? node.other, vars);
    }
    if (process.env.NODE_ENV !== "production") console.warn(`[i18n] Missing message "${key}" for ${locale}`);
    return key;
  };
  return Object.assign(t, { locale });
}
