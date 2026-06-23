"use client";

import { useState, useTransition } from "react";
import { Send, CheckCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

interface ContactFormProps {
  action: (data: FormData) => Promise<{ success: boolean; message: string }>;
  listingId?: number;
  template: string;
  className?: string;
}

export function ContactForm({ action, listingId, template, className }: ContactFormProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await action(formData);
      setResult(res);
    });
  };

  if (result?.success) {
    return (
      <div className={cn("flex flex-col items-center gap-3 py-8 text-center", className)}>
        <CheckCircle className="text-green-500 size-12" />
        <p className="font-medium">{result.message}</p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className={cn("space-y-4", className)}>
      <input type="hidden" name="template" value={template} />
      {listingId && <input type="hidden" name="listingId" value={listingId} />}

      <div className="space-y-1">
        <Label htmlFor="name">Nama</Label>
        <Input id="name" name="name" required placeholder="Nama lengkap" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="email@contoh.com" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone">Telepon</Label>
          <Input id="phone" name="phone" placeholder="+62..." />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="message">Pesan</Label>
        <Textarea id="message" name="message" required rows={4} placeholder="Saya tertarik dengan properti ini..." />
      </div>

      {result && !result.success && (
        <p className="text-destructive text-sm">{result.message}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          "Mengirim..."
        ) : (
          <>
            <Send className="size-4" /> Kirim Pesan
          </>
        )}
      </Button>
    </form>
  );
}
