import { FilterHarga, pesananData } from "../types/pesanan";
import { allPesanan, assignpesananToPengiriman, countpesanan, createpesanan, deletepesanan, getpesanan, getPesananBulananRepo, pesananById, recalculatePengiriman, updatepesanan } from "../repository/pesananRepo";
import { hitungBeratTagih, hitungPrioritas } from "../utils/kmeans";
import { readExcel } from "../utils/excel";
import { prisma } from "../db/prisma";
import { getHargaById } from "../repository/hargaRepo";
import { getPagination, getPagingData } from "../utils/pagination";

export const getPesananAll = async () => {
    const pesanan = await allPesanan();
    return pesanan;
}

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
    const isExpress = item.jenisPengiriman === "EXPRESS";

    const prioritas = isExpress
        ? "Prioritas Ekspress"
        : hitungPrioritas({ berat: item.berat, koli: item.koli });

    const beratTagih = hitungBeratTagih(item.berat);
    let total = 0;

    if (isExpress) {
        if (!item.hargaId) {
            throw new Error("harga ID tetap harus diisi untuk express");
        }
        const harga = await getHargaById(item.hargaId);
        if (!harga) {
            throw new Error("harga tidak ditemukan");
        }
        const tambahan = Number(item.hargaCustom ?? 0);

        total = beratTagih * (Number(harga.hargaTarif) + tambahan);
    } else {
        if (!item.hargaId) {
            throw new Error("harga ID harus diisi jika harga custom tidak disediakan");
        }

        const harga = await getHargaById(item.hargaId);
        if (!harga) {
            throw new Error("harga tidak ditemukan");
        }

        total = beratTagih * Number(harga.hargaTarif);
    }

    const pesanan = await createpesanan({
        ...item,
        prioritas,
        total,
    });

    return pesanan;
}

// export const postpesanan = async (item: pesananData) => {
//     const prioritas = hitungPrioritas({
//         berat: item.berat,
//         koli: item.koli,
//     });

//     const beratTagih = hitungBeratTagih(item.berat);
//     let total = 0;

//     if (item.hargaCustom && item.hargaCustom > 0) {
//         total = item.berat * item.hargaCustom;
//     } else {
//         if (!item.hargaId) {
//             throw new Error("harga ID harus diisi jika harga custom tidak disediakan");
//         }

//         const harga = await getHargaById(item.hargaId);

//         if (!harga) {
//             throw new Error("harga tidak ditemukan");
//         }

//         total = beratTagih * Number(harga.hargaTarif);
//     }

//     const pesanan = await createpesanan({
//         ...item,
//         prioritas,
//         total,
//     });

//     return pesanan;
// }

// export const putpesanan = async (id: number, item: pesananData) => {
//     const pesanan = await updatepesanan(id, item);
//     return pesanan;
// }
export const putpesanan = async (id: number, item: Partial<pesananData>) => {
    const oldPesanan = await pesananById(id);

    if (!oldPesanan) {
        throw new Error("Pesanan tidak ditemukan");
    }

    const needRecalculate =
        item.berat !== undefined ||
        item.koli !== undefined ||
        item.hargaCustom !== undefined ||
        item.hargaId !== undefined;
    item.jenisPengiriman !== undefined;

    const berat = Number(item.berat ?? oldPesanan.berat);
    const koli = Number(item.koli ?? oldPesanan.koli);

    const hargaCustomFinal =
        item.hargaCustom !== undefined
            ? (item.hargaCustom != null ? Number(item.hargaCustom) : null)
            : oldPesanan.hargaCustom != null
                ? Number(oldPesanan.hargaCustom)
                : null;

    const hargaIdFinal =
        item.hargaId !== undefined
            ? (item.hargaId != null ? Number(item.hargaId) : null)
            : oldPesanan.hargaId != null
                ? Number(oldPesanan.hargaId)
                : null;

    const jenisPengirimanFinal = item.jenisPengiriman ?? oldPesanan.jenisPengiriman;
    const isExpress = jenisPengirimanFinal === "EXPRESS";

    let prioritas = oldPesanan.prioritas;
    let total = Number(oldPesanan.total);

    if (needRecalculate) {
        prioritas = isExpress
            ? "Prioritas Ekspress"
            : hitungPrioritas({ berat, koli });

        const beratTagih = hitungBeratTagih(berat);

        if (isExpress) {
            if (hargaIdFinal == null) {
                throw new Error("Harga tidak ditemukan");
            }
            const harga = await getHargaById(hargaIdFinal);
            if (!harga) {
                throw new Error("harga tidak ditemukan");
            }
            const tambahan = Number(hargaCustomFinal ?? 0);
            total = beratTagih * (Number(harga.hargaTarif) + tambahan);
        } else {
            if (!hargaIdFinal) {
                throw new Error("harga ID harus diisi jika harga custom tidak disediakan");
            }
            const harga = await getHargaById(hargaIdFinal);
            if (!harga) {
                throw new Error("harga tidak ditemukan");
            }
            total = beratTagih * Number(harga.hargaTarif);
        }
    }

    const pesanan = await updatepesanan(id, {
        ...item,
        ...(item.userId !== undefined && { userId: Number(item.userId) }),
        berat,
        koli,
        hargaCustom: hargaCustomFinal,
        hargaId: hargaIdFinal,
        jenisPengiriman: jenisPengirimanFinal,
        prioritas,
        total,
        statusPay:
            item.statusPay ??
            oldPesanan.statusPay ??
            "Belum Lunas",
    });

    if (
        oldPesanan.pengirimanId &&
        item.pengirimanId === null
    ) {
        await recalculatePengiriman(
            oldPesanan.pengirimanId
        );
    }
    return pesanan;
};

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


export const getPesananBulanan = async (tahun: number) => {

    const data = await getPesananBulananRepo(tahun);

    const hasil = Array.from({ length: 12 }, (_, index) => ({
        bulan: index + 1,
        jumlah: 0
    }));

    data.forEach((item) => {
        const bulan = new Date(item.tanggalMasuk).getMonth();

        hasil[bulan].jumlah++;
    });

    return hasil;
};