import { pengirimanData } from "../types/pengiriman";
import prisma from "../db/prisma";

export const getpengiriman = async () => {
    const pengiriman = await prisma.pengiriman.findMany();
    return pengiriman;
}

export const getpengirimanpaginate = async (skip: number, take: number) => {
    const pengiriman = await prisma.pengiriman.findMany({
        skip, take, orderBy: {
            id: "desc"
        }
    });
    return pengiriman;
}

export const countpengiriman = async () => {
    return await prisma.pengiriman.count();
}

export const createpengiriman = async (item: pengirimanData) => {
    const pengiriman = await prisma.pengiriman.create({
        data: {
            name: item.name,
            truckId: item.truckId,
            sopirId: item.sopirId,
            totalHarga: item.totalHarga,
            totalBerat: item.totalBerat,
            tanggalJalan: item.tanggalJalan,
            statusPengiriman: item.statusPengiriman,
        }
    });
    return pengiriman;
};

export const pengirimanById = async (id: number) => {
    return await prisma.pengiriman.findUnique({
        where: { id }
    });
};

export const updatepengiriman = async (id: number, item: pengirimanData) => {
    const pengiriman = await prisma.pengiriman.update({
        where: { id: id },
        data: {
            name: item.name,
            truckId: item.truckId,
            sopirId: item.sopirId,
            totalHarga: item.totalHarga,
            totalBerat: item.totalBerat,
            tanggalJalan: item.tanggalJalan,
            statusPengiriman: item.statusPengiriman,
        },
    });
    return pengiriman
}

export const deletepengiriman = async (id: number) => {
    await prisma.pengiriman.delete({
        where: { id }
    });
}

// export const getpengirimanWithSummary = async () => {
//     const pengirimanies = await prisma.pengiriman.findMany();

//     const totals = await prisma.pesanan.groupBy({
//         by: ["pengirimanId"],
//         _sum: { total: true },
//     });

//     return pengirimanies.map((d) => {
//         const found = totals.find(t => t.pengirimanId === d.id);

//         return {
//             ...d,
//             totalOrder: found?._sum.total || 0,
//             profit: Number(found?._sum.total || 0) - Number(d.bb),
//         };
//     });
// };