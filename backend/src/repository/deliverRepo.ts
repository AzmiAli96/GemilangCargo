import { deliverData } from "../types/deliver";
import prisma from "../db/prisma";

export const getDeliver = async () => {
    const deliver = await prisma.deliver.findMany();
    return deliver;
}

export const getDeliverpaginate = async (skip: number, take: number) => {
    const deliver = await prisma.deliver.findMany({
        skip, take, orderBy: {
            id: "desc"
        }
    });
    return deliver;
}

export const countDelivery = async () => {
    return await prisma.deliver.count();
}

export const createDeliver = async (item: deliverData) => {
    const deliver = await prisma.deliver.create({
        data: {
            name: item.name,
            bb: item.bb,
            tanggalJalan: item.tanggalJalan,
        }
    });
    return deliver;
};

export const getDeliveryById = async (id: number) => {
    return await prisma.deliver.findUnique({
        where: { id }
    });
};

export const updateDelivery = async (id: number, item: deliverData) => {
    const delivery = await prisma.deliver.update({
        where: { id: id },
        data: {
            name: item.name,
            bb: item.bb,
            tanggalJalan: item.tanggalJalan,
        },
    });
    return delivery
}

export const deleteDelivery = async (id: number) => {
    await prisma.deliver.delete({
        where: { id }
    });
}

export const getDeliveryWithSummary = async () => {
    const deliveries = await prisma.deliver.findMany();

    const totals = await prisma.order.groupBy({
        by: ["deliveryId"],
        _sum: { total: true },
    });

    return deliveries.map((d) => {
        const found = totals.find(t => t.deliveryId === d.id);

        return {
            ...d,
            totalOrder: found?._sum.total || 0,
            profit: Number(found?._sum.total || 0) - Number(d.bb),
        };
    });
};