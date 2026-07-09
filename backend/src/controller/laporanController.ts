import { Request, Response } from "express";
import { exportLaporanBulanan, getLaporanBulanan, getLaporanPaginate, getLaporanRingkasanSemua } from "../service/laporanService";

export const getLaporanBulananController = async (req: Request, res: Response) => {
    try {
        const bulan = Number(req.query.bulan);
        const tahun = Number(req.query.tahun);

        if (!bulan || !tahun) {
            return res.status(400).json({
                message: "bulan dan tahun wajib diisi"
            });
        }

        const result = await getLaporanBulanan(bulan, tahun);

        return res.json({
            message: "Laporan berhasil diambil",
            data: result
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Gagal mengambil laporan",
            error: error.message
        });
    }
};

export const exportLaporanBulananController = async (req: Request, res: Response) => {
    try {
        const bulan = Number(req.query.bulan);
        const tahun = Number(req.query.tahun);

        console.log("bulan:", bulan);
        console.log("tahun:", tahun);

        const workbook = await exportLaporanBulanan(
            bulan,
            tahun
        );

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Laporan.xlsx`
        );

        await workbook.xlsx.write(res);

        res.end();

    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

export const getLaporanPaginateController = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = String(req.query.search) || "";

        const result = await getLaporanPaginate({ page, limit, search });
        res.status(200).json({
            message: "Berhasil mendapatkan data Laporan",
            data: result,
            meta: result.meta
        });
    } catch (error: any) {
        res.status(500).json({ message: "Gagal mendapatkan data Laporan", error: error.message });
    }
};

export const getLaporanRingkasanBulananController = async (req: Request, res: Response) => {
    try {
        const bulan = req.query.bulan ? Number(req.query.bulan) : undefined;
        const tahun = req.query.tahun ? Number(req.query.tahun) : undefined;

        const result = await getLaporanRingkasanSemua(bulan, tahun);

        return res.json({
            message: "Ringkasan laporan berhasil diambil",
            data: result
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Gagal mengambil ringkasan laporan",
            error: error.message
        });
    }
};