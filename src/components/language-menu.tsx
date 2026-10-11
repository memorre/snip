"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { LOCALES, LOCALE_LABELS, isLocale, serializeLocaleCookie } from "@/i18n/config";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Globe button that opens the language list. The choice is stored in the "lang" cookie (shared across
 * yetao.org subdomains) and the page re-renders on the server in the new language without a reload.
 */
export function LanguageMenu({ className }: { className?: string }) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function choose(value: string) {
    if (!isLocale(value) || value === locale) return;
    document.cookie = serializeLocaleCookie(value, window.location.hostname);
    document.documentElement.lang = value;
    startTransition(() => router.refresh());
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("common.language")}
          title={t("common.language")}
          aria-busy={pending || undefined}
          className={cn(
            "grid h-8 w-8 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-fill hover:text-foreground data-[state=open]:bg-fill data-[state=open]:text-foreground",
            pending && "animate-pulse",
            className
          )}
        >
          <Globe className="h-[17px] w-[17px]" strokeWidth={1.75} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10.5rem]">
        <DropdownMenuRadioGroup value={locale} onValueChange={choose}>
          {LOCALES.map((code) => (
            <DropdownMenuRadioItem key={code} value={code} lang={code}>
              {LOCALE_LABELS[code]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
