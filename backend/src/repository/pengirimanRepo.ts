import { pengirimanData } from "../types/pengiriman";
import prisma from "../db/prisma";
import { pesananData } from "src/types/pesanan";

export const getpengiriman = async () => {
    const pengiriman = await prisma.pengiriman.findMany();
    return pengiriman;
}

export const getpengirimanPesanan = async (pengirimanId: number) => {
    const pesanan = await prisma.pesanan.findMany({
        where: { pengirimanId },
        include: { user: true }
    });
    return pesanan
}

export const getpengirimanpaginate = async (skip: number, take: number) => {
    const pengiriman = await prisma.pengiriman.findMany({
        skip, take, orderBy: {
            id: "desc"
        }, include: {
            truck: true,
            sopir: { include: { role: true, }, },
        }
    });
    return pengiriman;
}

export const countpengiriman = async () => {
    return await prisma.pengiriman.count();
}

export const pengirimanById = async (id: number) => {
    return await prisma.pengiriman.findUnique({
        where: { id }, include: {
            truck: true,
        }
    });
};



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


// Pembuatan algoritma greedy

export const createpengiriman = async (item: pengirimanData) => {
    const pengiriman = await prisma.pengiriman.create({
        data: {
            name: item.name,
            truckId: item.truckId,
            totalHarga: item.totalHarga,
            totalBerat: item.totalBerat,
            tanggalJalan: item.tanggalJalan,
            statusPengiriman: item.statusPengiriman,
        }
    });
    return pengiriman;
};

export const updatepengiriman = async (id: number, item: pengirimanData) => {
    const pengiriman = await prisma.pengiriman.update({
        where: { id: id },
        data: {
            name: item.name,
            truckId: item.truckId,
            totalHarga: item.totalHarga,
            totalBerat: item.totalBerat,
            tanggalJalan: item.tanggalJalan,
            statusPengiriman: item.statusPengiriman,
            ...(item.sopirIds && {
                sopir: {
                    set: item.sopirIds.map(
                        (id) => ({ id, })
                    ),
                }
            }),
        },
    });
    return pengiriman
}

export const createPengirimanGenerate = async (
    truckId: number,
    totalBerat: number,
    totalHarga: number,
    statusPengiriman: string
) => {
    return prisma.pengiriman.create({
        data: {
            truckId,
            tanggalJalan: new Date(),
            totalBerat,
            totalHarga,
            statusPengiriman
        }
    });
};

export const updatePengirimanGenerate = async (
    id: number,
    totalBerat: number,
    totalHarga: number,
    statusPengiriman: string
) => {
    return prisma.pengiriman.update({
        where: { id },
        data: {
            totalBerat,
            totalHarga,
            statusPengiriman
        }
    });
};

export const getTruckAktif = async () => {
    return await prisma.truck.findMany({
        where: {
            status: "BARANG MASUK"
        }
    });
};

export const getPesananPending = async () => {
    return await prisma.pesanan.findMany({
        where: {
            pengirimanId: null
        }
    });
};

export const updatePesananPengiriman = async (
    pesananId: number,
    pengirimanId: number
) => {
    return await prisma.pesanan.update({
        where: {
            id: pesananId
        },
        data: {
            pengirimanId
        }
    });
};

export const getTruckGenerate = async () => {
    return prisma.truck.findMany({
        where: {
            status: {
                in: ["PENDING", "BARANG MASUK"]
            }
        },
        include: {
            pengiriman: {
                include: {
                    pesanan: true
                }
            }
        }
    });
};

export const updateTruckStatus = async (id: number, status: string) => {
    return prisma.truck.update({
        where: { id },
        data: { status }
    });
};