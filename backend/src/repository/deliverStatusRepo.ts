import prisma from "../db/prisma";
import { statusData } from "../types/deliveryStatus";

export const getStatus = async () => {
    const status = await prisma.deliverStatus.findMany();
    return status;
}

export const getStatusPaginate = async (skip: number, take: number) => {
    const status = await prisma.deliverStatus.findMany({
        skip, take, include: {
            deliver: {
                include: {
                    order: true 
                }
            }
        },
        orderBy: {
            id: "desc"
        }
    });
    return status;
}

export const countStatus = async () => {
    return await prisma.deliverStatus.count();
}

export const StatusById = async (id: number) => {
    const status = await prisma.deliverStatus.findUnique({
        where: { id: id },
    });
    return status;
}

export const createStatus = async (item: statusData) => {
    const status = await prisma.deliverStatus.create({
        data: {
            deliverId: item.deliverId,
            statusPengiriman: item.statusPengiriman,
        }
    })
    return status;
}

export const updateStatus = async (id: number, item: statusData) => {
    const status = await prisma.deliverStatus.update({
        where: { id: id },
        data: {
            deliverId: item.deliverId,
            statusPengiriman: item.statusPengiriman,
        },
    });
    return status;
}

export const deleteStatus = async (id: number) => {
    await prisma.deliverStatus.delete({
        where: { id }
    });
}