export interface pengirimanData {
    id: number;
    sopirIds: number[];
    truckId: number;
    name: string;
    totalBerat: number;
    totalHarga: number;
    tanggalJalan: Date;
    statusPengiriman: string;
}