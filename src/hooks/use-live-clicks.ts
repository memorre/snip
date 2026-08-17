"use client";

import { useEffect } from "react";
import { useSWRConfig } from "swr";
import { toast } from "sonner";

/**
 * Subscribes to the SSE bus at /api/live and revalidates the stats SWR
 * cache whenever a click lands on the given link — the near-real-time
 * layer for the analytics dashboard.
 */
export function useLiveClicks(slug: string, options?: { announceToasts?: boolean }) {
  const { mutate } = useSWRConfig();
  const announceToasts = options?.announceToasts ?? false;
  const key = `/api/links/${slug}/stats`;

  useEffect(() => {
    const source = new EventSource("/api/live");

    const onClick = () => {
      mutate((k) => typeof k === "string" && k.startsWith(key), undefined, { revalidate: true });
      if (announceToasts) {
        toast("New click just landed", { description: "The chart below just updated." });
      }
    };

    source.addEventListener("click", onClick);

    return () => {
      source.close();
    };
  }, [mutate, key, announceToasts]);
}
