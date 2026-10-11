import { cn } from "@/lib/utils";

/**
 * Snip's app icon, identical to its project card on yetao.org: a rounded square (~22% radius) with an
 * orange-to-pink gradient and a white stroked link glyph.
 */
export function AppIcon({ size = 28, className }: { size?: number; className?: string }) {
  const glyph = Math.round(size * 0.5);
  return (
    <span
      aria-hidden="true"
      className={cn("app-icon inline-grid shrink-0 place-items-center", className)}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.2237,
        boxShadow:
          size >= 48
            ? "0 12px 32px rgba(255, 45, 85, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.25)"
            : undefined,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={glyph}
        height={glyph}
        fill="none"
        stroke="currentColor"
        strokeWidth={size >= 48 ? 1.8 : 2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    </span>
  );
}
