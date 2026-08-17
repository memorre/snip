import { EventEmitter } from "node:events";

// In-memory pub/sub for near-real-time push over Server-Sent Events.
// Works within a single Node.js server instance. At production scale
// (multiple serverless instances), swap for a hosted pub/sub such as
// Pusher, Ably, or Supabase Realtime — the publish/subscribe call sites
// below don't change, only what backs `bus`.
const globalForBus = globalThis as unknown as { liveBus: EventEmitter | undefined };

export const bus = globalForBus.liveBus ?? new EventEmitter();
bus.setMaxListeners(0);
if (process.env.NODE_ENV !== "production") globalForBus.liveBus = bus;

export function publishClick(linkId: string) {
  bus.emit("click", linkId);
}
