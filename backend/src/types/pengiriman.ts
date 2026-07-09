export interface pengirimanData {
    id: number;
    sopirIds: number[];
    truckId: number;
    name: string;
    kapasitas: number;
    bb: number;
    totalBerat: number;
    totalHarga: number;
    tanggalJalan: Date;
    statusPengiriman: string;
}

export interface GenerateTruckDto {
    truckId: number;
    kapasitas: number;
    bb: number;
}

export interface GeneratePengirimanData {
    truckId: number;
    kapasitas: number;
    bb: number;
    totalBerat: number;
    totalHarga: number;
    tanggalJalan: Date;
    statusPengiriman: string;
}