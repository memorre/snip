"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Check, Copy, Plus } from "lucide-react";
import { createLink, type ActionState } from "@/app/actions";
import { useT } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function CreateLinkDialog() {
  const t = useT();
  const [open, setOpen] = React.useState(false);
  // A fresh form (and action state) every time the dialog opens.
  const [formKey, setFormKey] = React.useState(0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => {
          setFormKey((k) => k + 1);
          setOpen(true);
        }}
      >
        <Plus className="-ml-1 h-4 w-4" strokeWidth={2.25} />
        {t("dashboard.newLink")}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("create.title")}</DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
        </DialogHeader>
        <CreateLinkForm key={formKey} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function CreateLinkForm({ onClose }: { onClose: () => void }) {
  const t = useT();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createLink, undefined);
  const [copied, setCopied] = React.useState(false);

  const shortUrl =
    state?.success && state.slug && typeof window !== "undefined" ? `${window.location.origin}/${state.slug}` : null;

  React.useEffect(() => {
    if (state?.success) toast.success(t("create.created"));
    // Announce once per result; `t` changing language shouldn't re-toast.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {!shortUrl && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="targetUrl">{t("create.destination")}</Label>
            <Input
              id="targetUrl"
              name="targetUrl"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder={t("create.destinationPlaceholder")}
              required
              autoFocus
              defaultValue={state?.values?.targetUrl}
              aria-invalid={state?.field === "targetUrl" || undefined}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-3">
            <OptionalField
              id="slug"
              label={t("create.slug")}
              placeholder={t("create.slugPlaceholder")}
              defaultValue={state?.values?.slug}
              invalid={state?.field === "slug"}
            />
            <OptionalField
              id="title"
              label={t("create.label")}
              placeholder={t("create.labelPlaceholder")}
              defaultValue={state?.values?.title}
            />
          </div>
        </>
      )}

      {state?.error && (
        <p role="alert" className="rounded-xl bg-danger-soft px-3.5 py-2.5 text-[13px] text-danger">
          {state.error}
        </p>
      )}

      {shortUrl && (
        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-medium text-muted">{t("create.ready")}</p>
          <div className="flex items-center gap-2 rounded-xl bg-background-alt py-1.5 pl-3.5 pr-1.5">
            <span className="flex-1 truncate font-mono text-[15px] font-medium text-link">{shortUrl}</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(shortUrl);
                setCopied(true);
                toast.success(t("create.copied"));
              }}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-fill hover:text-foreground"
              aria-label={t("create.copy")}
              title={t("create.copy")}
            >
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      <DialogFooter>
        {shortUrl ? (
          <Button type="button" onClick={onClose}>
            {t("create.done")}
          </Button>
        ) : (
          <>
            <Button type="button" variant="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("create.submitting") : t("create.submit")}
            </Button>
          </>
        )}
      </DialogFooter>
    </form>
  );
}

function OptionalField({
  id,
  label,
  placeholder,
  defaultValue,
  invalid,
}: {
  id: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  invalid?: boolean;
}) {
  const t = useT();
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-[12px] text-muted-2">{t("common.optional")}</span>
      </div>
      <Input
        id={id}
        name={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete="off"
        aria-invalid={invalid || undefined}
      />
    </div>
  );
}
