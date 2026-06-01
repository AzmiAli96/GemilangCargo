import { getPagination, getPagingData } from "../utils/pagination";
import { allTruck, countTruck, createTruck, deleteTruck, TruckById, truckPaginate, updateTruck } from "../repository/truckRepo";
import { truckData } from "../types/truck";

export const getTruck = async () => {
    const truck = await allTruck();
    return truck;
}

export const getTruckPaginate = async ({ page, limit }: { page: number, limit: number }) => {
    const { skip, take, currentPage } = getPagination(page, limit);

    const truck = await truckPaginate(skip, take);
    const total = await countTruck();
    return {
        data: truck,
        meta: getPagingData(total, currentPage, take)
    };
}

export const getTruckById = async (id: number) => {
    const truck = await TruckById(id);
    return truck;
}

export const postTruck = async (item: truckData) => {
    const truck = await createTruck(item);
    return truck;
}

export const putTruck = async (id: number, item: truckData) => {
    const truck = await updateTruck(id, item);
    return truck;
}

export const deleteTruckId = async (id: number) => {
    await deleteTruck(id);
}

