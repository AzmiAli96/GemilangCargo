import { truckData } from "../types/truck";
import prisma from "../db/prisma";

export const allTruck = async () => {
    const truck = await prisma.truck.findMany();
    return truck;
}

export const truckPaginate = async (skip: number, take: number) => {
    const truck = await prisma.truck.findMany({
        skip, take,
        orderBy: {
            id: "desc"
        }
    });
    return truck;
}

export const countTruck = async () => {
    return await prisma.truck.count();
}

export const TruckById = async (id: number) => {
    const truck = await prisma.truck.findUnique({
        where: { id: id },
    });
    return truck;
}

export const createTruck = async (item: truckData) => {
    const truck = await prisma.truck.create({
        data: {
            kode: item.kode,
            kapasitas: item.kapasitas,
            bb: item.bb,
            status: item.status,
        }
    })
    return truck;
}

export const updateTruck = async (id: number, item: truckData) => {
    const truck = await prisma.truck.update({
        where: { id: id },
        data: {
            kode: item.kode,
            kapasitas: item.kapasitas,
            bb: item.bb,
            status: item.status,
        },
    });
    return truck;
}

export const deleteTruck = async (id: number) => {
    await prisma.truck.delete({
        where: { id }
    });
}