import { Request, Response } from "express";
import { deletePengeluaran } from "../repository/pengeluaranRepo";
import { getPengeluaran, getPengeluaranById, getPengeluaranPaginate, postPengeluaran, putPengeluaran } from "../service/pengeluaranService";

export const getPengeluaranController = async (req: Request, res: Response) => {
    try {
        const result = await getPengeluaran();
        res.status(200).json({ message: "Berhasil mendapatkan data pengeluaran", data: result });
    } catch (error) {
        res.status(500).json({ message: "Gagal mendapatkan data pengeluaran" });
    }
}

export const getPengeluaranPaginateController = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = String(req.query.search) || "";

        const result = await getPengeluaranPaginate({ page, limit, search });
        res.status(200).json({
            message: "Berhasil mendapatkan data pengeluaran",
            data: result,
            meta: result.meta
        });
    } catch (error: any) {
        res.status(500).json({ message: "Gagal mendapatkan data pengeluaran", error: error.message });
    }
};

export const getPengeluaranByIdController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await getPengeluaranById(id);
        res.status(200).json({ message: "Berhasil mendapatkan data pengeluaran", data: result });
    } catch (error: any) {
        res.status(500).json({ message: "Gagal mendapatkan data pengeluaran", error: error.message });
    }
}

export const postPengeluaranController = async (req: Request, res: Response) => {
    try {
        const result = await postPengeluaran(req.body);
        res.status(201).json({
            message: "Berhasil menambahkan data pengeluaran",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({ message: "Gagal menambahkan data pengeluaran", error: error.message });
    }
}

export const putPengeluaranController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await putPengeluaran(id, req.body);
        res.status(200).json({
            message: "Berhasil mengupdate data pengeluaran",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ message: "Gagal mengupdate data pengeluaran", error: error.message });
    }
}

export const deletePengeluaranController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await deletePengeluaran(id);
        res.status(200).json({
            message: "Berhasil menghapus data pengeluaran",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ message: "Gagal menghapus data pengeluaran", error: error.message });
    }
}