import { NextResponse } from "next/server";
import { getT } from "@/i18n/server";
import type { MessageVars } from "@/i18n/types";

/** Error keys the JSON API can return. Each `errors.<code>` message exists in every dictionary. */
export type ApiErrorCode =
  | "invalidUrl"
  | "invalidInput"
  | "slugFormat"
  | "slugReserved"
  | "slugTaken"
  | "unauthorized"
  | "notFound"
  | "crossOrigin"
  | "unsupportedMediaType";

/**
 * A JSON error in the API's one shape: `{ error, code, field? }`. `error` is localized for the request (the
 * `lang` cookie, then Accept-Language) so it can be shown as-is; `code` is stable, for clients that localize
 * on their own; `field` names the input the error is about.
 */
export async function apiError(
  status: number,
  code: ApiErrorCode,
  options: { vars?: MessageVars; field?: "targetUrl" | "slug" } = {}
) {
  const t = await getT();
  const body: { error: string; code: ApiErrorCode; field?: string } = {
    error: t(`errors.${code}`, options.vars),
    code,
  };
  if (options.field) body.field = options.field;
  return NextResponse.json(body, { status });
}

/** The errors.* key's last part, e.g. "errors.slugTaken" -> "slugTaken". */
export function codeFromKey(key: `errors.${ApiErrorCode}`): ApiErrorCode {
  return key.slice("errors.".length) as ApiErrorCode;
}
