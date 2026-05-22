export type FilterHarga = "semua" | "priceId" | "hargaCustom";

export interface orderData {
    id: number;
    userId: number;
    priceId: number;
    deliveryId: number;
    noSpb: string;
    koli: number;
    berat: number;
    alamaTujuan: string;
    hargaCustom: number;
    ket: string;
    prioritas: string;
    status: string;
    total: number;
    image: string;
}