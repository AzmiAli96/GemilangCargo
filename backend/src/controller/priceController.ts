import { Request, Response } from "express";
import { deletePriceId, getAllPrice, getALLprices, postPrice, putPrice } from "../service/priceService";

export const getAllPriceController = async (req: Request, res: Response) => {
  try {
    const result = await getALLprices();
    res.status(200).json({ message: "Get roles successful", data: result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const getPriceController = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search) || "";

    const prices = await getAllPrice({ page, limit, search });
    res.status(200).json({
      message: "Berhasil mendapatkan data price",
      data: prices,
      meta: prices.meta
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const postPriceController = async (req: Request, res: Response) => {
  try {
    const result = await postPrice(req.body);
    res.status(201).json({
      message: "Price berhasil dibuat",
      data: result
    })
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
}

export const putPriceController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await putPrice(id, req.body);

    res.status(201).json({
      message: "Price berhasil diupdate",
      data: result
    })
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
}

export const deletePriceController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await deletePriceId(id);
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