import { sopirData } from "../types/sopir";
import prisma from "../db/prisma";

export const getsopir = async () => {
    const sopir = await prisma.sopir.findMany();
    return sopir;
}

export const getSopirPaginate = async (skip: number, take: number, search: string) => {
    const where = search
        ? {
            OR: [
                { user: { name: { contains: search, mode: "insensitive" as const } } },
            ],
        } : {};
    return await prisma.sopir.findMany({
        skip, take, where, include: {
            user: true,
            pengiriman: true,
        }
    });
}

export const countSopir = async (search: string) => {
    const where = search
        ? {
            OR: [
                { user: { name: { contains: search, mode: "insensitive" as const } } },
            ],
        } : {};

    return await prisma.sopir.count({
        where
    });
}

export const createSopir = async (item: sopirData) => {
    const sopir = await prisma.sopir.create({
        data: {
            userId: item.userId,
        }
    });
    return sopir;
}

export const updateSopir = async (id: number, item: sopirData) => {
    const sopir = await prisma.sopir.update({
        where: { id: id },
        data: {
            userId: item.userId,
        },
    });
    return sopir
}

export const deleteSopir = async (id: number) => {
    await prisma.sopir.delete({
        where: { id }
    });
}

// export const countSopirByDelivery = async (deliverId: number) => {
//     return await prisma.sopir.count({
//         where: { deliverId }
//     });
// };