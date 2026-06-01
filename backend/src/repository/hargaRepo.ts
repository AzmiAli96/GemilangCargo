import { hargaData } from '../types/harga';
import prisma from '../db/prisma';

export const AllHarga = async () => {
    const harga = await prisma.harga.findMany();
    return harga
}

export const getHarga = async (skip: number, take: number, search: string) => {
    const isNumber = !isNaN(Number(search));

    const where = search ? {
        OR: [
            { provinsi: { contains: search, mode: "insensitive" as const } },
            { kota: { contains: search, mode: "insensitive" as const } },
            ...(isNumber
                ? [{ hargaTarif: Number(search) }]
                : []),
        ]
    } : {};

    return await prisma.harga.findMany({
        skip, take, where,
    });
}

export const countHarga = async (search: string) => {
    const isNumber = !isNaN(Number(search));
    const where = search ? {
        OR: [
            { provinsi: { contains: search, mode: "insensitive" as const } },
            { kota: { contains: search, mode: "insensitive" as const } },
            ...(isNumber
                ? [{ hargaTarif: Number(search) }]
                : []),
        ]
    } : {};
    return await prisma.harga.count();
}

export const getHargaById = async (id: number) => {
    return await prisma.harga.findUnique({
        where: { id }
    });
};

export const createHarga = async (item: hargaData) => {
    const harga = await prisma.harga.create({
        data: {
            provinsi: item.provinsi,
            kota: item.kota,
            hargaTarif: item.hargaTarif,
        },
    });
    return harga;
}

export const updateHarga = async (id: number, item: hargaData) => {
    const harga = await prisma.harga.update({
        where: { id: id },
        data: {
            provinsi: item.provinsi,
            kota: item.kota,
            hargaTarif: item.hargaTarif,
        },
    });
    return harga
}

export const deleteHarga = async (id: number) => {
    await prisma.harga.delete({
        where: { id }
    });
}