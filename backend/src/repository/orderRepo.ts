import { FilterHarga, orderData } from "../types/order";
import prisma from "../db/prisma";

export const getOrder = async (
    skip: number,
    take: number,
    search: string,
    filterHarga: FilterHarga = "semua",
    deliveryId?: any) => {
    const isNumber = !isNaN(Number(search));
    const searchWhere = search ? {
        OR: [
            { noSpb: { contains: search, mode: "insensitive" as const } },
            { alamaTujuan: { contains: search, mode: "insensitive" as const } },
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
        filterHarga === "priceId"
            ? { priceId: { not: null } }         // hanya yang ada priceId
            : filterHarga === "hargaCustom"
                ? { hargaCustom: { not: null } }      // hanya yang ada hargaCustom
                : {};                                  // semua

    let deliveryWhere = {};
    if (deliveryId === "null") {
        deliveryWhere = { deliveryId: null };
    } else if (deliveryId) {
        deliveryWhere = { deliveryId: Number(deliveryId) };
    }

    return await prisma.order.findMany({
        skip,
        take,
        where: {
            ...searchWhere,
            ...hargaWhere,
            ...deliveryWhere,
        },
        orderBy: {
            id: "desc",
        },
        include: {
            user: true,
            price: true,
            delivery: true
        }
    });
}


export const countOrder = async (
    search: string,
    filterHarga: FilterHarga = "semua",
    deliveryId?: any) => {
    const isNumber = !isNaN(Number(search));
    const searchWhere = search ? {
        OR: [
            { noSpb: { contains: search, mode: "insensitive" as const } },
            { alamaTujuan: { contains: search, mode: "insensitive" as const } },
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
        filterHarga === "priceId"
            ? { priceId: { not: null } }         // hanya yang ada priceId
            : filterHarga === "hargaCustom"
                ? { hargaCustom: { not: null } }      // hanya yang ada hargaCustom
                : {};

    let deliveryWhere = {};
    if (deliveryId === "null") {
        deliveryWhere = { deliveryId: null };
    } else if (deliveryId) {
        deliveryWhere = { deliveryId: Number(deliveryId) };
    }

    return await prisma.order.count({
        where: {
            ...searchWhere,
            ...hargaWhere,
            ...deliveryWhere,
        }
    });
}

export const OrderById = async (id: number) => {
    const order = await prisma.order.findUnique({
        where: { id: id },
    });
    return order;
}

export const createOrder = async (item: orderData) => {
    const order = await prisma.order.create({
        data: {
            userId: item.userId,
            priceId: item.priceId,
            deliveryId: item.deliveryId,
            noSpb: item.noSpb,
            koli: item.koli,
            berat: item.berat,
            alamaTujuan: item.alamaTujuan,
            hargaCustom: item.hargaCustom,
            ket: item.ket,
            prioritas: item.prioritas,
            total: item.total
        },
    });
    return order;
}

export const updateOrder = async (id: number, item: orderData) => {
    const order = await prisma.order.update({
        where: { id: id },
        data: {
            userId: item.userId,
            priceId: item.priceId,
            deliveryId: item.deliveryId,
            noSpb: item.noSpb,
            koli: item.koli,
            berat: item.berat,
            alamaTujuan: item.alamaTujuan,
            hargaCustom: item.hargaCustom,
            ket: item.ket,
            prioritas: item.prioritas,
            status: item.status,
            image: item.image,
            total: item.total,
        },
    });
    return order;
}

export const deleteOrder = async (id: number) => {
    const order = await prisma.order.delete({
        where: { id }
    });
    return order;
}

export const assignOrderToDelivery = async (orderIds: number[], deliveryId: number) => {
    return await prisma.order.updateMany({
        where: {
            id: {
                in: orderIds,
            },
            deliveryId: null,
        },
        data: {
            deliveryId: deliveryId,
        },
    });
};