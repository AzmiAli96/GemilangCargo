import { FilterHarga, pesananData } from "../types/pesanan";
import prisma from "../db/prisma";

export const getpesanan = async (
    skip: number,
    take: number,
    search: string,
    filterHarga: FilterHarga = "semua",
    pengiriman?: any) => {
    const isNumber = !isNaN(Number(search));
    const searchWhere = search ? {
        OR: [
            { noSpb: { contains: search, mode: "insensitive" as const } },
            { tujuan: { contains: search, mode: "insensitive" as const } },
            { prioritas: { contains: search, mode: "insensitive" as const } },
            ...(isNumber
                ? [{ koli: Number(search) }]
                : []),
            ...(isNumber
                ? [{ berat: Number(search) }]
                : []),
        ]
    } : {};

    const hargaWhere =
        filterHarga === "hargaId"
            ? { hargaId: { not: null } }         // hanya yang ada hargaId
            : filterHarga === "hargaCustom"
                ? { hargaCustom: { not: null } }      // hanya yang ada hargaCustom
                : {};                                  // semua

    let pengirimanWhere = {};
    if (pengiriman === "null") {
        pengirimanWhere = { pengirimanId: null };
    } else if (pengiriman) {
        pengirimanWhere = { pengirimanId: Number(pengiriman) };
    }

    return await prisma.pesanan.findMany({
        skip,
        take,
        where: {
            ...searchWhere,
            ...hargaWhere,
            ...pengirimanWhere,
        },
        orderBy: {
            id: "desc",
        },
        include: {
            user: true,
            harga: true,
            pengiriman: true
        }
    });
}


export const countpesanan = async (
    search: string,
    filterHarga: FilterHarga = "semua",
    pengiriman?: any) => {
    const isNumber = !isNaN(Number(search));
    const searchWhere = search ? {
        OR: [
            { noSpb: { contains: search, mode: "insensitive" as const } },
            { tujuan: { contains: search, mode: "insensitive" as const } },
            { prioritas: { contains: search, mode: "insensitive" as const } },
            ...(isNumber
                ? [{ koli: Number(search) }]
                : []),
            ...(isNumber
                ? [{ berat: Number(search) }]
                : []),
        ]
    } : {};

    const hargaWhere =
        filterHarga === "hargaId"
            ? { hargaId: { not: null } }         // hanya yang ada hargaId
            : filterHarga === "hargaCustom"
                ? { hargaCustom: { not: null } }      // hanya yang ada hargaCustom
                : {};

    let pengirimanWhere = {};
    if (pengiriman === "null") {
        pengirimanWhere = { pengirimanId: null };
    } else if (pengiriman) {
        pengirimanWhere = { pengirimanId: Number(pengiriman) };
    }

    return await prisma.pesanan.count({
        where: {
            ...searchWhere,
            ...hargaWhere,
            ...pengirimanWhere,
        }
    });
}

export const pesananById = async (id: number) => {
    const pesanan = await prisma.pesanan.findUnique({
        where: { id: id },
    });
    return pesanan;
}

export const createpesanan = async (item: pesananData) => {
    const pesanan = await prisma.pesanan.create({
        data: {
            userId: item.userId,
            hargaId: item.hargaId,
            pengirimanId: item.pengirimanId,
            noSpb: item.noSpb,
            koli: item.koli,
            berat: item.berat,
            tujuan: item.tujuan,
            hargaCustom: item.hargaCustom,
            ket: item.ket,
            prioritas: item.prioritas,
            total: item.total
        },
    });
    return pesanan;
}

export const updatepesanan = async (id: number, item: pesananData) => {
    const pesanan = await prisma.pesanan.update({
        where: { id: id },
        data: {
            userId: item.userId,
            hargaId: item.hargaId,
            pengirimanId: item.pengirimanId,
            noSpb: item.noSpb,
            koli: item.koli,
            berat: item.berat,
            tujuan: item.tujuan,
            hargaCustom: item.hargaCustom,
            ket: item.ket,
            prioritas: item.prioritas,
            statusPay: item.statusPay,
            tanggalMasuk: item.tanggalMasuk,
            image: item.image,
            total: item.total,
        },
    });
    return pesanan;
}

export const deletepesanan = async (id: number) => {
    const pesanan = await prisma.pesanan.delete({
        where: { id }
    });
    return pesanan;
}

export const assignpesananToPengiriman = async (pesananIds: number[], pengiriman: number) => {
    return await prisma.pesanan.updateMany({
        where: {
            id: {
                in: pesananIds,
            },
            pengirimanId: null,
        },
        data: {
            pengirimanId: pengiriman,
        },
    });
};