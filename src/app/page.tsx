"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { ChartColumn, Link2, MapPin, MonitorSmartphone, QrCode, Radio } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { AppIcon } from "@/components/app-icon";
import { MoreLink } from "@/components/more-link";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

const EASE = [0.2, 0.7, 0.2, 1] as const;

// Feature tiles, each with an Apple system colour, like iOS Settings icons.
const FEATURES = [
  { id: "links", icon: Link2, color: "linear-gradient(145deg, #3a9bff, #0071e3)" },
  { id: "analytics", icon: ChartColumn, color: "linear-gradient(145deg, #c77dea, #af52de)" },
  { id: "live", icon: Radio, color: "linear-gradient(145deg, #5ee08a, #34c759)" },
  { id: "geo", icon: MapPin, color: "linear-gradient(145deg, #5ccfe6, #30b0c7)" },
  { id: "qr", icon: QrCode, color: "linear-gradient(145deg, #ffbf4d, #ff9f0a)" },
  { id: "screens", icon: MonitorSmartphone, color: "linear-gradient(145deg, #ff6b88, #ff2d55)" },
] as const;

const PREVIEW_BARS = [34, 48, 40, 58, 51, 76, 66];

export default function Home() {
  const { t, locale } = useI18n();
  const { status } = useSession();
  const signedIn = status === "authenticated";
  const primaryHref = signedIn ? "/dashboard" : "/login";

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="overflow-hidden px-5 pb-20 pt-14 text-center sm:pb-28 sm:pt-24">
        <div className="mx-auto flex max-w-[980px] flex-col items-center">
          <div className="animate-rise">
            <AppIcon size={84} />
          </div>
          <p className="animate-rise mt-7 text-[17px] font-semibold text-muted [animation-delay:60ms] sm:text-[21px]">
            {t("landing.eyebrow")}
          </p>
          <h1 className="animate-rise mt-1 text-[64px] font-bold leading-[1.05] tracking-tight [animation-delay:120ms] sm:text-[96px] md:text-[112px]">
            Snip
          </h1>
          <p className="headline animate-rise mt-3 max-w-[820px] text-balance text-[30px] font-semibold leading-[1.12] tracking-tight [animation-delay:180ms] sm:text-[44px] md:text-[52px]">
            {t("landing.taglineLead")}
            {locale === "zh-CN" ? "" : " "}
            <span className="text-gradient-snip">{t("landing.taglineAccent")}</span>
          </p>
          <p className="animate-rise mt-6 max-w-[640px] text-balance text-[17px] leading-[1.5] text-muted [animation-delay:240ms] sm:text-[21px]">
            {t("landing.lead")}
          </p>
          <div className="animate-rise mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 [animation-delay:300ms]">
            <Button asChild size="lg">
              <Link href={primaryHref}>{signedIn ? t("nav.dashboard") : t("landing.ctaPrimary")}</Link>
            </Button>
            {!signedIn && (
              <MoreLink href="/login" className="text-[17px]">
                {t("landing.ctaDemo")}
              </MoreLink>
            )}
          </div>
        </div>

        <div className="animate-rise mx-auto mt-14 max-w-[760px] [animation-delay:380ms] sm:mt-20">
          <PreviewCard />
        </div>
      </section>

      {/* Features */}
      <section className="bg-background-alt px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-[980px]">
          <Reveal>
            <h2 className="headline mb-10 text-balance text-[32px] font-semibold leading-[1.08] tracking-tight sm:mb-14 sm:text-[48px] md:text-[56px]">
              {t("landing.featuresTitle")}
              <span className="block text-muted">{t("landing.featuresSubtitle")}</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 [&>.reveal]:h-full">
            {FEATURES.map((f, i) => (
              <Reveal key={f.id} delay={(i % 3) * 90}>
                <article className="flex h-full flex-col rounded-[28px] bg-surface p-7 shadow-[var(--card-shadow)] transition-[transform,box-shadow] duration-500 ease-[var(--ease)] hover:scale-[1.015] hover:shadow-[var(--card-shadow-hover)] sm:p-8">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-[11px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                    style={{ background: f.color }}
                    aria-hidden="true"
                  >
                    <f.icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
                  </span>
                  <h3 className="headline mt-6 text-[21px] font-semibold leading-tight tracking-tight">
                    {t(`landing.features.${f.id}.title` as const)}
                  </h3>
                  <p className="mt-2 text-[17px] text-muted">{t(`landing.features.${f.id}.body` as const)}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-5 py-20 text-center sm:py-28">
        <Reveal className="mx-auto max-w-[980px]">
          <h2 className="headline text-balance text-[32px] font-semibold leading-[1.08] tracking-tight sm:text-[48px]">
            {t("landing.ctaTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-balance text-[17px] text-muted sm:text-[21px]">
            {t("landing.ctaBody")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Button asChild size="lg">
              <Link href={primaryHref}>{signedIn ? t("nav.dashboard") : t("landing.ctaButton")}</Link>
            </Button>
            <MoreLink href="https://yetao.org" external className="text-[17px]">
              {t("landing.footerMore")}
            </MoreLink>
          </div>
        </Reveal>
      </section>

      <footer className="bg-background-alt px-5 text-[12px] text-muted">
        <div className="mx-auto flex max-w-[980px] flex-col gap-1 py-5 pb-[max(20px,env(safe-area-inset-bottom))] sm:flex-row sm:justify-between sm:gap-6">
          <p>© {new Date().getFullYear()} Tao Ye · Snip</p>
          <p>{t("landing.footerNote")}</p>
        </div>
      </footer>
    </div>
  );
}

/** A product-shot style card that previews a link's live analytics. */
function PreviewCard() {
  const { t, fmt } = useI18n();
  const stats = [
    { label: t("landing.preview.clicksToday"), value: fmt.number(142) },
    { label: t("landing.preview.topReferrer"), value: "github.com" },
    { label: t("landing.preview.topCountry"), value: fmt.region("US") },
  ];

  return (
    <figure
      aria-label={t("landing.preview.label")}
      className="rounded-[28px] bg-surface p-5 text-left shadow-[var(--hero-shadow)] sm:p-8"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <AppIcon size={24} />
          <span className="truncate font-mono text-[14px] font-medium sm:text-[15px]">snip.yetao.org/launch</span>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-[12px] font-medium text-success">
          <span className="h-1.5 w-1.5 animate-pulse-ring rounded-full bg-live" />
          {t("landing.preview.live")}
        </span>
      </div>

      <dl className="mt-6 grid grid-cols-3 divide-x divide-separator">
        {stats.map((s) => (
          <div key={s.label} className="flex min-w-0 flex-col-reverse justify-end gap-1 px-2 first:pl-0 last:pr-0 sm:px-6">
            <dt className="text-[12px] leading-snug text-muted sm:text-[13px]">{s.label}</dt>
            <dd className="text-[15px] font-semibold leading-tight tracking-tight sm:text-[28px]">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 rounded-[18px] bg-background-alt p-4 sm:p-5">
        <p className="text-[12px] text-muted sm:text-[13px]">{t("landing.preview.lastWeek")}</p>
        <div className="mt-3 flex h-24 items-end gap-2 sm:h-32 sm:gap-3" aria-hidden="true">
          {PREVIEW_BARS.map((h, i) => (
            <motion.span
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.5 + i * 0.06, duration: 0.7, ease: EASE }}
              style={{ height: `${h}%`, originY: 1 }}
              className={
                i === PREVIEW_BARS.length - 1
                  ? "flex-1 rounded-[6px] bg-[var(--chart-blue)]"
                  : "flex-1 rounded-[6px] bg-[var(--chart-blue)] opacity-35"
              }
            />
          ))}
        </div>
      </div>
    </figure>
  );
}
