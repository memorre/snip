import Link from "next/link";
import { Link2Off } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4">
      <div className="bg-mesh pointer-events-none absolute inset-0" />
      <Card className="glass relative z-10 flex max-w-sm flex-col items-center gap-4 p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Link2Off className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">This link doesn&apos;t exist</h1>
          <p className="mt-1 text-sm text-muted">
            It may have been disabled, expired, or never existed in the first place.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Back to Snip</Link>
        </Button>
      </Card>
    </div>
  );
}
