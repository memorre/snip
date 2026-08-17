"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  Globe2,
  Link2,
  QrCode,
  Radio,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Link2,
    title: "Clean short links",
    desc: "Pick a memorable slug or let Snip generate one. Redirects fire in milliseconds.",
  },
  {
    icon: BarChart3,
    title: "Real analytics, not vanity counts",
    desc: "Daily trend charts, referrer sources, and device breakdowns for every link you create.",
  },
  {
    icon: Radio,
    title: "Live click ticker",
    desc: "Open the dashboard and watch clicks land in real time — no refresh needed.",
  },
  {
    icon: Globe2,
    title: "Geography, out of the box",
    desc: "See which countries and cities your links are landing in, powered by edge geolocation.",
  },
  {
    icon: QrCode,
    title: "QR codes included",
    desc: "Every link gets a downloadable QR code — generated on the fly, no extra service.",
  },
  {
    icon: Smartphone,
    title: "Built for every screen",
    desc: "The dashboard and charts are fully responsive, with light and dark themes.",
  },
];

const PREVIEW_STATS = [
  { label: "Clicks today", value: "142" },
  { label: "Top referrer", value: "twitter.com" },
  { label: "Top country", value: "US" },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="bg-mesh pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px]" />

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 pb-20 pt-20 text-center sm:px-6 md:pt-28">
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium text-muted"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" /> A short-link platform with real analytics
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl"
        >
          Every click,{" "}
          <span className="bg-gradient-to-r from-[#4f46e5] to-[#0e7490] bg-clip-text text-transparent">
            tracked live.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="max-w-xl text-balance text-muted"
        >
          Snip turns any long URL into a short one — then shows you exactly who clicked it, from where, and on
          what, the moment it happens.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" asChild>
            <Link href="/login">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/login">Try the demo account</Link>
          </Button>
        </motion.div>

        {/* Floating preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 w-full max-w-2xl"
        >
          <Card className="glass p-5 text-left shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-pulse-ring rounded-full bg-accent" />
                <p className="text-sm font-medium">snip.yetao.org/launch</p>
              </div>
              <span className="text-xs text-muted">Live</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {PREVIEW_STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className="rounded-xl bg-surface-2 p-3 text-center"
                >
                  <p className="text-lg font-semibold">{s.value}</p>
                  <p className="text-[11px] text-muted">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Everything a short link needs</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
            Not just a redirect — a small analytics platform for every link you create.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
            >
              <Card className="h-full p-5 transition-transform hover:-translate-y-1 hover:shadow-lg">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mb-1 font-semibold">{f.title}</h3>
                <p className="text-sm text-muted">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass relative overflow-hidden p-8 text-center sm:p-12">
            <div className="bg-mesh pointer-events-none absolute inset-0 -z-10 opacity-60" />
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ready to see it live?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Sign in with the demo account — no setup required.
            </p>
            <Button size="lg" className="mt-6" asChild>
              <Link href="/login">
                Sign in <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </motion.div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted">
        Snip — a portfolio build. Not affiliated with any URL-shortening service.
      </footer>
    </div>
  );
}
