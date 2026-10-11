"use client";

import * as React from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { NotFoundContent } from "@/components/not-found-content";

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  "zh-CN": () => import("@/i18n/dictionaries/zh-CN").then((m) => m.zhCN),
  en: () => import("@/i18n/dictionaries/en").then((m) => m.en),
  fr: () => import("@/i18n/dictionaries/fr").then((m) => m.fr),
  es: () => import("@/i18n/dictionaries/es").then((m) => m.es),
};

const loaded = new Map<Locale, Promise<Dictionary>>();

function loadDictionary(locale: Locale) {
  let promise = loaded.get(locale);
  if (!promise) {
    promise = loaders[locale]();
    loaded.set(locale, promise);
  }
  return promise;
}

function Shell({ locale }: { locale: Locale }) {
  const dictionary = React.use(loadDictionary(locale));
  return (
    <Providers locale={locale} dictionary={dictionary}>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <NotFoundContent />
      </main>
    </Providers>
  );
}

/**
 * The 404 page for unknown URLs and dead short links, with the full nav. Next renders a layout's
 * not-found UI into every response under that layout, including each /[slug] redirect, so this is a
 * Client Component that loads its dictionary itself: a redirect only carries a reference to it, not a
 * rendered page with the whole dictionary.
 */
export function NotFoundShell({ locale }: { locale: Locale }) {
  return (
    <React.Suspense fallback={null}>
      <Shell locale={locale} />
    </React.Suspense>
  );
}
