import { Request, Response } from "express";
import { deleteHargaId, getAllHarga, getALLHargas, postHarga, putHarga } from "../service/hargaService";

export const getAllHargaController = async (req: Request, res: Response) => {
  try {
    const result = await getALLHargas();
    res.status(200).json({ message: "Get roles successful", data: result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const getHargaController = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search) || "";

    const hargas = await getAllHarga({ page, limit, search });
    res.status(200).json({
      message: "Berhasil mendapatkan data harga",
      data: hargas,
      meta: hargas.meta
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const postHargaController = async (req: Request, res: Response) => {
  try {
    const result = await postHarga(req.body);
    res.status(201).json({
      message: "harga berhasil dibuat",
      data: result
    })
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
}

export const putHargaController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await putHarga(id, req.body);

    res.status(201).json({
      message: "harga berhasil diupdate",
      data: result
    })
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
}

export const deleteHargaController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteHargaId(id);
    res.status(200).json({
      message: "harga berhasil dihapus",
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
}