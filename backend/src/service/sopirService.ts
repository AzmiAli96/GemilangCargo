import { sopirData } from "../types/sopir";
import { countSopir, createSopir, deleteSopir, getsopir, getSopirPaginate, updateSopir } from "../repository/sopirRepo"
import { getPagination, getPagingData } from "../utils/pagination";

export const getAllSopir = async () => {
    const sopir = await getsopir();
    return sopir;
}

export const getAllSopirPaginate = async ({ page, limit, search }: { page: number, limit: number, search: string }) => {
    const { skip, take, currentPage } = getPagination(page, limit);

    const sopir = await getSopirPaginate(skip, take, search);
    const total = await countSopir(search);
    return {
        data: sopir,
        meta: getPagingData(total, currentPage, take)
    };
}

export const postSopir = async (item: sopirData) => {
    const sopir = await createSopir(item);
    return sopir;
}

export const putSopir = async (id: number, item: sopirData) => {
    const sopir = await updateSopir(id, item);
    return sopir;
}

export const deleteSopirId = async (id: number ) => {
    await deleteSopir(id);
}
