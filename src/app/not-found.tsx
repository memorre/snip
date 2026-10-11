import { getLocale } from "@/i18n/server";
import { NotFoundShell } from "@/components/not-found-shell";

// Unknown URLs and missing short links (/[slug]) render here, outside the (site) group, so this page
// brings its own shell. It stays a thin server wrapper: see NotFoundShell for why.
export default async function NotFound() {
  return <NotFoundShell locale={await getLocale()} />;
}
