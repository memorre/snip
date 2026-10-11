"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/app-icon";
import { Button } from "@/components/ui/button";
import { LanguageMenu } from "@/components/language-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function SiteHeader() {
  const t = useT();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const onDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="glass sticky top-0 z-40 h-12 border-b border-[var(--nav-line)]">
      <div className="mx-auto flex h-full max-w-[980px] items-center gap-5 px-4 sm:px-6">
        <Link
          href="/"
          aria-label={t("nav.home")}
          className="mr-auto flex items-center gap-2.5 rounded-lg text-[17px] font-semibold tracking-tight text-foreground"
        >
          <AppIcon size={28} />
          <span>Snip</span>
        </Link>

        {status === "authenticated" && (
          <nav className="hidden text-[13px] sm:block">
            <Link
              href="/dashboard"
              aria-current={onDashboard ? "page" : undefined}
              className={cn(
                "text-foreground transition-opacity hover:opacity-100",
                onDashboard ? "opacity-100" : "opacity-80"
              )}
            >
              {t("nav.dashboard")}
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-1">
          <LanguageMenu />
          <ThemeToggle />
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={t("nav.account")}
                  className="ml-1 grid h-8 w-8 place-items-center rounded-full transition-opacity hover:opacity-85"
                >
                  <Avatar>
                    <AvatarFallback>{initials(session.user.name ?? "?")}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[13rem]">
                <DropdownMenuLabel>
                  <span className="block truncate text-[14px] font-semibold text-foreground">{session.user.name}</span>
                  <span className="block truncate text-[12px] text-muted">{session.user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="sm:hidden" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4 text-muted group-data-[highlighted]:text-current" strokeWidth={1.75} />
                    {t("nav.dashboard")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="h-4 w-4 text-muted group-data-[highlighted]:text-current" strokeWidth={1.75} />
                  {t("nav.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : status === "loading" ? (
            <span className="ml-1 h-7 w-7" aria-hidden="true" />
          ) : pathname === "/login" ? null : (
            <Button asChild size="nav" className="ml-1.5">
              <Link href="/login">{t("nav.signIn")}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
