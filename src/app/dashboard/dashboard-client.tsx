"use client";

import * as React from "react";
import Link from "next/link";
import useSWR from "swr";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { BarChart3, Copy, ExternalLink, Link2, MousePointerClick, Trash2 } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { toggleLink, deleteLink } from "@/app/actions";
import type { LinkSummaryDTO } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CreateLinkDialog } from "./create-link-dialog";

export function DashboardClient({
  userName,
  initialLinks,
}: {
  userName: string;
  initialLinks: LinkSummaryDTO[];
}) {
  const { data: links = initialLinks, mutate } = useSWR<LinkSummaryDTO[]>("/api/links", fetcher, {
    fallbackData: initialLinks,
    refreshInterval: 20000,
  });

  const [origin, setOrigin] = React.useState("");
  React.useEffect(() => {
    // client-only value (no window during SSR) — not a state sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrigin(window.location.origin);
  }, []);

  const totalClicks = links.reduce((acc, l) => acc + l.totalClicks, 0);
  const clicksThisWeek = links.reduce((acc, l) => acc + l.clicksLast7Days, 0);

  async function handleToggle(link: LinkSummaryDTO) {
    mutate(
      links.map((l) => (l.id === link.id ? { ...l, disabled: !l.disabled } : l)),
      false
    );
    await toggleLink(link.id);
    mutate();
  }

  async function handleDelete(link: LinkSummaryDTO) {
    mutate(
      links.filter((l) => l.id !== link.id),
      false
    );
    await deleteLink(link.id);
    toast.success(`Deleted ${link.slug}`);
    mutate();
  }

  function copy(slug: string) {
    navigator.clipboard.writeText(`${origin}/${slug}`);
    toast.success("Link copied");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-sm text-muted">Welcome back,</p>
          <h1 className="text-2xl font-semibold tracking-tight">{userName}</h1>
        </div>
        <CreateLinkDialog />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        <StatCard icon={Link2} label="Active links" value={String(links.filter((l) => !l.disabled).length)} />
        <StatCard icon={MousePointerClick} label="Total clicks" value={totalClicks.toLocaleString()} />
        <StatCard icon={BarChart3} label="Clicks this week" value={clicksThisWeek.toLocaleString()} />
      </motion.div>

      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {links.map((link, i) => (
            <motion.div
              key={link.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, delay: Math.min(i, 6) * 0.03 }}
            >
              <Card className={link.disabled ? "opacity-60" : undefined}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <Link
                        href={`/dashboard/${link.slug}`}
                        className="font-mono text-sm font-semibold text-primary hover:underline"
                      >
                        /{link.slug}
                      </Link>
                      {link.title && <span className="text-sm text-muted">· {link.title}</span>}
                      {link.disabled && <Badge variant="warning">Disabled</Badge>}
                    </div>
                    <p className="flex items-center gap-1 truncate text-xs text-muted">
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      {link.targetUrl}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {link.totalClicks.toLocaleString()} clicks total · created{" "}
                      {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/${link.slug}`}>
                        <BarChart3 className="h-3.5 w-3.5" /> Stats
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => copy(link.slug)} aria-label="Copy link">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Switch checked={!link.disabled} onCheckedChange={() => handleToggle(link)} aria-label="Enabled" />
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(link)} aria-label="Delete link">
                      <Trash2 className="h-3.5 w-3.5 text-danger" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {links.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
            <Link2 className="h-8 w-8 text-muted" />
            <p className="text-sm text-muted">No links yet — create your first one to get started.</p>
          </div>
        )}
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
