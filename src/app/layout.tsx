import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getLocale, getT } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: { default: t("meta.title"), template: "%s · Snip" },
    description: t("meta.description"),
    applicationName: "Snip",
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Resolved per request from the "lang" cookie, then Accept-Language, so the first paint is already
  // in the right language. The UI shell (providers, nav, dictionary) is added by app/(site)/layout.tsx
  // and app/not-found.tsx, so the /[slug] redirect route does no more than read the locale.
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning className="h-full">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
