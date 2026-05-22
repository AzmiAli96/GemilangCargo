import { formatPhoneNumber } from "../utils/formatWa";
import prisma from "../db/prisma";
import { countStatus, createStatus, deleteStatus, getStatus, getStatusPaginate, StatusById, updateStatus } from "../repository/deliverStatusRepo";
import { statusData } from "../types/deliveryStatus";
import { sendWhatsApp } from "./whatsappService";
import { getPagination, getPagingData } from "../utils/pagination";

export const getAllStatus = async () => {
    const status = await getStatus();
    return status;
}

export const getAllStatusPaginate = async ({ page, limit }: { page: number, limit: number }) => {
    const { skip, take, currentPage } = getPagination(page, limit);

    const status = await getStatusPaginate(skip, take);

    const dataWithStatus = status.map((s: any) => {
        const orders = s.deliver?.order || [];

        let deliveryStatus = "Belum Lunas";

        if (orders.length > 0) {
            const allLunas = orders.every((o: any) => o.status === "Lunas");
            deliveryStatus = allLunas ? "Lunas" : "Belum Lunas";
        }

        return {
            ...s,
            calculatedStatus: deliveryStatus
        };
    });

    const total = await countStatus();
    return {
        data: dataWithStatus,
        meta: getPagingData(total, currentPage, take)
    };
}

export const getStatusById = async (id: number) => {
    const status = await StatusById(id);
    return status;
}

export const postStatus = async (item: statusData) => {
    const status = await createStatus(item);
    return status;
}

export const deleteStatusId = async (id: number) => {
    await deleteStatus(id);
}


// export const dataWithStatus = async (deliveryId: number | null) => {
//     if (!deliveryId) {
//         return "Belum Lunas";
//     }

//     const orders = await prisma.order.findMany({
//         where: { deliveryId },
//         select: { status: true }
//     });

//     if (orders.length === 0) {
//         return "Belum Lunas";
//     }

//     const allLunas = orders.every(o => o.status === "Lunas");

//     return allLunas ? "Lunas" : "Belum Lunas";
// };







export const putStatus = async (id: number, item: statusData) => {
    const status = await updateStatus(id, item);

    const allowedStatus = ["DALAM PERJALANAN", "SELESAI"];

    if (!allowedStatus.includes(item.statusPengiriman)) {
        return status;
    }

    const orders = await prisma.order.findMany({
        where: {
            deliveryId: item.deliverId
        },
        include: {
            user: true
        }
    });

    console.log("ORDERS:", orders);

    const userMap = new Map<string, any[]>();

    for (const order of orders) {
        const rawPhone = order.user?.noTelp;

        if (!rawPhone) continue;

        const phone = formatPhoneNumber(rawPhone);

        if (!phone) continue;

        if (!userMap.has(phone)) {
            userMap.set(phone, []);
        }

        userMap.get(phone)?.push(order);
    }

    console.log("VALID NUMBERS:", Array.from(userMap));

    const deliver = await prisma.deliver.findUnique({
        where: {
            id: item.deliverId
        }
    });

    const tanggal = deliver?.tanggalJalan
        ? new Date(deliver.tanggalJalan).toLocaleDateString("id-ID")
        : "-";

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(Number(angka));
    };

    for (const [phone, userOrders] of userMap.entries()) {
        try {

            let detailPesanan = "";

            userOrders.forEach((order: any, index: number) => {
                detailPesanan += `
📦 Pesanan ${index + 1}
No SPB: ${order.noSpb}
Koli: ${order.koli}
Berat: ${order.berat}
Total: ${formatRupiah(order.total)}
----------------------`;
            });

            const message = `Halo pelanggan 👋

Pesanan Anda sedang:
🚚 Status: ${item.statusPengiriman}
📅 Tanggal Jalan: ${tanggal}

Detail Pesanan:
${detailPesanan}

Terima kasih 🙏`;

            console.log("KIRIM KE:", phone);

            await sendWhatsApp(phone, message);

            await new Promise(res => setTimeout(res, 300));

        } catch (err) {
            console.error("Gagal kirim ke:", phone, err);
        }
    }

    return status;
};