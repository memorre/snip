"use client";

import * as React from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { useT } from "@/i18n/client";
import { Button } from "@/components/ui/button";

// Localized fallback for runtime errors on any screen in the group (database unreachable, a chart that
// throws…), instead of Next's built-in English message.
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = useT();

  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center bg-background-alt px-5 py-24">
      <div role="alert" className="flex max-w-[480px] flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-[16px] bg-fill text-muted" aria-hidden="true">
          <TriangleAlert className="h-7 w-7" strokeWidth={1.75} />
        </span>
        <h1 className="mt-7 text-balance text-[32px] font-semibold leading-[1.1] tracking-tight sm:text-[40px]">
          {t("errors.unexpectedTitle")}
        </h1>
        <p className="mt-3 text-balance text-[17px] text-muted">{t("errors.unexpectedBody")}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" onClick={() => retry()}>
            {t("errors.retry")}
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/">{t("notFound.home")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
