import { getPagination, getPagingData } from "../utils/pagination";
import { AllHarga, countHarga, createHarga, deleteHarga, getHarga, updateHarga } from "../repository/hargaRepo";
import { hargaData } from "../types/harga";

export const getALLHargas = async () =>{
    const harga = await AllHarga();
    return harga
}

export const getAllHarga = async ({ page, limit, search }: { page: number, limit: number, search: string }) => {
    const { skip, take, currentPage } = getPagination(page, limit);

    const hargas = await getHarga(skip, take, search);
    const total = await countHarga(search);
    return {
        data: hargas,
        meta: getPagingData(total, currentPage, take)
    };
}

export const postHarga = async (item: hargaData) => {
    const harga = await createHarga(item);
    return harga;
}

export const putHarga = async (id: number, item: hargaData) => {
    const harga = await updateHarga(id, item);
    return harga;
}

export const deleteHargaId = async (id: number) => {
    const harga = await deleteHarga(id);
    return harga;
}