import { pengeluaranData } from "../types/penegeluaran";
import prisma from "../db/prisma";

export const pengeluaran = async () => {
    return await prisma.pengeluaran.findMany();
}

export const pengeluaranPaginate = async (skip: number, take: number, search: string) => {
    const where = search ? {
        OR: [
            { nama: { contains: search, mode: "insensitive" as const } },
            { kategori: { contains: search, mode: "insensitive" as const } },
        ]
    } : {};
    return await prisma.pengeluaran.findMany({
        skip, take, where,
    })
}

export const countPengeluaran = async (search: string) => {
    const where = search ? {
        OR: [
            { nama: { contains: search, mode: "insensitive" as const } },
            { kategori: { contains: search, mode: "insensitive" as const } },
        ]
    } : {};
    return await prisma.pengeluaran.count({ where });
}

export const pengeluaranById = async (id: number) => {
    return await prisma.pengeluaran.findUnique({
        where: { id }
    });
}

export const createPengeluaran = async (item: pengeluaranData) => {
    const result = await prisma.pengeluaran.create({
        data: {
            pengirimanId: item.pengirimanId ?? null,
            nama: item.nama,
            kategori: item.kategori,
            nominal: item.nominal,
            keterangan: item.keterangan,
        },
    });
    return result;
}

export const updatePengeluaran = async (id: number, item: pengeluaranData) => {
    return await prisma.pengeluaran.update({
        where: { id: id },
        data: {
            pengirimanId: item.pengirimanId,
            nama: item.nama,
            kategori: item.kategori,
            nominal: item.nominal,
            keterangan: item.keterangan,
        }
    });
}

export const deletePengeluaran = async (id: number) => {
    await prisma.pengeluaran.delete({
        where: { id }
    });
}