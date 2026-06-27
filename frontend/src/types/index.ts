export interface roleData {
    id: number;
    name: string;
}

export type Column = {
  key: string;
  label: React.ReactNode;
  render?: (row: any) => React.ReactNode;
  type?: "text" | "currency" | "number" | "date" | "weight";
};

export interface userData {
    id: number;
    email: string;
    password: string;
    name: string;
    alamat: string;
    noTelp: string;
    roleId: number;
    image: string;
}

export interface hargaData {
    id: number;
    provinsi: string;
    kota: string;
    harga: number;
}

export interface truckData {
    id: number;
    kode: string;
    kapasitas: number;
    bb: number;
    status: string;
}

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
    total: number;
    statusPay: string;
    image: string;
}

export interface pengirimanData {
    id: number;
    sopirIds: number[];
    truckId: number;
    name: string;
    totalHarga: number;
    totalBerat: number;
    tanggalJalan: Date;
    statusPengiriman: string;
    truck?: truckData;
}

export interface sopirData {
    id: number;
    deliverId: number;
    userId: number;
}

export interface statusData {
    id: number;
    statusPengiriman: string;
    deliverId: number;
}