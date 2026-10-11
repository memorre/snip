/** SWR fetcher. Throws on error responses so SWR keeps the last good data instead of an error body. */
export const fetcher = async (url: string) => {
  const res = await fetch(url);
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error((body as { error?: string } | null)?.error ?? res.statusText);
  }
  return body;
};
