"use client";

import * as React from "react";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, normalizeLocale, type Locale } from "@/i18n/config";
import { FALLBACK_ERROR_MESSAGES } from "@/i18n/fallback";

/** The visitor's language without the root layout: the shared "lang" cookie, then the browser's. */
function readLocale(): Locale {
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${LOCALE_COOKIE}=`))
    ?.slice(LOCALE_COOKIE.length + 1);
  if (isLocale(cookie)) return cookie;
  for (const tag of navigator.languages ?? [navigator.language]) {
    const locale = normalizeLocale(tag);
    if (locale) return locale;
  }
  return DEFAULT_LOCALE;
}

const noop = () => () => {};

// Last-resort screen when the root layout itself fails. It renders its own document without the app's
// stylesheet, so it carries a few inline Apple-style rules (light and dark).
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  // The server snapshot is null, so hydration matches and the right language follows straight after.
  const locale = React.useSyncExternalStore(noop, readLocale, () => null) ?? DEFAULT_LOCALE;
  const m = FALLBACK_ERROR_MESSAGES[locale];

  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={locale}>
      <body>
        <title>{`${m.title} · Snip`}</title>
        <style>{`
          :root { color-scheme: light dark; }
          body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", "PingFang SC", "Segoe UI",
              "Microsoft YaHei", "Noto Sans SC", Arial, sans-serif;
            background: #f5f5f7; color: #1d1d1f; text-align: center; -webkit-font-smoothing: antialiased; }
          h1 { margin: 0; font-size: 32px; line-height: 1.1; font-weight: 600; }
          p { margin: 12px 0 0; font-size: 17px; line-height: 1.47; color: #6e6e73; }
          button { margin-top: 32px; height: 48px; padding: 0 24px; border: 0; border-radius: 980px; background: #0071e3;
            color: #fff; font: inherit; font-size: 17px; cursor: pointer; }
          button:hover { background: #0077ed; }
          button:focus-visible { outline: 2px solid #0071e3; outline-offset: 2px; }
          @media (prefers-color-scheme: dark) {
            body { background: #000; color: #f5f5f7; }
            p { color: #a1a1a6; }
          }
        `}</style>
        <main role="alert">
          <h1>{m.title}</h1>
          <p>{m.body}</p>
          <button type="button" onClick={() => retry()}>
            {m.retry}
          </button>
        </main>
      </body>
    </html>
  );
}
