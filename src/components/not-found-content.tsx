"use client";

import Link from "next/link";
import { Link2Off } from "lucide-react";
import { useT } from "@/i18n/client";
import { Button } from "@/components/ui/button";

export function NotFoundContent() {
  const t = useT();

  return (
    <div className="flex flex-1 items-center justify-center bg-background-alt px-5 py-24">
      {/* not-found.js can't export metadata; React hoists this into <head>. */}
      <title>{`${t("meta.notFound")} · Snip`}</title>
      <div className="flex max-w-[480px] flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-[16px] bg-fill text-muted" aria-hidden="true">
          <Link2Off className="h-7 w-7" strokeWidth={1.75} />
        </span>
        <h1 className="mt-7 text-balance text-[32px] font-semibold leading-[1.1] tracking-tight sm:text-[40px]">
          {t("notFound.title")}
        </h1>
        <p className="mt-3 text-balance text-[17px] text-muted">{t("notFound.body")}</p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/">{t("notFound.home")}</Link>
        </Button>
      </div>
    </div>
  );
}
