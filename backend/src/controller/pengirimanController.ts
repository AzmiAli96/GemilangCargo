import { Request, Response } from "express";
import { deletepengirimanId, getAllpengiriman, getAllpengirimanpaginate, getpengirimanById, postpengiriman, putpengiriman } from "../service/pengirimanService";

export const getpengirimanController = async (req: Request, res: Response) => {
    try {
        const pengiriman = await getAllpengiriman();
        res.status(200).json(pengiriman);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getpengirimanpaginateController = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const pengiriman = await getAllpengirimanpaginate({ page, limit });
        res.status(200).json({
            message: "Berhasil mendapatkan data price",
            data: pengiriman,
            meta: pengiriman.meta
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getpengirimanByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const pengiriman = await getpengirimanById(id);
    res.status(200).json(pengiriman);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}
export const postpengirimanController = async (req: Request, res: Response) => {
    try {
        const result = await postpengiriman(req.body);
        res.status(201).json({
            message: "pengiriman berhasil dibuat",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export const putpengirimanController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await putpengiriman(id, req.body);

    res.status(201).json({
      message: "pengiriman berhasil diupdate",
      data: result
    })
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
}

export const deletepengirimanController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await deletepengirimanId(id);
    res.status(200).json({
      message: "pengiriman berhasil dihapus",
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
}

// export const getpengirimanSummaryController = async (req: Request, res: Response) => {
//     try {
//         const data = await getpengirimanSummaryService();

//         res.status(200).json({
//             message: "Berhasil ambil pengiriman summary",
//             data
//         });
//     } catch (error: any) {
//         res.status(500).json({
//             message: error.message
//         });
//     }
// };