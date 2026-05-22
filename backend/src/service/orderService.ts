import { FilterHarga, orderData } from "../types/order";
import { assignOrderToDelivery, countOrder, createOrder, deleteOrder, getOrder, OrderById, updateOrder } from "../repository/orderRepo";
import { hitungPrioritas } from "../utils/kmeans";
import { readExcel } from "../utils/excel";
import { prisma } from "../db/prisma";
import { getPriceById } from "../repository/priceRepo";
import { getPagination, getPagingData } from "../utils/pagination";

export const getAllOrder = async ({ 
    page, 
    limit, 
    search, 
    filterHarga = "semua",
    deliveryId, }: { 
        page: number, 
        limit: number, 
        search: string, 
        filterHarga: FilterHarga,
        deliveryId?: any,
    }) => {
    const { skip, take, currentPage } = getPagination(page, limit);

    const orders = await getOrder(skip, take, search, filterHarga, deliveryId);
    const total = await countOrder(search, filterHarga, deliveryId);
    return {
        data: orders,
        meta: getPagingData(total, currentPage, take)
    };
}

export const getOrderById = async (id: number) => {
    const order = await OrderById(id);
    return order;
}

export const postOrder = async (item: orderData) => {
    const prioritas = hitungPrioritas({
        berat: item.berat,
        koli: item.koli,
    });

    let total = 0;

    if (item.hargaCustom && item.hargaCustom > 0) {
        total = item.berat * item.hargaCustom;
    } else {
        if (!item.priceId) {
            throw new Error("Price ID harus diisi jika harga custom tidak disediakan");
        }

        const price = await getPriceById(item.priceId);

        if (!price) {
            throw new Error("Price tidak ditemukan");
        }

        total = item.berat * Number(price.hargaTarif);

    }

    const order = await createOrder({
        ...item,
        prioritas,
        total,
    });

    return order;
}

export const putOrder = async (id: number, item: orderData) => {
    const order = await updateOrder(id, item);
    return order;
}

export const deleteOrderId = async (id: number) => {
    const order = await deleteOrder(id);
    return order
}

export const putAssignOrderToDelivery = async (orderIds: number[], deliveryId: number) => {
    return await assignOrderToDelivery(orderIds, deliveryId);
}









const parseKoli = (val: any) => {
    if (typeof val === "string" && val.includes("/")) {
        return parseFloat(val.split("/")[0]);
    }
    return parseFloat(val);
};

export const importOrderFromExcel = async (filePath: string) => {
    const data: any[] = readExcel(filePath);

    const orders = data.map((row) => {
        const berat = parseFloat(row["KG"]);
        const koli = parseKoli(row["Koli"]);

        // 🔥 HITUNG PRIORITAS DI SINI
        const prioritas = hitungPrioritas({
            berat,
            koli
        });

        return {
            userId: 2,
            noSpb: "IMPORT-" + Date.now(),
            alamaTujuan: "Import Excel",

            berat,
            koli,
            hargaCustom: parseFloat(row["Harga"]),
            total: parseFloat(row["Total"]),
            createdAt: new Date(row["Tanggal"]),

            prioritas, // ✅ langsung isi
        };
    });

    await prisma.order.createMany({
        data: orders,
    });

    return orders.length;
};