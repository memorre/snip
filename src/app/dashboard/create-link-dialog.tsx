"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Check, Copy, Plus } from "lucide-react";
import { createLink, type ActionState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export function CreateLinkDialog() {
  const [open, setOpen] = React.useState(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createLink, undefined);
  const prevSuccess = React.useRef(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [copied, setCopied] = React.useState(false);

  const shortUrl =
    state?.success && state.slug && typeof window !== "undefined"
      ? `${window.location.origin}/${state.slug}`
      : null;

  React.useEffect(() => {
    if (state?.success && !prevSuccess.current) {
      toast.success("Short link created");
      formRef.current?.reset();
      setCopied(false);
    }
    prevSuccess.current = !!state?.success;
  }, [state]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      prevSuccess.current = false;
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> New link
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a short link</DialogTitle>
          <DialogDescription>Paste a URL — Snip will generate a slug, or pick your own.</DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="targetUrl">Destination URL</Label>
            <Input id="targetUrl" name="targetUrl" type="url" placeholder="https://example.com/a/long/path" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="slug">Custom slug (optional)</Label>
              <Input id="slug" name="slug" placeholder="auto-generated" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Label (optional)</Label>
              <Input id="title" name="title" placeholder="e.g. Launch tweet" />
            </div>
          </div>

          {state?.error && <p className="rounded-lg bg-danger-soft px-3 py-2 text-xs text-danger">{state.error}</p>}

          {shortUrl && (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2">
              <span className="flex-1 truncate text-sm font-medium text-primary">{shortUrl}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(shortUrl);
                  setCopied(true);
                  toast.success("Copied");
                }}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
                aria-label="Copy link"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
              {shortUrl ? "Done" : "Cancel"}
            </Button>
            {!shortUrl && (
              <Button type="submit" disabled={pending}>
                {pending ? "Creating…" : "Create link"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
