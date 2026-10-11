import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { getDictionary, getLocale, getT } from "@/i18n/server";

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
  // in the right language.
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning className="h-full">
      <body className="flex min-h-full flex-col">
        <Providers locale={locale} dictionary={getDictionary(locale)}>
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
