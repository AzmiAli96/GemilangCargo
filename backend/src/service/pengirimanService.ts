import { GenerateTruckDto, pengirimanData } from "../types/pengiriman";
import { countpengiriman, createpengiriman, deletepengiriman, getpengiriman, getpengirimanpaginate, updatepengiriman, pengirimanById, getTruckAktif, getPesananPending, getTruckGenerate, updatePengirimanGenerate, createPengirimanGenerate, updatePesananPengiriman, updateTruckStatus, getpengirimanPesanan, getPengirimanPending } from "../repository/pengirimanRepo"
import { getPagination, getPagingData } from "../utils/pagination";
import { groupPesananByPriority, isiTruck, sortPesanan } from "../utils/greedy";
import { pesananData } from "../types/pesanan";
import { formatPhoneNumber } from "../utils/formatWa";
import { sendWhatsApp } from "./whatsappService";
import prisma from "../db/prisma";

export const getAllpengiriman = async () => {
    const pengiriman = await getpengiriman();
    return pengiriman;
}

export const getAllpengirimanpaginate = async ({ page, limit }: { page: number, limit: number }) => {
    const { skip, take, currentPage } = getPagination(page, limit);

    const pengiriman = await getpengirimanpaginate(skip, take);
    const total = await countpengiriman();
    return {
        data: pengiriman,
        meta: getPagingData(total, currentPage, take)
    };
}

export const getpengirimanById = async (id: number) => {
    const pengiriman = await pengirimanById(id);
    return pengiriman;
}

export const postpengiriman = async (item: pengirimanData) => {
    const pengiriman = await createpengiriman(item);
    return pengiriman;
}

export const putpengiriman = async (id: number, item: pengirimanData) => {
    const before = await prisma.pengiriman.findUnique({
        where: { id }
    });

    const pengiriman = await updatepengiriman(id, item);
    const allowedStatus = ["DALAM PERJALANAN", "SELESAI"];

    if (!allowedStatus.includes(
        pengiriman.statusPengiriman
    )) {
        return pengiriman;
    }

    if (before?.statusPengiriman === pengiriman.statusPengiriman) {
        return pengiriman;
    }

    const pesanan = await getpengirimanPesanan(
        pengiriman.id
    );

    const userMap = new Map<string, any[]>();
    for (const order of pesanan) {
        const rawPhone = order.user?.noHp;
        if (!rawPhone) continue;
        const phone = formatPhoneNumber(rawPhone);
        if (!phone) continue;
        if (!userMap.has(phone)) {
            userMap.set(phone, []);
        }
        userMap.get(phone)?.push(order);
    }
    console.log("VALID NUMBERS:", Array.from(userMap));

    const tanggal = pengiriman?.tanggalJalan
        ? new Date(pengiriman.tanggalJalan).toLocaleDateString("id-ID")
        : "-";

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(Number(angka));
    };

    for (const [phone, userOrders] of userMap.entries()) {
        try {
            const totalKeseluruhan = userOrders.reduce(
                (sum, pesanan) =>
                    sum + Number(pesanan.total || 0),
                0
            );

            let detailPesanan = "";
            userOrders.forEach((pesanan: any, index: number) => {
                detailPesanan += `
📦 Pesanan ${index + 1}
No SPB: ${pesanan.noSpb}
Koli: ${pesanan.koli}
Berat: ${pesanan.berat}
Total: ${formatRupiah(pesanan.total)}
----------------------`;
            });
            const message = `
            Halo pelanggan 👋

Pesanan Anda sedang:
🚚 Status: ${pengiriman.statusPengiriman}
📅 Tanggal Jalan: ${tanggal}

Detail Pesanan: ${detailPesanan}

💰 Total Keseluruhan: ${formatRupiah(totalKeseluruhan)}

Terima kasih sudah Berlangganan dengan Gemilang Cargo 🙏`;

            console.log("KIRIM KE:", phone);
            await sendWhatsApp(phone, message);
            await new Promise(res => setTimeout(res, 1500));
        } catch (err) {
            console.error("Gagal kirim ke:", phone, err);
        }
    }

    return pengiriman;
}

export const deletepengirimanId = async (id: number) => {
    await deletepengiriman(id);
}


