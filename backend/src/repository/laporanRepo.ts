import prisma from "../db/prisma"

export const laporanBulanan = async (bulan: number, tahun: number) => {
    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 1);

    const pengiriman = await prisma.pengiriman.findMany({
        where: {
            tanggalJalan: {
                gte: startDate,
                lt: endDate
            }
        },
        include: {
            truck: true,
            sopir: true,
            pesanan: {
                include: {
                    user: true,
                    harga: true
                }
            },
            pengeluaran: true
        }
    });

    const pengeluaran = await prisma.pengeluaran.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lt: endDate
            }
        },
        include: {
            pengiriman: { include: { truck: true } }
        }
    });

    return {
        pengiriman,
        semuaPengeluaran: pengeluaran
    };
};

export const laporanPaginate = async (skip: number, take: number, search: string) => {
    const where = search ? {
        OR: [
            { name: { contains: search, mode: "insensitive" as const } },
        ]
    } : {};
    return await prisma.pengiriman.findMany({
        skip, take, where,
    })
}

export const countlaporan = async (search: string) => {
    const where = search ? {
        OR: [
            { name: { contains: search, mode: "insensitive" as const } },
        ]
    } : {};
    return await prisma.pengiriman.count({ where });
}

export const getRingkasanBulanan = async (bulan: number, tahun: number) => {
    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 1);

    const pengiriman = await prisma.pengiriman.findMany({
        where: {
            tanggalJalan: {
                gte: startDate,
                lt: endDate
            }
        },
        select: {
            totalHarga: true,
            bb: true
        }
    });

    const pengeluaran = await prisma.pengeluaran.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lt: endDate
            }
        },
        select: {
            nominal: true
        }
    });

    return { pengiriman, pengeluaran };
};

export const getSemuaPengirimanRingkas = async () => {
    return prisma.pengiriman.findMany({
        select: {
            tanggalJalan: true,
            totalHarga: true,
            bb: true
        }
    });
};

export const getSemuaPengeluaranRingkas = async () => {
    return prisma.pengeluaran.findMany({
        select: {
            createdAt: true,
            nominal: true
        }
    });
};