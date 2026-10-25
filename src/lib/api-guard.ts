import { apiError } from "@/lib/api-errors";

// Browser requests that must not reach the cookie-authenticated JSON API's writes.
//
// Server Actions get Next's Origin check; Route Handlers get none. SameSite=Lax doesn't cover the gap: the
// other *.yetao.org sites are same-site with Snip, so the browser sends Snip's session cookie on their
// requests too, and a `no-cors` fetch or a `text/plain` form from any of them could create links. Browsers
// always send Origin (and Sec-Fetch-Site) on these methods; the native app (URLSession) and curl send
// neither and pass.

/** The hosts this request was addressed to: its own URL's, and the proxy's public one. */
function requestHosts(request: Request) {
  const hosts = new Set([new URL(request.url).host]);
  const host = request.headers.get("host");
  if (host) hosts.add(host);
  const forwarded = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (forwarded) hosts.add(forwarded);
  return hosts;
}

/** An Origin header's host; "" for "null" (sandboxed frames, file pages) and anything unparsable. */
function originHost(origin: string) {
  try {
    return new URL(origin).host;
  } catch {
    return "";
  }
}

function isJson(contentType: string | null) {
  return contentType?.split(";")[0]?.trim().toLowerCase() === "application/json";
}

/**
 * Why this write must be refused, or null to go ahead. `json`: the request has a JSON body, which must say so
 * (no HTML form can send `application/json`, and a cross-origin fetch that does needs a CORS preflight this
 * API never grants).
 */
export function writeRequestProblem(request: Request, { json }: { json: boolean }) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site" || fetchSite === "same-site") return "crossOrigin" as const;
  const origin = request.headers.get("origin");
  if (origin !== null && !requestHosts(request).has(originHost(origin))) return "crossOrigin" as const;
  if (json && !isJson(request.headers.get("content-type"))) return "unsupportedMediaType" as const;
  return null;
}

/** A 403 or 415 for a write that `writeRequestProblem` refuses, or null to go ahead. */
export async function rejectWriteRequest(request: Request, options: { json: boolean }) {
  const problem = writeRequestProblem(request, options);
  if (problem === "crossOrigin") return apiError(403, "crossOrigin");
  if (problem === "unsupportedMediaType") return apiError(415, "unsupportedMediaType");
  return null;
}
