import type { en } from "./dictionaries/en";

/**
 * A message that changes with a count. `other` is required; add the other CLDR categories a language
 * needs (French and Spanish also use `many` for round millions, for example). Selected with
 * Intl.PluralRules from the `count` variable.
 */
export type PluralForms = { other: string } & Partial<Record<"zero" | "one" | "two" | "few" | "many", string>>;

/** Same shape as the English source dictionary, with every message widened to string or PluralForms. */
type Shape<T> = {
  [K in keyof T]: T[K] extends string ? string : T[K] extends { other: string } ? PluralForms : Shape<T[K]>;
};

/** Every locale's dictionary is typed against English, so a missing or extra key is a type error. */
export type Dictionary = Shape<typeof en>;

/** Dotted paths to every message, e.g. "dashboard.title". Namespaces never use the key "other". */
type Paths<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string | PluralForms ? `${Prefix}${K}` : Paths<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type MessageKey = Paths<Dictionary>;

export type MessageVars = Record<string, string | number>;
