import { generateLaporanExcel } from "../utils/excel";
import { countlaporan, getRingkasanBulanan, getSemuaPengeluaranRingkas, getSemuaPengirimanRingkas, laporanBulanan, laporanPaginate } from "../repository/laporanRepo";
import { getPagination, getPagingData } from "../utils/pagination";

type RingkasanPeriode = {
    bulan: number;
    tahun: number;
    totalPendapatan: number;
    totalBb: number;
    totalPengeluaran: number;
    totalLaba: number;
};

const periodKey = (bulan: number, tahun: number) => `${tahun}-${bulan}`;

export const getLaporanBulanan = async (bulan: number, tahun: number) => {
    const data = await laporanBulanan(bulan, tahun);
    const laporan = data.pengiriman.map((item) => {
        const totalPengeluaran = item.pengeluaran.reduce(
            (sum, p) => sum + Number(p.nominal),
            0
        );

        return {
            ...item,
            totalPengeluaran,
        };
    });
    return {
        laporan,
        semuaPengeluaran: data.semuaPengeluaran
    };;
};

export const exportLaporanBulanan = async (bulan: number, tahun: number) => {
    const result = await getLaporanBulanan(bulan, tahun);
    const workbook = await generateLaporanExcel(result.laporan, bulan, tahun, result.semuaPengeluaran);
    return workbook;
};

export const getLaporanPaginate = async ({ page, limit, search, bulan, tahun }: { page: number, limit: number, search: string, bulan?: number, tahun?: number }) => {
    const { skip, take, currentPage } = getPagination(page, limit);

    const result = await laporanPaginate(skip, take, search);
    const total = await countlaporan(search);

    const ringkasan = bulan && tahun
        ? await getRingkasanBulanan(bulan, tahun)
        : null;
    return {
        data: result,
        meta: getPagingData(total, currentPage, take)
    };
}

export const getLaporanRingkasanSemua = async (
    bulan?: number,
    tahun?: number
): Promise<RingkasanPeriode[]> => {
    const pengiriman = await getSemuaPengirimanRingkas();
    const pengeluaran = await getSemuaPengeluaranRingkas();

    const map = new Map<string, RingkasanPeriode>();

    const getOrCreate = (bulanItem: number, tahunItem: number) => {
        const key = periodKey(bulanItem, tahunItem);
        if (!map.has(key)) {
            map.set(key, {
                bulan: bulanItem,
                tahun: tahunItem,
                totalPendapatan: 0,
                totalBb: 0,
                totalPengeluaran: 0,
                totalLaba: 0
            });
        }
        return map.get(key)!;
    };

    for (const p of pengiriman) {
        const tgl = new Date(p.tanggalJalan);
        const bulanItem = tgl.getMonth() + 1;
        const tahunItem = tgl.getFullYear();

        const entry = getOrCreate(bulanItem, tahunItem);
        entry.totalPendapatan += Number(p.totalHarga);
        entry.totalBb += Number(p.bb);
    }

    for (const p of pengeluaran) {
        const tgl = new Date(p.createdAt);
        const bulanItem = tgl.getMonth() + 1;
        const tahunItem = tgl.getFullYear();

        const entry = getOrCreate(bulanItem, tahunItem);
        entry.totalPengeluaran += Number(p.nominal);
    }

    for (const entry of map.values()) {
        // sesuai instruksi sebelumnya: pendapatan - bb + pengeluaran
        entry.totalLaba = entry.totalPendapatan - entry.totalBb + entry.totalPengeluaran;
    }

    let hasil = Array.from(map.values());

    // kalau bulan & tahun dikirim, filter ke periode itu saja
    if (bulan && tahun) {
        hasil = hasil.filter(r => r.bulan === bulan && r.tahun === tahun);
    }

    // urutkan dari terbaru
    hasil.sort((a, b) => {
        if (a.tahun !== b.tahun) return b.tahun - a.tahun;
        return b.bulan - a.bulan;
    });

    return hasil;
};