import { EventEmitter } from "node:events";

// In-memory pub/sub for near-real-time push over Server-Sent Events.
// Works within a single Node.js server instance. At production scale
// (multiple serverless instances), swap for a hosted pub/sub such as
// Pusher, Ably, or Supabase Realtime — the publish/subscribe call sites
// below don't change, only what backs `bus`.
//
// The bus lives on globalThis in every environment, not just in development: the redirect page and
// the /api/live route are bundled separately, so each would otherwise get its own module instance
// (and its own emitter), and published clicks would never reach the stream.
const globalForBus = globalThis as unknown as { liveBus: EventEmitter | undefined };

export const bus = (globalForBus.liveBus ??= new EventEmitter());
bus.setMaxListeners(0);

export function publishClick(linkId: string) {
  bus.emit("click", linkId);
}
