import { Request, Response } from "express";
import { deleteDeliverId, getAllDeliver, getAllDeliverpaginate, getDeliverById, getDeliverySummaryService, postDeliver, putDeliver } from "../service/deliverService";

export const getDeliveryController = async (req: Request, res: Response) => {
    try {
        const deliver = await getAllDeliver();
        res.status(200).json(deliver);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getDeliverypaginateController = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const deliver = await getAllDeliverpaginate({ page, limit });
        res.status(200).json({
            message: "Berhasil mendapatkan data price",
            data: deliver,
            meta: deliver.meta
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getDeliveryByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deliver = await getDeliverById(id);
    res.status(200).json(deliver);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}
export const postDeliveryController = async (req: Request, res: Response) => {
    try {
        const result = await postDeliver(req.body);
        res.status(201).json({
            message: "Delivery berhasil dibuat",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export const putDeliveryController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await putDeliver(id, req.body);

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

export const deleteDeliveryController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteDeliverId(id);
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

export const getDeliverySummaryController = async (req: Request, res: Response) => {
    try {
        const data = await getDeliverySummaryService();

        res.status(200).json({
            message: "Berhasil ambil delivery summary",
            data
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};