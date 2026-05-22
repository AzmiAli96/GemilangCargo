import { Request, Response } from "express";
import { deleteStatusId, getAllStatus, getAllStatusPaginate, getStatusById, postStatus, putStatus } from "../service/deliverStatuService";
import { stat } from "node:fs";

export const getStatusController = async (req: Request, res: Response) => {
    try {
        const status = await getAllStatus();
        res.status(200).json(status);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getStatusPaginateController = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const status = await getAllStatusPaginate({ page, limit });
        res.status(200).json({
            message: "Berhasil mendapatkan data price",
            data: status,
            meta: status.meta
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
export const getStatusByIdController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const status = await getStatusById(id);
        res.status(200).json(status);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const postStatusController = async (req: Request, res: Response) => {
    try {
        const status = await postStatus(req.body);
        res.status(201).json(status);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export const deleteStatusController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const status = await deleteStatusId(id);
        res.status(200).json({ 
            message: "Status berhasil dihapus" 
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const putStatusController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const status = await putStatus(id, req.body);
    res.status(200).json({
      message: "Status berhasil diupdate",
      data: status
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}