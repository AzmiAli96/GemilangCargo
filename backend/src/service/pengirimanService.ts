import { pengirimanData } from "../types/pengiriman";
import { countpengiriman, createpengiriman, deletepengiriman, getpengiriman, getpengirimanpaginate, updatepengiriman, pengirimanById } from "../repository/pengirimanRepo"
import { getPagination, getPagingData } from "../utils/pagination";

export const getAllpengiriman = async () => {
    const pengiriman = await getpengiriman();
    return pengiriman;
}

export const getAllpengirimanpaginate = async ({ page, limit }: { page: number, limit: number }) => {
    const { skip, take, currentPage } = getPagination(page, limit);

    const pengiriman = await getpengirimanpaginate(skip, take);
    const total = await countpengiriman();
    return {
        data: pengiriman,
        meta: getPagingData(total, currentPage, take)
    };
}

export const getpengirimanById = async (id: number) => {
    const pengiriman = await pengirimanById(id);
    return pengiriman;
}

export const postpengiriman = async (item: pengirimanData) => {
    const pengiriman = await createpengiriman(item);
    return pengiriman;
}

export const putpengiriman = async (id: number, item: pengirimanData) => {
    const pengiriman = await updatepengiriman(id, item);
    return pengiriman;
}

export const deletepengirimanId = async (id: number) => {
    await deletepengiriman(id);
}

// export const getpengirimanSummaryService = async () => {
//     return await getpengirimanWithSummary();
// };