"use client";

import * as React from "react";
import Link from "next/link";
import useSWR from "swr";
import { AnimatePresence, motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import { ChevronLeft, Copy, ExternalLink, Laptop, MonitorSmartphone, Smartphone, Tablet } from "lucide-react";
import { toast } from "sonner";
import { fetcher } from "@/lib/fetcher";
import { useLiveClicks } from "@/hooks/use-live-clicks";
import type { LinkStatsDTO } from "@/lib/data";
import { DIRECT_REFERRER, UNKNOWN_LABEL } from "@/lib/stats-labels";
import { useI18n } from "@/i18n/client";
import type { MessageKey } from "@/i18n/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCodeCard } from "@/components/qr-code";

type LinkMeta = {
  slug: string;
  title: string | null;
  targetUrl: string;
  disabled: boolean;
  createdAt: string;
};

type Stats = LinkStatsDTO & { linkId: string };

const DEVICE_META: Record<string, { icon: React.ElementType; color: string; label: MessageKey }> = {
  DESKTOP: { icon: Laptop, color: "var(--chart-blue)", label: "analytics.deviceNames.desktop" },
  MOBILE: { icon: Smartphone, color: "var(--chart-teal)", label: "analytics.deviceNames.mobile" },
  TABLET: { icon: Tablet, color: "var(--chart-orange)", label: "analytics.deviceNames.tablet" },
  OTHER: { icon: MonitorSmartphone, color: "var(--chart-purple)", label: "analytics.deviceNames.otherDevice" },
};
const FALLBACK_DEVICE = DEVICE_META.OTHER;

const RANGES = [7, 30, 90];
const EASE = [0.2, 0.7, 0.2, 1] as const;

/** Turns placeholder keys and codes from the stats API into display text for the active language. */
function useLabels() {
  const { t, fmt } = useI18n();
  return React.useMemo(
    () => ({
      referrer: (label: string) => (label === DIRECT_REFERRER ? t("analytics.direct") : label),
      plain: (label: string) => (label === UNKNOWN_LABEL ? t("analytics.unknown") : label),
      country: (code: string | null) => (!code || code === UNKNOWN_LABEL ? t("analytics.unknown") : fmt.region(code)),
      device: (type: string) => t((DEVICE_META[type] ?? FALLBACK_DEVICE).label),
    }),
    [t, fmt]
  );
}

export function LinkAnalyticsClient({ link, initialStats }: { link: LinkMeta; initialStats: Stats }) {
  const { t, fmt } = useI18n();
  const labels = useLabels();
  const { connected } = useLiveClicks(link.slug, { linkId: initialStats.linkId, announceToasts: true });
  const [days, setDays] = React.useState(30);
  const [origin, setOrigin] = React.useState("");
  React.useEffect(() => {
    // client-only value (no window during SSR) — not a state sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrigin(window.location.origin);
  }, []);

  const { data: stats = initialStats, isLoading } = useSWR<Stats>(`/api/links/${link.slug}/stats?days=${days}`, fetcher, {
    fallbackData: days === 30 ? initialStats : undefined,
    keepPreviousData: true,
    refreshInterval: 15000,
  });

  const shortUrl = origin ? `${origin}/${link.slug}` : null;
  const average = stats.daily.length ? stats.totalClicks / stats.daily.length : 0;

  const chartData = stats.daily.map((d) => ({ date: d.date, label: fmt.day(d.date), clicks: d.count }));
  const deviceTotal = stats.byDevice.reduce((acc, d) => acc + d.count, 0);

  function copyLink() {
    navigator.clipboard.writeText(shortUrl ?? `${window.location.origin}/${link.slug}`);
    toast.success(t("analytics.copied"));
  }

  return (
    <div className="flex-1 bg-background-alt">
      <div className="mx-auto max-w-[980px] px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
        <Link
          href="/dashboard"
          className="-ml-1 inline-flex items-center gap-0.5 text-[15px] text-link hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("analytics.back")}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-4 flex flex-wrap items-end justify-between gap-4"
        >
          <div className="min-w-0 max-w-full">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="break-all font-mono text-[28px] font-semibold leading-tight tracking-tight sm:text-[36px]">
                /{link.slug}
              </h1>
              {link.disabled && <Badge variant="warning">{t("analytics.disabled")}</Badge>}
            </div>
            {link.title && <p className="mt-1 text-[17px] text-muted">{link.title}</p>}
            <a
              href={link.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[14px] text-link hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{link.targetUrl}</span>
            </a>
          </div>
          <Button variant="secondary" onClick={copyLink}>
            <Copy className="h-4 w-4" strokeWidth={1.75} />
            {t("analytics.copy")}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
          className="mt-8 flex flex-col gap-4"
        >
          <Card aria-label={t("analytics.summary")} className="grid grid-cols-3 divide-x divide-separator py-5">
            <Stat label={t("analytics.stats.clicks", { count: days })} value={fmt.number(stats.totalClicks)} />
            <Stat
              label={t("analytics.stats.average")}
              value={fmt.number(average, { maximumFractionDigits: 1 })}
            />
            <Stat
              label={t("analytics.stats.created")}
              value={fmt.date(link.createdAt, { dateStyle: "medium" })}
              small
            />
          </Card>

          {/* Daily trend */}
          <Card className="p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[17px] font-semibold tracking-tight">{t("analytics.chart.title")}</h2>
              <Tabs value={String(days)} onValueChange={(v) => setDays(Number(v))}>
                <TabsList aria-label={t("analytics.chart.range")}>
                  {RANGES.map((r) => (
                    <TabsTrigger key={r} value={String(r)}>
                      {t("analytics.chart.days", { count: r })}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <div
              role="img"
              aria-label={t("analytics.chart.label")}
              className={cn("h-60 transition-opacity duration-300", isLoading ? "opacity-50" : "opacity-100")}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }} barCategoryGap="22%">
                  <CartesianGrid vertical={false} stroke="var(--separator)" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={24}
                    interval="preserveStartEnd"
                    tick={{ fill: "var(--muted)", fontSize: 11 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    width={34}
                    tick={{ fill: "var(--muted)", fontSize: 11 }}
                    tickFormatter={(v: number) => fmt.number(v)}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--seg-bg)" }}
                    content={(props: TooltipContentProps) => <ChartTooltip {...props} />}
                  />
                  <Bar
                    dataKey="clicks"
                    fill="var(--chart-blue)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={22}
                    animationDuration={600}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Devices */}
            <Card className="p-5 sm:p-6">
              <h2 className="mb-4 text-[17px] font-semibold tracking-tight">{t("analytics.devices")}</h2>
              {stats.byDevice.length === 0 ? (
                <EmptyNote>{t("analytics.noClicks")}</EmptyNote>
              ) : (
                <div className="flex items-center gap-5">
                  <div className="h-32 w-32 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.byDevice}
                          dataKey="count"
                          nameKey="label"
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={stats.byDevice.length > 1 ? 3 : 0}
                          cornerRadius={4}
                          stroke="none"
                          animationDuration={600}
                        >
                          {stats.byDevice.map((d) => (
                            <Cell key={d.label} fill={(DEVICE_META[d.label] ?? FALLBACK_DEVICE).color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="flex min-w-0 flex-1 flex-col gap-2.5">
                    {stats.byDevice.map((d) => {
                      const meta = DEVICE_META[d.label] ?? FALLBACK_DEVICE;
                      return (
                        <li key={d.label} className="flex items-center gap-2.5 text-[14px]">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: meta.color }} />
                          <span className="min-w-0 flex-1 truncate">{labels.device(d.label)}</span>
                          <span className="tabular-nums text-muted">
                            {fmt.number(d.count / Math.max(1, deviceTotal), { style: "percent" })}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </Card>

            <BreakdownCard
              title={t("analytics.referrers")}
              color="var(--chart-blue)"
              entries={stats.byReferrer.map((e) => ({ key: e.label, label: labels.referrer(e.label), count: e.count }))}
            />
            <BreakdownCard
              title={t("analytics.browsers")}
              color="var(--chart-purple)"
              entries={stats.byBrowser.map((e) => ({ key: e.label, label: labels.plain(e.label), count: e.count }))}
            />
            <BreakdownCard
              title={t("analytics.os")}
              color="var(--chart-teal)"
              entries={stats.byOs.map((e) => ({ key: e.label, label: labels.plain(e.label), count: e.count }))}
            />
            <BreakdownCard
              title={t("analytics.countries")}
              color="var(--chart-green)"
              entries={stats.byCountry.map((e) => ({ key: e.label, label: labels.country(e.label), count: e.count }))}
            />
            <BreakdownCard
              title={t("analytics.cities")}
              color="var(--chart-orange)"
              entries={(stats.byCity ?? []).map((e) => ({
                key: `${e.country ?? ""}|${e.city}`,
                label: e.city,
                sublabel: e.country ? labels.country(e.country) : undefined,
                count: e.count,
              }))}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
            <RecentClicks recent={stats.recent} connected={connected} />
            <Card className="flex flex-col items-center p-6 text-center">
              <h2 className="text-[17px] font-semibold tracking-tight">{t("analytics.qr.title")}</h2>
              <p className="mt-1 text-[13px] text-muted">{t("analytics.qr.hint")}</p>
              <div className="mt-5">
                <QrCodeCard value={shortUrl} filename={link.slug} />
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 px-4 sm:px-6">
      <span
        suppressHydrationWarning
        className={cn(
          "font-semibold leading-tight tracking-tight tabular-nums",
          small ? "text-[17px] sm:text-[24px]" : "text-[24px] sm:text-[28px]"
        )}
      >
        {value}
      </span>
      <span className="text-[12px] leading-snug text-muted sm:text-[13px]">{label}</span>
    </div>
  );
}

function ChartTooltip({ active, payload }: TooltipContentProps) {
  const { t, fmt } = useI18n();
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as { date: string; clicks: number };
  return (
    <div className="frosted rounded-[12px] px-3 py-2 shadow-[var(--popover-shadow)]">
      <p className="text-[12px] text-muted">
        {fmt.day(row.date, { weekday: "short", month: "short", day: "numeric" })}
      </p>
      <p className="text-[14px] font-semibold">{t("analytics.clicks", { count: row.clicks })}</p>
    </div>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-[14px] text-muted">{children}</p>;
}

function BreakdownCard({
  title,
  color,
  entries,
}: {
  title: string;
  color: string;
  entries: { key: string; label: string; sublabel?: string; count: number }[];
}) {
  const { t, fmt } = useI18n();
  const max = Math.max(1, ...entries.map((e) => e.count));
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="mb-4 text-[17px] font-semibold tracking-tight">{title}</h2>
      {entries.length === 0 ? (
        <EmptyNote>{t("analytics.noData")}</EmptyNote>
      ) : (
        <ul className="flex flex-col gap-3.5">
          {entries.map((e) => (
            <li key={e.key} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3 text-[14px]">
                <span className="min-w-0 truncate">
                  {e.label}
                  {e.sublabel && <span className="text-muted"> · {e.sublabel}</span>}
                </span>
                <span className="shrink-0 tabular-nums text-muted">{fmt.number(e.count)}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--seg-bg)]">
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-[var(--ease)]"
                  style={{ width: `${(e.count / max) * 100}%`, background: color }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function RecentClicks({ recent, connected }: { recent: LinkStatsDTO["recent"]; connected: boolean }) {
  const { t, fmt } = useI18n();
  const labels = useLabels();

  // Stable keys so only genuinely new clicks animate in when the live stream refreshes the list.
  const seen = new Map<string, number>();
  const rows = recent.map((c) => {
    const base = `${c.createdAt}|${c.browser}|${c.os}`;
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return { ...c, key: `${base}|${n}` };
  });

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-semibold tracking-tight">{t("analytics.recent")}</h2>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium",
            connected ? "bg-success-soft text-success" : "bg-fill text-muted"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", connected ? "animate-pulse-ring bg-live" : "bg-muted-2")} />
          {t("analytics.live")}
        </span>
      </div>
      {rows.length === 0 ? (
        <EmptyNote>{t("analytics.noClicks")}</EmptyNote>
      ) : (
        <ul aria-live="polite" className="flex flex-col">
          <AnimatePresence initial={false}>
            {rows.map((c, i) => {
              const Icon = (DEVICE_META[c.deviceType] ?? FALLBACK_DEVICE).icon;
              const place = c.city ? `${c.city} · ${labels.country(c.country)}` : labels.country(c.country);
              return (
                <motion.li
                  key={c.key}
                  layout="position"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={cn("flex items-center gap-3 py-3", i > 0 && "border-t border-separator")}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-fill text-muted">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px]">
                      {labels.plain(c.browser)} · {labels.plain(c.os)}
                    </p>
                    <p className="truncate text-[12px] text-muted">
                      {place} · {labels.referrer(c.referrer)}
                    </p>
                  </div>
                  <time
                    dateTime={c.createdAt}
                    suppressHydrationWarning
                    className="shrink-0 text-[12px] tabular-nums text-muted-2"
                  >
                    {fmt.relative(c.createdAt)}
                  </time>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </Card>
  );
}