// export const getpengirimanSummaryService = async () => {
//     return await getpengirimanWithSummary();
// };

export const generatePengiriman = async (truckList: GenerateTruckDto[]) => {
    const pendingPengiriman = await getPengirimanPending();

    const pending = pendingPengiriman.map(p => ({
        truckId: p.truckId,
        kapasitas: Number(p.kapasitas),
        bb: Number(p.bb),
        pengiriman: p
    }));

    const pendingIds = new Set(pendingPengiriman.map(p => p.truckId));
    const selectedTruck = truckList
        .filter(t => !pendingIds.has(t.truckId))
        .map(t => ({
            truckId: t.truckId,
            kapasitas: t.kapasitas,
            bb: t.bb,
            pengiriman: null
        }));

    const ids = truckList.map(t => t.truckId);
    const duplicate = ids.find((id, index) => ids.indexOf(id) !== index);
    if (duplicate) {
        throw new Error("Truck tidak boleh dipilih lebih dari satu kali.");
    }

    const semuaTruck = [...pending, ...selectedTruck];
    const pesanan = await getPesananPending();
    const sortedPesanan = sortPesanan(pesanan);

    const {
        custom: pesananCustom,
        tinggi: pesananTinggi,
        sedang: pesananSedang,
        rendah: pesananRendah
    } = groupPesananByPriority(sortedPesanan);

    const usedOrders = new Set<number>();

    // 1. Bangun truckStates SEKALI SAJA, di luar loop
    const truckStates = semuaTruck.map(truck => {
        const lastPengiriman = truck.pengiriman;
        if (lastPengiriman) {
            for (const p of lastPengiriman.pesanan) {
                usedOrders.add(p.id);
            }
        }
        return {
            truckId: truck.truckId,
            kapasitasTruck: Number(truck.kapasitas),
            bbTruck: Number(truck.bb),
            lastPengiriman,
            selectedOrders: lastPengiriman ? [...lastPengiriman.pesanan] : [],
            state: {
                totalBerat: lastPengiriman ? Number(lastPengiriman.totalBerat) : 0,
                totalHarga: lastPengiriman ? Number(lastPengiriman.totalHarga) : 0
            }
        };
    });

    // 2. Distribusikan pesanan SEKALI SAJA per grup prioritas
    isiTruck(pesananCustom, usedOrders, truckStates);
    isiTruck(pesananTinggi, usedOrders, truckStates);
    isiTruck(pesananSedang, usedOrders, truckStates);
    isiTruck(pesananRendah, usedOrders, truckStates);

    // 3. Baru loop untuk simpan ke database, baca hasil dari truckStates
    const hasil: any[] = [];

    for (const t of truckStates) {
        const totalBerat = t.state.totalBerat;
        const totalHarga = t.state.totalHarga;
        const statusPengiriman = totalHarga >= t.bbTruck
            ? "SIAP BERANGKAT"
            : "PENDING";

        let pengirimanId: number;

        if (t.lastPengiriman) {
            const pengiriman = await updatePengirimanGenerate(t.lastPengiriman.id, {
                truckId: t.truckId,
                kapasitas: t.kapasitasTruck,
                bb: t.bbTruck,
                totalBerat,
                totalHarga,
                tanggalJalan: t.lastPengiriman.tanggalJalan,
                statusPengiriman
            });
            pengirimanId = pengiriman.id;
        } else {
            const pengiriman = await createPengirimanGenerate({
                truckId: t.truckId,
                kapasitas: t.kapasitasTruck,
                bb: t.bbTruck,
                totalBerat,
                totalHarga,
                tanggalJalan: new Date(),
                statusPengiriman
            });
            pengirimanId = pengiriman.id;
        }

        for (const order of t.selectedOrders) {
            if (order.pengirimanId) continue;
            await updatePesananPengiriman(order.id, pengirimanId);
        }

        hasil.push({
            truckId: t.truckId,
            pengirimanId,
            totalBerat,
            kapasitas: t.kapasitasTruck,
            totalHarga,
            bb: t.bbTruck,
            bbTerpenuhi: totalHarga >= t.bbTruck,
            status: statusPengiriman,
            orders: t.selectedOrders
        });
    }

    return hasil;
};