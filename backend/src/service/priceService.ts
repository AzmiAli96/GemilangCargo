import { getPagination, getPagingData } from "../utils/pagination";
import { AllPrice, countPrice, createPrice, deletePrice, getPrice, updatePrice } from "../repository/priceRepo";
import { priceData } from "../types/price";

export const getALLprices = async () =>{
    const price = await AllPrice();
    return price
}

export const getAllPrice = async ({ page, limit, search }: { page: number, limit: number, search: string }) => {
    const { skip, take, currentPage } = getPagination(page, limit);

    const prices = await getPrice(skip, take, search);
    const total = await countPrice(search);
    return {
        data: prices,
        meta: getPagingData(total, currentPage, take)
    };
}

export const postPrice = async (item: priceData) => {
    const price = await createPrice(item);
    return price;
}

export const putPrice = async (id: number, item: priceData) => {
    const price = await updatePrice(id, item);
    return price;
}

export const deletePriceId = async (id: number) => {
    const price = await deletePrice(id);
    return price;
}