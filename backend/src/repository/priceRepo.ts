import { priceData } from '../types/price';
import prisma from '../db/prisma';

export const AllPrice = async () => {
    const price = await prisma.price.findMany();
    return price
}

export const getPrice = async (skip: number, take: number, search: string) => {
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

    return await prisma.price.findMany({
        skip, take, where,
    });
}

export const countPrice = async (search: string) => {
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
    return await prisma.price.count();
}

export const getPriceById = async (id: number) => {
    return await prisma.price.findUnique({
        where: { id }
    });
};

export const createPrice = async (item: priceData) => {
    const price = await prisma.price.create({
        data: {
            provinsi: item.provinsi,
            kota: item.kota,
            hargaTarif: item.hargaTarif,
        },
    });
    return price;
}

export const updatePrice = async (id: number, item: priceData) => {
    const price = await prisma.price.update({
        where: { id: id },
        data: {
            provinsi: item.provinsi,
            kota: item.kota,
            hargaTarif: item.hargaTarif,
        },
    });
    return price
}

export const deletePrice = async (id: number) => {
    await prisma.price.delete({
        where: { id }
    });
}