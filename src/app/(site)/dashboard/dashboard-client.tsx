"use client";

import * as React from "react";
import Link from "next/link";
import useSWR from "swr";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ChevronRight, Copy, Link2, Trash2 } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { toggleLink, deleteLink } from "@/app/actions";
import type { LinkSummaryDTO } from "@/lib/data";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateLinkDialog } from "./create-link-dialog";

export function DashboardClient({
  userName,
  initialLinks,
}: {
  userName: string;
  initialLinks: LinkSummaryDTO[];
}) {
  const { t, fmt } = useI18n();
  const { data: links = initialLinks, mutate } = useSWR<LinkSummaryDTO[]>("/api/links", fetcher, {
    fallbackData: initialLinks,
    refreshInterval: 20000,
  });
  const [pendingDelete, setPendingDelete] = React.useState<LinkSummaryDTO | null>(null);
  // The row's delete button that opened the confirmation, so focus can go back to it on close.
  const returnFocusRef = React.useRef<HTMLElement | null>(null);

  const [origin, setOrigin] = React.useState("");
  React.useEffect(() => {
    // client-only value (no window during SSR) — not a state sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrigin(window.location.origin);
  }, []);

  const totalClicks = links.reduce((acc, l) => acc + l.totalClicks, 0);
  const clicksThisWeek = links.reduce((acc, l) => acc + l.clicksLast7Days, 0);
  const activeLinks = links.filter((l) => !l.disabled).length;

  async function handleToggle(link: LinkSummaryDTO) {
    mutate(
      links.map((l) => (l.id === link.id ? { ...l, disabled: !l.disabled } : l)),
      false
    );
    await toggleLink(link.id);
    mutate();
  }

  async function confirmDelete() {
    const link = pendingDelete;
    if (!link) return;
    // The row is about to go (it fades out for a moment), so send focus to "New link" instead.
    returnFocusRef.current = null;
    setPendingDelete(null);
    mutate(
      links.filter((l) => l.id !== link.id),
      false
    );
    await deleteLink(link.id);
    toast.success(t("dashboard.deleted", { slug: link.slug }));
    mutate();
  }

  function createdLabel(createdAt: string) {
    const since = fmt.since(createdAt);
    return since ? t("dashboard.created", { time: since }) : t("dashboard.createdJustNow");
  }

  function copy(slug: string) {
    navigator.clipboard.writeText(`${origin}/${slug}`);
    toast.success(t("dashboard.copied"));
  }

  return (
    <div className="flex-1 bg-background-alt">
      <div className="mx-auto max-w-[980px] px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-muted sm:text-[17px]">{t("dashboard.welcome")}</p>
            <h1 className="truncate text-[32px] font-bold leading-tight tracking-tight sm:text-[40px]">{userName}</h1>
          </div>
          <CreateLinkDialog />
        </motion.div>

        <motion.section
          aria-label={t("dashboard.summary")}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-8"
        >
          <Card className="grid grid-cols-3 divide-x divide-separator py-5">
            <Stat label={t("dashboard.stats.active")} value={fmt.number(activeLinks)} />
            <Stat label={t("dashboard.stats.total")} value={fmt.number(totalClicks)} />
            <Stat label={t("dashboard.stats.week")} value={fmt.number(clicksThisWeek)} />
          </Card>
        </motion.section>

        <section className="mt-10">
          <h2 className="mb-3 px-1 text-[21px] font-semibold tracking-tight">{t("dashboard.linksTitle")}</h2>

          {links.length === 0 ? (
            <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-[14px] bg-fill text-muted">
                <Link2 className="h-6 w-6" strokeWidth={1.75} />
              </span>
              <p className="text-[17px] font-semibold">{t("dashboard.empty.title")}</p>
              <p className="max-w-xs text-[15px] text-muted">{t("dashboard.empty.body")}</p>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <ul>
                <AnimatePresence initial={false}>
                  {links.map((link, i) => (
                    <motion.li
                      key={link.id}
                      layout="position"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn("relative", i > 0 && "border-t border-separator")}
                    >
                      <LinkRow
                        link={link}
                        createdLabel={createdLabel(link.createdAt)}
                        onCopy={() => copy(link.slug)}
                        onToggle={() => handleToggle(link)}
                        onDelete={(e) => {
                          returnFocusRef.current = e.currentTarget;
                          setPendingDelete(link);
                        }}
                      />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </Card>
          )}
        </section>
      </div>

      <Dialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent
          hideClose
          className="max-w-sm"
          onCloseAutoFocus={(e) => {
            // This dialog has no Radix trigger, so return focus by hand: to the row's delete button, or
            // to "New link" when that row was just deleted.
            e.preventDefault();
            const el = returnFocusRef.current;
            (el?.isConnected ? el : document.querySelector<HTMLElement>("[data-new-link]"))?.focus();
            returnFocusRef.current = null;
          }}
        >
          {pendingDelete && (
            <>
              <DialogHeader className="pr-0">
                <DialogTitle className="break-all">{t("dashboard.confirmDelete.title", { slug: pendingDelete.slug })}</DialogTitle>
                <DialogDescription>
                  {pendingDelete.totalClicks === 0
                    ? t("dashboard.confirmDelete.bodyNoClicks")
                    : t("dashboard.confirmDelete.body", { count: pendingDelete.totalClicks })}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="secondary" onClick={() => setPendingDelete(null)}>
                  {t("common.cancel")}
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                  {t("dashboard.confirmDelete.confirm")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 px-4 sm:px-6">
      <span className="text-[24px] font-semibold leading-tight tracking-tight tabular-nums sm:text-[28px]">{value}</span>
      <span className="text-[12px] leading-snug text-muted sm:text-[13px]">{label}</span>
    </div>
  );
}

function LinkRow({
  link,
  createdLabel,
  onCopy,
  onToggle,
  onDelete,
}: {
  link: LinkSummaryDTO;
  createdLabel: string;
  onCopy: () => void;
  onToggle: () => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
      <div className="flex min-w-0 flex-1 items-start gap-3.5">
        <span
          className={cn(
            "mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-[10px] transition-colors",
            link.disabled ? "bg-fill text-muted" : "bg-primary-soft text-link"
          )}
          aria-hidden="true"
        >
          <Link2 className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
        <div className={cn("min-w-0 flex-1 transition-opacity", link.disabled && "opacity-60")}>
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
            <Link
              href={`/dashboard/${link.slug}`}
              className="truncate font-mono text-[15px] font-semibold text-foreground hover:text-link"
            >
              /{link.slug}
            </Link>
            {link.title && <span className="min-w-0 truncate text-[15px] text-muted">{link.title}</span>}
            {link.disabled && <Badge variant="warning">{t("dashboard.disabled")}</Badge>}
          </div>
          <p className="mt-0.5 truncate text-[13px] text-muted">{link.targetUrl}</p>
          <p className="mt-1 text-[12px] text-muted" suppressHydrationWarning>
            {t("dashboard.clicks", { count: link.totalClicks })} · {createdLabel}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1 sm:justify-end sm:gap-2">
        <Button variant="ghost" size="sm" asChild className="text-link max-sm:-ml-4">
          <Link href={`/dashboard/${link.slug}`}>
            {t("dashboard.analytics")}
            <ChevronRight className="-mr-1 h-3.5 w-3.5" />
          </Link>
        </Button>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" onClick={onCopy} aria-label={t("dashboard.copy")} title={t("dashboard.copy")}>
            <Copy className="h-4 w-4 text-muted" strokeWidth={1.75} />
          </Button>
          <Switch
            checked={!link.disabled}
            onCheckedChange={onToggle}
            aria-label={t("dashboard.toggle")}
            className="mx-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label={t("dashboard.delete")}
            title={t("dashboard.delete")}
          >
            <Trash2 className="h-4 w-4 text-danger" strokeWidth={1.75} />
          </Button>
        </div>
      </div>
    </div>
  );
}
