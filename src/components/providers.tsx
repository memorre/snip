"use client";

import * as React from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { MotionConfig } from "motion/react";
import { Toaster } from "sonner";
import { I18nProvider } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

function AppToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="top-center"
      offset={60}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{
        className: "frosted",
        style: {
          background: "var(--popover)",
          color: "var(--foreground)",
          border: "none",
          borderRadius: 14,
          boxShadow: "var(--popover-shadow)",
          fontFamily: "inherit",
          fontSize: 14,
        },
      }}
    />
  );
}

export function Providers({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <I18nProvider locale={locale} dictionary={dictionary}>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <MotionConfig reducedMotion="user">
            {children}
            <AppToaster />
          </MotionConfig>
        </ThemeProvider>
      </SessionProvider>
    </I18nProvider>
  );
}
