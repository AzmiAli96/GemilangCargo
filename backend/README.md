jika disuruh memakai retrain Langkahnya
Order (DB) → Retrain → Hitung K-Means → Simpan Centroid → Dipakai saat create order

STEP 1 — Buat tabel cluster di Prisma
model Cluster {
  id        Int     @id @default(autoincrement())
  centroidBerat Float
  centroidKoli  Float
  label     String
  createdAt DateTime @default(now())
}

STEP 2 — Buat repository cluster
import prisma from "../db/prisma";

export const saveClusters = async (clusters: any[]) => {
  // hapus lama
  await prisma.cluster.deleteMany();

  // simpan baru
  return await prisma.cluster.createMany({
    data: clusters
  });
};

export const getClusters = async () => {
  return await prisma.cluster.findMany();
};

STEP 3 — Buat fungsi K-Means di Node.js
📁 utils/kmeans.ts
type Data = {
  berat: number;
  koli: number;
};

const euclideanDistance = (a: Data, b: Data) => {
  return Math.sqrt(
    Math.pow(a.berat - b.berat, 2) +
    Math.pow(a.koli - b.koli, 2)
  );
};

export const kmeans = (data: Data[], k: number = 3) => {
  // ambil centroid awal (random)
  let centroids = data.slice(0, k);

  let clusters: number[] = new Array(data.length);

  for (let iter = 0; iter < 10; iter++) {
    // assign cluster
    for (let i = 0; i < data.length; i++) {
      let distances = centroids.map(c => euclideanDistance(data[i], c));
      clusters[i] = distances.indexOf(Math.min(...distances));
    }

    // update centroid
    centroids = centroids.map((_, i) => {
      const points = data.filter((_, idx) => clusters[idx] === i);

      const avgBerat = points.reduce((sum, p) => sum + p.berat, 0) / points.length || 0;
      const avgKoli = points.reduce((sum, p) => sum + p.koli, 0) / points.length || 0;

      return { berat: avgBerat, koli: avgKoli };
    });
  }

  return centroids;
};

STEP 4 — Service retrain
import { kmeans } from "../utils/kmeans";
import { saveClusters } from "../repository/clusterRepo";
import prisma from "../db/prisma";

export const retrainCluster = async () => {
  // ambil data dari order
  const orders = await prisma.order.findMany({
    select: {
      berat: true,
      koli: true
    }
  });

  if (orders.length < 3) {
    throw new Error("Data tidak cukup untuk clustering");
  }

  // jalankan kmeans
  const centroids = kmeans(orders, 3);

  // mapping label
  const labels = ["Tinggi", "Rendah", "Sedang"];

  const clusters = centroids.map((c, i) => ({
    centroidBerat: c.berat,
    centroidKoli: c.koli,
    label: labels[i]
  }));

  await saveClusters(clusters);

  return clusters;
};


STEP 5 — Controller
import { Request, Response } from "express";
import { retrainCluster } from "../service/clusterService";

export const retrainController = async (req: Request, res: Response) => {
  try {
    const result = await retrainCluster();
    res.status(200).json({
      message: "Retrain berhasil",
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

STEP 6 — Router
import { retrainController } from "../controller/clusterController";

router.post("/cluster/retrain", retrainController);

STEP 7 — Pakai centroid saat create order
orderService.ts
import { getClusters } from "../repository/clusterRepo";

const hitungPrioritas = async (berat: number, koli: number) => {
  const clusters = await getClusters();

  const distances = clusters.map(c => {
    return Math.sqrt(
      Math.pow(berat - c.centroidBerat, 2) +
      Math.pow(koli - c.centroidKoli, 2)
    );
  });

  const index = distances.indexOf(Math.min(...distances));

  return clusters[index].label;
};

user
Repo
export const getUser = async (
    skip: number,
    take: number,
    search: string
) => {

    const where = search
        ? {
            OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } },
                { noTelp: { contains: search, mode: "insensitive" as const } },
                { alamat: { contains: search, mode: "insensitive" as const } },
            ],
        }
        : {}; // kalau kosong ambil semua

    return await prisma.user.findMany({
        skip,
        take,
        where,
        include: {
            role: true,
        },
    });
};

export const countUser = async (search: string) => {
    const where = search
        ? {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { noTelp: { contains: search, mode: "insensitive" } },
            ],
        }
        : {};
    return await prisma.user.count();
};

service
export const getAllUser = async ({ page, limit, search }: { page: number; limit: number, search: string }) => {
    const { skip, take, currentPage } = getPagination(page, limit);

    const users = await getUser(skip, take, search);
    const total = await countUser(search);

    return {
        data: users,
        meta: getPagingData(total, currentPage, take),
    };
}

controller
export const getUsersController = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = String(req.query.search || "");

        const result = await getAllUser({ page, limit, search });
        res.status(200).json({
            message: "Get users successful",
            data: result,
            meta: result.meta,
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

order
repo
export const getOrder = async (skip: number, take: number, search: string) => {
    const isNumber = !isNaN(Number(search));
    const where = search ? {
        OR: [
            { noSpb: { contains: search, mode: "insensitive" as const } },
            { alamaTujuan: { contains: search, mode: "insensitive" as const } },
            { prioritas: { contains: search, mode: "insensitive" as const } },
            ...(isNumber
                ? [{ koli: Number(search) }]
                : []),
            ...(isNumber
                ? [{ berat: Number(search) }]
                : []),
        ]
    } : {};

    return await prisma.order.findMany({
        skip,
        take,
        where,
        orderBy: {
            id: "desc", 
        },
        include: {
            user: true,
            price: true,
            delivery: true
        }
    });
}


export const countOrder = async (search: string) => {
    const isNumber = !isNaN(Number(search));
    const where = search ? {
        OR: [
            { noSpb: { constains: search, mode: "insensitive" as const } },
            { alamatTujuan: { constains: search, mode: "insensitive" as const } },
            { prioritas: { constains: search, mode: "insensitive" as const } },
            ...(isNumber
                ? [{ koli: Number(search) }]
                : []),
            ...(isNumber
                ? [{ berat: Number(search) }]
                : []),
        ]
    } : {};

    return await prisma.order.count();
}

service
export const getAllOrder = async ({ page, limit, search }: { page: number, limit: number, search: string }) => {
    const { skip, take, currentPage } = getPagination(page, limit);

    const orders = await getOrder(skip, take, search);
    const total = await countOrder(search);
    return {
        data: orders,
        meta: getPagingData(total, currentPage, take)
    };
}

controller
export const getOrderController = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1;
    const search = String(req.query.search) || "";

    const result = await getAllOrder({ page, limit, search });
    res.status(200).json({
      message: "Berhasil mendapatkan data order",
      data: result,
      meta: result.meta
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}