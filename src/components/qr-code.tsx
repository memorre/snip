"use client";

import * as React from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { useT } from "@/i18n/client";
import { Button } from "@/components/ui/button";

/** QR code for the short URL; `value` is null until the page knows its own origin. */
export function QrCodeCard({ value, filename }: { value: string | null; filename: string }) {
  const t = useT();
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!value) return;
    let cancelled = false;
    QRCode.toDataURL(value, { width: 480, margin: 1, color: { dark: "#1d1d1f", light: "#ffffff" } }).then((url) => {
      if (!cancelled) setDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex h-[168px] w-[168px] items-center justify-center overflow-hidden rounded-[18px] bg-white p-2.5 shadow-[0_0_0_0.5px_rgba(0,0,0,0.08)]">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt={t("analytics.qr.alt", { url: value ?? "" })} className="h-full w-full" />
        ) : (
          <div className="h-full w-full animate-pulse rounded-lg bg-[#f5f5f7]" role="status" aria-label={t("common.loading")} />
        )}
      </div>
      <Button
        variant="secondary"
        size="sm"
        disabled={!dataUrl}
        onClick={() => {
          if (!dataUrl) return;
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = `${filename}.png`;
          a.click();
        }}
      >
        <Download className="h-3.5 w-3.5" />
        {t("analytics.qr.download")}
      </Button>
    </div>
  );
}
