import { deliverData } from "../types/deliver";
import { countDelivery, createDeliver, deleteDelivery, getDeliver, getDeliverpaginate, getDeliveryById, getDeliveryWithSummary, updateDelivery } from "../repository/deliverRepo"
import { getPagination, getPagingData } from "../utils/pagination";

export const getAllDeliver = async () => {
    const deliver = await getDeliver();
    return deliver;
}

export const getAllDeliverpaginate = async ({ page, limit }: { page: number, limit: number }) => {
    const { skip, take, currentPage } = getPagination(page, limit);

    const deliver = await getDeliverpaginate(skip, take);
    const total = await countDelivery();
    return {
        data: deliver,
        meta: getPagingData(total, currentPage, take)
    };
}

export const getDeliverById = async (id: number) => {
    const deliver = await getDeliveryById(id);
    return deliver;
}

export const postDeliver = async (item: deliverData) => {
    const deliver = await createDeliver(item);
    return deliver;
}

export const putDeliver = async (id: number, item: deliverData) => {
    const deliver = await updateDelivery(id, item);
    return deliver;
}

export const deleteDeliverId = async (id: number) => {
    await deleteDelivery(id);
}

export const getDeliverySummaryService = async () => {
    return await getDeliveryWithSummary();
};