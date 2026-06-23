"use server";

import { createInquiry } from "@property/db/queries/inquiries";
import { revalidateTag } from "next/cache";

export async function submitInquiry(formData: FormData) {
  try {
    await createInquiry({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      message: formData.get("message") as string,
      listingId: formData.get("listingId") ? Number(formData.get("listingId")) : undefined,
      template: formData.get("template") as string,
    });
    revalidateTag("inquiries");
    return { success: true, message: "Pesan berhasil dikirim. Kami akan menghubungi Anda segera." };
  } catch {
    return { success: false, message: "Gagal mengirim pesan. Silakan coba lagi." };
  }
}
