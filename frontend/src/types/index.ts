export interface roleData {
    id: number;
    name: string;
}

export type Column = {
  key: string;
  label: React.ReactNode;
  render?: (row: any) => React.ReactNode;
  type?: "text" | "currency" | "number" | "date";
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

export interface priceData {
    id: number;
    provinsi: string;
    kota: string;
    harga: number;
}

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
    total: number;
    status: string;
    image: string;
}

export interface deliverData {
    id: number;
    name: string;
    bb: number;
    tanggalJalan: Date;
}

export interface driverData {
    id: number;
    deliverId: number;
    userId: number;
}

export interface statusData {
    id: number;
    statusPengiriman: string;
    deliverId: number;
}