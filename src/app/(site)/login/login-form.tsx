"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "motion/react";
import { ChartColumn, ChevronLeft, QrCode, Zap } from "lucide-react";
import { useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/types";
import { AppIcon } from "@/components/app-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const DEMO_ACCOUNT = { email: "demo@snip.app", password: "password123" };

const FEATURES = [
  { icon: Zap, key: "login.features.instant", color: "#ff9f0a" },
  { icon: ChartColumn, key: "login.features.breakdowns", color: "#af52de" },
  { icon: QrCode, key: "login.features.qr", color: "#0071e3" },
] as const;

/**
 * `initialErrorKey` carries an Auth.js error from the URL (/login?error=…), which Auth.js redirects to
 * instead of showing its own English error page.
 */
export function LoginForm({ initialErrorKey = null }: { initialErrorKey?: MessageKey | null }) {
  const t = useT();
  const router = useRouter();
  // Stored as a message key so the error follows a language switch.
  const [errorKey, setErrorKey] = React.useState<MessageKey | null>(initialErrorKey);
  const [pending, setPending] = React.useState(false);
  const [demoPending, setDemoPending] = React.useState(false);
  const invalid = errorKey === "login.errors.invalid" || errorKey === "login.errors.missing";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // The form is noValidate (the browser's bubbles would be in the browser's language), so check here.
    if (!String(formData.get("email") ?? "").trim() || !String(formData.get("password") ?? "")) {
      setErrorKey("login.errors.missing");
      return;
    }
    setPending(true);
    setErrorKey(null);
    try {
      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });
      if (res?.error) {
        setErrorKey(res.error === "CredentialsSignin" ? "login.errors.invalid" : "login.errors.generic");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorKey("login.errors.generic");
    } finally {
      setPending(false);
    }
  }

  async function handleDemoLogin() {
    setDemoPending(true);
    setErrorKey(null);
    try {
      const res = await signIn("credentials", { ...DEMO_ACCOUNT, redirect: false });
      if (res?.error) {
        setErrorKey("login.errors.demo");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorKey("login.errors.demo");
    } finally {
      setDemoPending(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-background-alt px-4 pb-16 pt-12 sm:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
        className="w-full max-w-[400px]"
      >
        <div className="flex flex-col items-center text-center">
          <AppIcon size={64} />
          <h1 className="mt-6 text-[28px] font-semibold leading-tight tracking-tight sm:text-[32px]">
            {t("login.title")}
          </h1>
          <p className="mt-2 text-balance text-[15px] text-muted sm:text-[17px]">{t("login.subtitle")}</p>
        </div>

        <Card className="mt-8 p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">{t("login.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("login.emailPlaceholder")}
                required
                autoComplete="email"
                aria-invalid={invalid || undefined}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">{t("login.password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                aria-invalid={invalid || undefined}
              />
            </div>

            {errorKey && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-xl bg-danger-soft px-3.5 py-2.5 text-[13px] text-danger"
              >
                {t(errorKey)}
              </motion.p>
            )}

            <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
              {pending ? t("login.submitting") : t("login.submit")}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[12px] text-muted">
            <div className="h-px flex-1 bg-separator" />
            {t("login.or")}
            <div className="h-px flex-1 bg-separator" />
          </div>

          <Button variant="secondary" size="lg" className="w-full" disabled={demoPending} onClick={handleDemoLogin}>
            {demoPending ? t("login.submitting") : t("login.demo")}
          </Button>
          <p className="mt-3 text-center text-[12px] text-muted">
            {t("login.demoHint")} · <span className="font-mono text-foreground">demo@snip.app</span> /{" "}
            <span className="font-mono text-foreground">password123</span>
          </p>
        </Card>

        <ul className="mt-8 flex flex-col gap-3 px-2">
          {FEATURES.map((f) => (
            <li key={f.key} className="flex items-center gap-3 text-[14px] text-muted">
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] text-white"
                style={{ background: f.color }}
                aria-hidden="true"
              >
                <f.icon className="h-4 w-4" strokeWidth={1.9} />
              </span>
              {t(f.key)}
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-0.5 text-[14px] text-link hover:underline">
            <ChevronLeft className="h-4 w-4" />
            {t("login.back")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
