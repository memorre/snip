import { SiteShell } from "@/components/site-shell";

// Every screen with UI (landing, login, dashboard, analytics) lives in this group, so the /[slug]
// redirect route outside it stays lean.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
