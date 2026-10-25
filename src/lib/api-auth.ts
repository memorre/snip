import { auth } from "@/auth";

/**
 * The signed-in user for a JSON route, or null. Unlike `requireUser()` it never redirects, so API clients
 * (the native app) get a 401 they can act on instead of the login page's HTML. The one place to extend if
 * the API ever accepts bearer tokens as well as the session cookie.
 */
export async function getApiUser() {
  const session = await auth();
  return session?.user ?? null;
}
