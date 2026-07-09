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
    platNomor: string;
    kondisi: string;
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
    kapasotas: number;
    bb: number;
    totalHarga: number;
    totalBerat: number;
    tanggalJalan: Date;
    statusPengiriman: string;
    truck?: truckData;
}

export interface pengeluaranData {
    id: number;
    pengirimanId: number;
    nama: string;
    kategori: string;
    nominal: number;
    keterangan: string;
}

export interface GenerateTruck {
    truckId: number;
    kapasitas: number;
    bb: number;
}

export interface statusData {
    id: number;
    statusPengiriman: string;
    deliverId: number;
}