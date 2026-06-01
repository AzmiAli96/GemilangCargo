import { Request, Response } from "express";
import { deletepesananId, getAllpesanan, getpesananById, importpesananFromExcel, postpesanan, putAssignpesananTopengiriman, putpesanan } from "../service/pesananService";
import { FilterHarga } from "../types/pesanan";

export const getpesananController = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search) || "";
    const filterHarga = (req.query.filterHarga as FilterHarga) || "semua";
    const pengirimanId = req.query.pengirimanId;

    const result = await getAllpesanan({ page, limit, search, filterHarga, pengirimanId });
    res.status(200).json({
      message: "Berhasil mendapatkan data pesanan",
      data: result,
      meta: result.meta
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export const getpesananByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const pesanan = await getpesananById(id);
    res.status(200).json(pesanan);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const postpesananController = async (req: Request, res: Response) => {
  try {
    const pesanan = await postpesanan(req.body);
    res.status(201).json({
      message: "pesanan berhasil dibuat",
      data: pesanan
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export const putpesananController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const pesanan = await putpesanan(id, req.body);
    res.status(200).json({
      message: "pesanan berhasil diupdate",
      data: pesanan
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export const deletepesananController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await deletepesananId(id);
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

export const assignpesananToPengirimanController = async (req: Request, res: Response) => {
  try {
    const { pesananIds, pengirimanId } = req.body;

    if (!pesananIds || !pengirimanId) {
      return res.status(400).json({
        message: "pesananIds dan pengirimanId wajib diisi",
      });
    }

    const result = await putAssignpesananTopengiriman(pesananIds, Number(pengirimanId));

    res.status(200).json({
      message: "pengiriman pesanan berhasil diupdate",
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
}




export const importpesananController = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "File tidak ditemukan" });
    }

    const total = await importpesananFromExcel(file.path);

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