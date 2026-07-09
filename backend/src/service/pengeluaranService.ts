import { getPagination, getPagingData } from "../utils/pagination";
import { countPengeluaran, createPengeluaran, deletePengeluaran, pengeluaran, pengeluaranById, pengeluaranPaginate, updatePengeluaran } from "../repository/pengeluaranRepo";
import { pengeluaranData } from "../types/penegeluaran";

export const getPengeluaran = async () => {
    const result = await pengeluaran();
    return result;
}

export const getPengeluaranPaginate = async ({ page, limit, search }: { page: number, limit: number, search: string }) => {
    const { skip, take, currentPage } = getPagination(page, limit);

    const result = await pengeluaranPaginate(skip, take, search);
    const total = await countPengeluaran(search);
    return {
        data: result,
        meta: getPagingData(total, currentPage, take)
    };
}

export const getPengeluaranById = async (id: number) => {
    const result = await pengeluaranById(id);
    return result;
}

export const postPengeluaran = async (item: pengeluaranData) => {
    const result = await createPengeluaran(item);
    return result;
}

export const putPengeluaran = async (id: number, item: pengeluaranData) => {
    const result = await updatePengeluaran(id, item);
    return result;
}

export const deletePengeluaranId = async (id: number) => {
    const result = await deletePengeluaran(id);
    return result;
}