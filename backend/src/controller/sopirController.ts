import { Request, Response } from "express";
import { deleteSopirId, getAllSopir, getAllSopirPaginate, postSopir, putSopir } from "../service/sopirService";

export const getSopirController = async (req: Request, res: Response) => {
    try {
        const sopir = await getAllSopir();
        res.status(200).json(sopir);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getDeliveryPaginateController = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = String(req.query.search) || "";

        const result = await getAllSopirPaginate({ page, limit, search });
        res.status(200).json({
            message: "Berhasil mendapatkan data price",
            data: result,
            meta: result.meta
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const postSopirController = async (req: Request, res: Response) => {
    try {
        const sopir = await postSopir(req.body);
        res.status(201).json(sopir);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export const putSopirController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await putSopir(id, req.body);

        res.status(201).json({
            message: "Delivery berhasil diupdate",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
}

export const deleteSopirController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await deleteSopirId(id);
        res.status(200).json({
            message: "Delivery berhasil dihapus",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
}