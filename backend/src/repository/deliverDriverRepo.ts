import { driverData } from "../types/deliveryDriver";
import prisma from "../db/prisma";

export const getdriver = async () => {
    const driver = await prisma.deliveryDriver.findMany();
    return driver;
}

export const getDriverPaginate = async (skip: number, take: number, search: string) => {
    const where = search
        ? {
            OR: [
                { user: { name: { contains: search, mode: "insensitive" as const } } },
            ],
        } : {};
    return await prisma.deliveryDriver.findMany({
        skip, take, where, include: {
            user: true,
            deliver: true,
        }
    });
}

export const countDriver = async (search: string) => {
    const where = search
        ? {
            OR: [
                { user: { name: { contains: search, mode: "insensitive" as const } } },
            ],
        } : {};

    return await prisma.deliveryDriver.count({
        where
    });
}

export const createDriver = async (item: driverData) => {
    const driver = await prisma.deliveryDriver.create({
        data: {
            deliverId: item.deliverId,
            userId: item.userId,
        }
    });
    return driver;
}

export const updateDriver = async (id: number, item: driverData) => {
    const driver = await prisma.deliveryDriver.update({
        where: { id: id },
        data: {
            deliverId: item.deliverId,
            userId: item.userId,
        },
    });
    return driver
}

export const deleteDriver = async (id: number) => {
    await prisma.deliveryDriver.delete({
        where: { id }
    });
}

export const countDriverByDelivery = async (deliverId: number) => {
    return await prisma.deliveryDriver.count({
        where: { deliverId }
    });
};