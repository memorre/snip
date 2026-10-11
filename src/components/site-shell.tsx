import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { getDictionary, getLocale } from "@/i18n/server";

/**
 * The app's UI shell: providers (with the active dictionary), the frosted nav and <main>. Used by the
 * (site) group's layout rather than the root layout, so the /[slug] redirect route never renders it or
 * ships the dictionary.
 */
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <Providers locale={locale} dictionary={getDictionary(locale)}>
      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>
    </Providers>
  );
}
