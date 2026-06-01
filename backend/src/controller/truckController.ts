import { Request, Response } from "express";
import { deleteTruckId, getTruck, getTruckById, getTruckPaginate, postTruck, putTruck } from "../service/truckService";

export const getTruckController = async (req: Request, res: Response) => {
    try {
        const truck = await getTruck();
        res.status(200).json(truck);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getTruckPaginateController = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const truck = await getTruckPaginate({ page, limit });
        res.status(200).json({
            message: "Berhasil mendapatkan data price",
            data: truck,
            meta: truck.meta
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getTrucksByIdController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const truck = await getTruckById(id);
        res.status(200).json(truck);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const postTruckController = async (req: Request, res: Response) => {
    try {
        const truck = await postTruck(req.body);
        res.status(201).json(truck);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export const putTruckController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const truck = await putTruck(id, req.body);
    res.status(200).json({
      message: "Truck berhasil diupdate",
      data: truck
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export const deleteTruckController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteTruckId(id);
    res.status(200).json({
      message: "Truck berhasil dihapus",
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
}