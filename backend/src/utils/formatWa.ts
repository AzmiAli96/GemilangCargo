export const formatPhoneNumber = (phone?: string | null) => {
  if (!phone) return null;

  // hapus spasi & karakter aneh
  let cleaned = phone.replace(/\D/g, "");

  // ubah 08xxx → 628xxx
  if (cleaned.startsWith("08")) {
    cleaned = "62" + cleaned.slice(1);
  }

  // harus diawali 62
  if (!cleaned.startsWith("62")) return null;

  // minimal panjang nomor (biar tidak aneh)
  if (cleaned.length < 10) return null;

  return cleaned;
};