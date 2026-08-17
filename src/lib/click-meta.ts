import { UAParser } from "ua-parser-js";

export function parseUserAgent(uaString: string | null) {
  if (!uaString) return { browser: null, os: null, deviceType: "OTHER" as const };
  const { browser, os, device } = UAParser(uaString);
  const deviceType = device.type === "mobile" ? "MOBILE" : device.type === "tablet" ? "TABLET" : "DESKTOP";
  return {
    browser: browser.name ?? null,
    os: os.name ?? null,
    deviceType: deviceType as "MOBILE" | "TABLET" | "DESKTOP",
  };
}

/** Vercel injects geo headers at the edge — see https://vercel.com/docs/edge-network/headers */
export function parseGeo(headers: Headers) {
  return {
    country: headers.get("x-vercel-ip-country"),
    city: headers.get("x-vercel-ip-city") ? decodeURIComponent(headers.get("x-vercel-ip-city")!) : null,
  };
}
