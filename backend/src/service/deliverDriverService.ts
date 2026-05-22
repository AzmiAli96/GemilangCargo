import { driverData } from "../types/deliveryDriver";
import { countDriver, countDriverByDelivery, createDriver, deleteDriver, getdriver, getDriverPaginate, updateDriver } from "../repository/deliverDriverRepo"
import { getPagination, getPagingData } from "../utils/pagination";

export const getAllDriver = async () => {
    const driver = await getdriver();
    return driver;
}

export const getAllDriverPaginate = async ({ page, limit, search }: { page: number, limit: number, search: string }) => {
    const { skip, take, currentPage } = getPagination(page, limit);

    const driver = await getDriverPaginate(skip, take, search);
    const total = await countDriver(search);
    return {
        data: driver,
        meta: getPagingData(total, currentPage, take)
    };
}

export const postDriver = async (item: driverData) => {
    const count = await countDriverByDelivery(item.deliverId);

    if (count >= 2) {
        throw new Error("Driver maksimal hanya 2 dalam 1 delivery");
    }

    const driver = await createDriver(item);
    return driver;
}

export const putDriver = async (id: number, item: driverData) => {
    const driver = await updateDriver(id, item);
    return driver;
}

export const deleteDriverId = async (id: number ) => {
    await deleteDriver(id);
}
