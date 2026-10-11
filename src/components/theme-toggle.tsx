"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useT } from "@/i18n/client";

export function ThemeToggle() {
  const t = useT();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // one-time mount flag to avoid a hydration mismatch between server
    // (no theme known yet) and client (resolved theme) — not a state sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-8 w-8" aria-hidden="true" />;

  const isDark = resolvedTheme === "dark";
  const label = isDark ? t("common.themeToLight") : t("common.themeToDark");

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid h-8 w-8 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-fill hover:text-foreground"
    >
      {isDark ? (
        <Sun className="h-[17px] w-[17px]" strokeWidth={1.75} />
      ) : (
        <Moon className="h-[16px] w-[16px]" strokeWidth={1.75} />
      )}
    </button>
  );
}
