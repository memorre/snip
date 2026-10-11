import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Apple's "Learn more ›" text link: link colour, chevron after the label. */
export function MoreLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const classes = cn("chevron-after inline-flex items-baseline text-link hover:underline", className);
  if (external) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
