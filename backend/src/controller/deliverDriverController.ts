import { Request, Response } from "express";
import { deleteDriverId, getAllDriver, getAllDriverPaginate, postDriver } from "../service/deliverDriverService";

export const getDriverController = async (req: Request, res: Response) => {
    try {
        const driver = await getAllDriver();
        res.status(200).json(driver);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getDeliveryPaginateController = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = String(req.query.search) || "";

        const result = await getAllDriverPaginate({ page, limit, search });
        res.status(200).json({
            message: "Berhasil mendapatkan data price",
            data: result,
            meta: result.meta
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const postDriverController = async (req: Request, res: Response) => {
    try {
        const driver = await postDriver(req.body);
        res.status(201).json(driver);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export const putDriverController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await postDriver(req.body);

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

export const deleteDriverController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await deleteDriverId(id);
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