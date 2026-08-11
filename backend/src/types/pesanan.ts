export type FilterHarga = "semua" | "hargaId" | "hargaCustom";

export interface pesananData {
    userId: number;
    hargaId: number | null;
    pengirimanId: number | null;
    noSpb: string;
    koli: number;
    berat: number;
    tujuan: string;
    hargaCustom: number | null;
    jenisPengiriman: string;
    ket: string | null;
    prioritas: string;
    statusPay: string;
    total: number;
    tanggalMasuk: Date;
    image: string | null;
}