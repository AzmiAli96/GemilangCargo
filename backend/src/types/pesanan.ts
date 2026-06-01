export type FilterHarga = "semua" | "hargaId" | "hargaCustom";

export interface pesananData {
    id: number;
    userId: number;
    hargaId: number;
    pengirimanId: number;
    noSpb: string;
    koli: number;
    berat: number;
    tujuan: string;
    hargaCustom: number;
    ket: string;
    prioritas: string;
    statusPay: string;
    total: number;
    tanggalMasuk: Date;
    image: string;
}