"use server";

const HAS_DB = !!(process.env.DATABASE_URL);

export async function submitInquiry(formData: FormData) {
  if (HAS_DB) {
    try {
      const { createInquiry } = await import("@property/db/queries/inquiries");
      await createInquiry({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || undefined,
        message: formData.get("message") as string,
        listingId: formData.get("listingId") ? Number(formData.get("listingId")) : undefined,
        template: formData.get("template") as string,
      });
      const { revalidateTag } = await import("next/cache");
      revalidateTag("inquiries");
    } catch {
      return { success: false, message: "Gagal mengirim pesan. Silakan coba lagi." };
    }
  }
  return { success: true, message: "Pesan berhasil dikirim. Kami akan menghubungi Anda segera." };
}
