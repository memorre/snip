"use client";

import * as React from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QrCodeCard({ value, filename }: { value: string; filename: string }) {
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, { width: 240, margin: 1, color: { dark: "#12141f", light: "#ffffff" } }).then(
      (url) => {
        if (!cancelled) setDataUrl(url);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-[168px] w-[168px] items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-2">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt="QR code" className="h-full w-full" />
        ) : (
          <div className="h-full w-full animate-pulse rounded-lg bg-surface-2" />
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
        <Download className="h-3.5 w-3.5" /> Download QR
      </Button>
    </div>
  );
}
