"use client";

import { useEffect, useRef, useState } from "react";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { useT } from "@/i18n/client";

/**
 * Subscribes to the SSE bus at /api/live and revalidates the stats SWR
 * cache whenever a click lands on the given link — the near-real-time
 * layer for the analytics dashboard. Returns whether the stream is connected.
 */
export function useLiveClicks(slug: string, options?: { announceToasts?: boolean }) {
  const { mutate } = useSWRConfig();
  const t = useT();
  // Latest translator without reopening the stream when the language changes.
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);
  const [connected, setConnected] = useState(false);
  const announceToasts = options?.announceToasts ?? false;
  const key = `/api/links/${slug}/stats`;

  useEffect(() => {
    const source = new EventSource("/api/live");

    const onClick = () => {
      mutate((k) => typeof k === "string" && k.startsWith(key), undefined, { revalidate: true });
      if (announceToasts) {
        toast(tRef.current("analytics.liveToast"), { description: tRef.current("analytics.liveToastBody") });
      }
    };
    const onConnected = () => setConnected(true);
    const onError = () => setConnected(source.readyState === EventSource.OPEN);

    source.addEventListener("click", onClick);
    source.addEventListener("connected", onConnected);
    source.addEventListener("error", onError);

    return () => {
      source.close();
    };
  }, [mutate, key, announceToasts]);

  return { connected };
}
