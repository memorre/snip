import { bus } from "@/lib/live";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();
  let heartbeat: ReturnType<typeof setInterval>;
  let onClick: (linkId: string) => void;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: string) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
        } catch {
          // controller already closed
        }
      };

      onClick = (linkId) => send("click", linkId);
      bus.on("click", onClick);

      heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          // controller already closed
        }
      }, 25000);

      send("connected", "ok");
    },
    cancel() {
      clearInterval(heartbeat);
      bus.off("click", onClick);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
