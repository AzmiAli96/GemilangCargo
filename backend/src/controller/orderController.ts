import { Request, Response } from "express";
import { deleteOrderId, getAllOrder, getOrderById, importOrderFromExcel, postOrder, putAssignOrderToDelivery, putOrder } from "../service/orderService";
import { FilterHarga } from "../types/order";

export const getOrderController = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search) || "";
    const filterHarga = (req.query.filterHarga as FilterHarga) || "semua";
    const deliveryId = req.query.deliveryId;

    const result = await getAllOrder({ page, limit, search, filterHarga, deliveryId });
    res.status(200).json({
      message: "Berhasil mendapatkan data order",
      data: result,
      meta: result.meta
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const order = await getOrderById(id);
    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const postOrderController = async (req: Request, res: Response) => {
  try {
    const order = await postOrder(req.body);
    res.status(201).json({
      message: "Order berhasil dibuat",
      data: order
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export const putOrderController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const order = await putOrder(id, req.body);
    res.status(200).json({
      message: "Order berhasil diupdate",
      data: order
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export const deleteOrderController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteOrderId(id);
    res.status(200).json({
      message: "Price berhasil dihapus",
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
}

export const assignOrderToDeliveryController = async (req: Request, res: Response) => {
  try {
    const { orderIds, deliveryId } = req.body;

    if (!orderIds || !deliveryId) {
      return res.status(400).json({
        message: "orderIds dan deliveryId wajib diisi",
      });
    }

    const result = await putAssignOrderToDelivery(orderIds, Number(deliveryId));

    res.status(200).json({
      message: "Delivery Order berhasil diupdate",
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
}




export const importOrderController = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "File tidak ditemukan" });
    }

    const total = await importOrderFromExcel(file.path);

    res.status(200).json({
      message: "Import berhasil",
      totalData: total,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};