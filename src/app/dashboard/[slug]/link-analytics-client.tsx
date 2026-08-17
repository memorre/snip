"use client";

import * as React from "react";
import useSWR from "swr";
import { motion } from "motion/react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import {
  Copy,
  ExternalLink,
  Laptop,
  MousePointerClick,
  Smartphone,
  Tablet,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { fetcher } from "@/lib/fetcher";
import { useLiveClicks } from "@/hooks/use-live-clicks";
import type { LinkStatsDTO } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
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

const DEVICE_META: Record<string, { icon: React.ElementType; color: string }> = {
  DESKTOP: { icon: Laptop, color: "#4f46e5" },
  MOBILE: { icon: Smartphone, color: "#0e7490" },
  TABLET: { icon: Tablet, color: "#d97706" },
};

const RANGES = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

export function LinkAnalyticsClient({
  link,
  initialStats,
}: {
  link: LinkMeta;
  initialStats: LinkStatsDTO & { linkId: string };
}) {
  useLiveClicks(link.slug, { announceToasts: true });
  const [days, setDays] = React.useState(30);
  const [origin, setOrigin] = React.useState("");
  React.useEffect(() => {
    // client-only value (no window during SSR) — not a state sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrigin(window.location.origin);
  }, []);

  const { data: stats = initialStats, isLoading } = useSWR<LinkStatsDTO & { linkId: string }>(
    `/api/links/${link.slug}/stats?days=${days}`,
    fetcher,
    { fallbackData: days === 30 ? initialStats : undefined, refreshInterval: 15000 }
  );

  const shortUrl = origin ? `${origin}/${link.slug}` : `/${link.slug}`;
  const avgPerDay = stats.daily.length ? (stats.totalClicks / stats.daily.length).toFixed(1) : "0";

  const chartData = stats.daily.map((d) => ({
    date: d.date,
    label: format(parseISO(d.date), "MMM d"),
    clicks: d.count,
  }));

  const deviceData = stats.byDevice.map((d) => ({
    name: d.label,
    value: d.count,
    color: DEVICE_META[d.label]?.color ?? "#9498ad",
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex flex-wrap items-start justify-between gap-4"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-2xl font-semibold tracking-tight text-primary">/{link.slug}</h1>
            {link.title && <span className="text-muted">· {link.title}</span>}
          </div>
          <p className="mt-1 flex items-center gap-1 truncate text-sm text-muted">
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            {link.targetUrl}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            navigator.clipboard.writeText(shortUrl);
            toast.success("Link copied");
          }}
        >
          <Copy className="h-3.5 w-3.5" /> Copy link
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        <StatCard icon={MousePointerClick} label={`Clicks (${days}d)`} value={stats.totalClicks.toLocaleString()} />
        <StatCard icon={TrendingUp} label="Avg per day" value={avgPerDay} />
        <StatCard
          icon={ExternalLink}
          label="Created"
          value={formatDistanceToNow(parseISO(link.createdAt), { addSuffix: true })}
        />
      </motion.div>

      <Card className="mb-4 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Clicks over time</h2>
          <Tabs value={String(days)} onValueChange={(v) => setDays(Number(v))}>
            <TabsList>
              {RANGES.map((r) => (
                <TabsTrigger key={r.days} value={String(r.days)}>
                  {r.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className={`h-56 transition-opacity ${isLoading ? "opacity-50" : "opacity-100"}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="clicksFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                stroke="var(--muted)"
                interval={days > 30 ? Math.floor(days / 10) : "preserveStartEnd"}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--muted)" }}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#clicksFill)"
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold">Devices</h2>
          <div className="flex items-center gap-4">
            <div className="h-32 w-32 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceData} dataKey="value" nameKey="name" innerRadius={36} outerRadius={56} strokeWidth={2}>
                    {deviceData.map((d) => (
                      <Cell key={d.name} fill={d.color} stroke="var(--surface)" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              {stats.byDevice.map((d) => {
                const meta = DEVICE_META[d.label];
                const Icon = meta?.icon ?? Laptop;
                return (
                  <div key={d.label} className="flex items-center gap-2 text-sm">
                    <Icon className="h-3.5 w-3.5" style={{ color: meta?.color }} />
                    <span className="flex-1 text-muted">{d.label}</span>
                    <span className="font-medium">{d.count}</span>
                  </div>
                );
              })}
              {stats.byDevice.length === 0 && <p className="text-sm text-muted">No clicks yet.</p>}
            </div>
          </div>
        </Card>

        <BreakdownCard title="Top referrers" entries={stats.byReferrer} />
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <BreakdownCard title="Browsers" entries={stats.byBrowser} />
        <BreakdownCard title="Countries" entries={stats.byCountry} />
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold">Recent clicks</h2>
          <div className="flex flex-col divide-y divide-border">
            {stats.recent.map((c, i) => (
              <div key={i} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="flex items-center gap-2 text-muted">
                  {React.createElement(DEVICE_META[c.deviceType]?.icon ?? Laptop, { className: "h-3.5 w-3.5" })}
                  <span>{c.browser}</span>
                  <span>·</span>
                  <span>{c.os}</span>
                </div>
                <span className="text-muted">{c.country ?? "Unknown"}</span>
                <span className="text-xs text-muted">{formatDistanceToNow(parseISO(c.createdAt), { addSuffix: true })}</span>
              </div>
            ))}
            {stats.recent.length === 0 && <p className="py-6 text-center text-sm text-muted">No clicks yet.</p>}
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center p-5">
          <QrCodeCard value={shortUrl} filename={link.slug} />
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-lg font-semibold leading-tight">{value}</p>
          <p className="text-xs text-muted">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function BreakdownCard({ title, entries }: { title: string; entries: { label: string; count: number }[] }) {
  const max = Math.max(1, ...entries.map((e) => e.count));
  return (
    <Card className="p-5">
      <h2 className="mb-4 text-sm font-semibold">{title}</h2>
      <div className="flex flex-col gap-3">
        {entries.map((e) => (
          <div key={e.label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <span className="truncate text-foreground">{e.label}</span>
              <span className="text-muted">{e.count}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(e.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
        {entries.length === 0 && <p className="text-sm text-muted">No data yet.</p>}
      </div>
    </Card>
  );
}
