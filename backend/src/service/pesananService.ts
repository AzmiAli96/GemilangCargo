import { FilterHarga, pesananData } from "../types/pesanan";
import { assignpesananToPengiriman, countpesanan, createpesanan, deletepesanan, getpesanan, pesananById, updatepesanan } from "../repository/pesananRepo";
import { hitungPrioritas } from "../utils/kmeans";
import { readExcel } from "../utils/excel";
import { prisma } from "../db/prisma";
import { getHargaById } from "../repository/hargaRepo";
import { getPagination, getPagingData } from "../utils/pagination";

export const getAllpesanan = async ({ 
    page, 
    limit, 
    search, 
    filterHarga = "semua",
    pengirimanId, }: { 
        page: number, 
        limit: number, 
        search: string, 
        filterHarga: FilterHarga,
        pengirimanId?: any,
    }) => {
    const { skip, take, currentPage } = getPagination(page, limit);

    const pesanans = await getpesanan(skip, take, search, filterHarga, pengirimanId);
    const total = await countpesanan(search, filterHarga, pengirimanId);
    return {
        data: pesanans,
        meta: getPagingData(total, currentPage, take)
    };
}

export const getpesananById = async (id: number) => {
    const pesanan = await pesananById(id);
    return pesanan;
}

export const postpesanan = async (item: pesananData) => {
    const prioritas = hitungPrioritas({
        berat: item.berat,
        koli: item.koli,
    });

    let total = 0;

    if (item.hargaCustom && item.hargaCustom > 0) {
        total = item.berat * item.hargaCustom;
    } else {
        if (!item.hargaId) {
            throw new Error("harga ID harus diisi jika harga custom tidak disediakan");
        }

        const harga = await getHargaById(item.hargaId);

        if (!harga) {
            throw new Error("harga tidak ditemukan");
        }

        total = item.berat * Number(harga.hargaTarif);

    }

    const pesanan = await createpesanan({
        ...item,
        prioritas,
        total,
    });

    return pesanan;
}

export const putpesanan = async (id: number, item: pesananData) => {
    const pesanan = await updatepesanan(id, item);
    return pesanan;
}

export const deletepesananId = async (id: number) => {
    const pesanan = await deletepesanan(id);
    return pesanan
}

export const putAssignpesananTopengiriman = async (pesananIds: number[], pengirimanId: number) => {
    return await assignpesananToPengiriman(pesananIds, pengirimanId);
}









const parseKoli = (val: any) => {
    if (typeof val === "string" && val.includes("/")) {
        return parseFloat(val.split("/")[0]);
    }
    return parseFloat(val);
};

export const importpesananFromExcel = async (filePath: string) => {
    const data: any[] = readExcel(filePath);

    const pesanans = data.map((row) => {
        const berat = parseFloat(row["KG"]);
        const koli = parseKoli(row["Koli"]);

        // 🔥 HITUNG PRIORITAS DI SINI
        const prioritas = hitungPrioritas({
            berat,
            koli
        });

        return {
            userId: 2,
            noSpb: "IMPORT-" + Date.now(),
            tujuan: "Import Excel",

            berat,
            koli,
            hargaCustom: parseFloat(row["Harga"]),
            total: parseFloat(row["Total"]),
            createdAt: new Date(row["Tanggal"]),

            prioritas, // ✅ langsung isi
        };
    });

    await prisma.pesanan.createMany({
        data: pesanans,
    });

    return pesanans.length;
};