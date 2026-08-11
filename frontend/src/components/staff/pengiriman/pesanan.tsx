"use client"
import Pagination from "@/components/tables/Pagination";
import Table from "@/components/tables/Table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { apiRequest } from "@/service/api.service";
import { Column, hargaData, pengirimanData, pesananData, truckData, userData } from "@/types";
import { Search, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const initialForm = {
    id: 0,
    userId: 0,
    hargaId: 0,
    pengirimanId: 0,
    noSpb: "",
    koli: "",
    berat: "",
    hargaCustom: "",
    tujuan: "",
    ket: "",
    prioritas: "",
    statusPay: "",
    tanggalMasuk: "",
    total: "",
    image: "",
};

export default function PengirimanPesanan() {
    const [pesanan, setPesanan] = useState<pesananData[]>([]);
    const [harga, setHarga] = useState<hargaData[]>([]);
    const [user, setUser] = useState<userData[]>([]);
    const [pengiriman, setPengiriman] = useState<pengirimanData | null>(null);
    const [truck, setTruck] = useState<truckData[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const params = useParams();
    const pengirimanId = params.id;
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
    const [form, setForm] = useState(initialForm);
    const [meta, setMeta] = useState({
        total: 0,
        page: 1,
        lastPage: 1,
    });

    const [alert, setAlert] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    // console.log("PARAMS:", params);
    // console.log("PENGIRIMAN ID:", pengirimanId);

    const getPesanan = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await apiRequest({
                endpoint: `/pesanan?pengirimanId=${pengirimanId}&page=${pageNumber}&limit=50&search=${search}`
            });

            console.log("Data Full Order:", res);
            console.log("Array Pesanan:", res.data);
            setPesanan(res.data.data);
            setMeta(res.data.meta)
        } catch (error) {
            console.error("gagal dapat data Pesanan:", error);
        } finally {
            setLoading(false);
        }
    }

    const getUsers = async () => {
        try {
            const res = await apiRequest({
                endpoint: "/allusers"
            });
            console.log("Users:", res);
            setUser(res.data);
        } catch (error) {
            console.error("Gagal ambil users:", error);
        }
    }

    const getHarga = async () => {
        try {
            const res = await apiRequest({
                endpoint: "/allHarga"
            });
            console.log("Harga:", res);
            setHarga(res.data);
        } catch (error) {
            console.error("Gagal ambil Harga:", error);
        }
    }

    const getPengirimanDetail = async () => {
        try {
            console.log("FETCH PENGIRIMAN ID:", pengirimanId);

            const res = await apiRequest({
                endpoint: `/pengiriman/${pengirimanId}`
            });

            console.log("PENGIRIMAN DETAIL:", res);

            setPengiriman(res);
        } catch (error) {
            console.error("Gagal ambil pengiriman:", error);
        }
    };

    useEffect(() => {
        getPesanan(page);
        getUsers();
        getHarga();
        getPengirimanDetail();
    }, [page, search]);

    useEffect(() => {
        if (pengirimanId) {
            getPengirimanDetail();
        }
    }, [pengirimanId]);

    useEffect(() => {
        const delay = setTimeout(() => {
            getPesanan(1);
        }, 500);

        return () => clearTimeout(delay);
    }, [search]);


    const formatNumber = (value: number) =>
        new Intl.NumberFormat("id-ID").format(value);


    const updateStatusPay = async (
        id: number,
        statusPay: string
    ) => {
        try {
            await apiRequest({
                endpoint: `/pesanan/${id}`,
                method: "PUT",
                data: {
                    statusPay,
                },
            });

            getPesanan();

            setAlert({
                type: "success",
                message: "Status pembayaran berhasil diubah",
            });

        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal mengubah status pembayaran",
            });
        }
    };

    const handleRemovePengiriman = async (id: number) => {
        const confirmed = window.confirm(
            "Apakah Anda yakin ingin mengeluarkan pesanan dari pengiriman?"
        );

        if (!confirmed) return;

        try {
            await apiRequest({
                endpoint: `/pesanan/${id}`,
                method: "PUT",
                data: {
                    pengirimanId: null,
                },
            });

            getPesanan();
            getPengirimanDetail();

            setAlert({
                type: "success",
                message: "Pesanan berhasil dikeluarkan dari pengiriman",
            });

        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal menghapus pengiriman",
            });
        }
    };

    const pesananBelumBayar =
        pesanan?.filter(
            (item) =>
                item.statusPay
                    ?.trim()
                    .toLowerCase() ===
                "belum lunas"
        ) || [];

    const pesananLunas =
        pesanan?.filter(
            (item) =>
                item.statusPay
                    ?.trim()
                    .toLowerCase() ===
                "lunas"
        ) || [];

    const totalBelumBayar =
        pesananBelumBayar.reduce(
            (sum, item) =>
                sum + Number(item.total || 0),
            0
        );

    const totalLunas =
        pesananLunas.reduce(
            (sum, item) =>
                sum + Number(item.total || 0),
            0
        );

    const getPrioritasOrder = (prioritas: string | undefined): number => {
        const v = prioritas?.trim().toLowerCase() || "";
        if (v.includes("ekspress")) return 1;
        if (v.includes("tinggi")) return 2;
        if (v.includes("sedang")) return 3;
        return 4; // Rendah / tidak diketahui
    };

    const sortByPrioritas = (data: any[]) => {
        return [...data].sort(
            (a, b) => getPrioritasOrder(a.prioritas) - getPrioritasOrder(b.prioritas)
        );
    };

    // Terapkan sorting ke data sebelum dipakai di tabel
    const sortedPesananBelumBayar = sortByPrioritas(pesananBelumBayar);
    const sortedPesananLunas = sortByPrioritas(pesananLunas);
    // const TotalSelected = pesanan
    //     .filter((o) => selectedOrders.includes(o.id))
    //     .reduce((sum, item) => sum + Number(item.total || 0), 0);

    // const handleAssign = async () => {
    //     try {
    //         await apiRequest({
    //             endpoint: "/order/assign-delivery",
    //             method: "PUT",
    //             data: {
    //                 orderIds: selectedOrders,
    //                 deliveryId: Number(pengirimanId),
    //             },
    //         });

    //         console.log("Berhasil assign order!");
    //         getPesanan();
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // const handleCheckbox = (id: number) => {
    //     setSelectedOrders((prev) =>
    //         prev.includes(id)
    //             ? prev.filter((item) => item !== id)
    //             : [...prev, id]
    //     );
    // };

    // const handleSelectAll = () => {
    //     if (selectedOrders.length === pesanan.length) {
    //         // kalau sudah semua ke-select → uncheck semua
    //         setSelectedOrders([]);
    //     } else {
    //         // kalau belum → select semua ID di halaman ini
    //         setSelectedOrders(pesanan.map((item) => item.id));
    //     }
    // };

    const columns: Column[] = [
        // {
        //     key: "checkbox",
        //     label: (
        //         <input
        //             type="checkbox"
        //             checked={selectedOrders.length === pesanan.length && pesanan.length > 0}
        //             onChange={handleSelectAll}
        //         />
        //     ),
        //     render: (row: any) => (
        //         <input
        //             type="checkbox"
        //             checked={selectedOrders.includes(row.id)}
        //             onChange={() => handleCheckbox(row.id)}
        //         />
        //     ),
        // },
        { key: "noSpb", label: "No SPB" },
        { key: "user.name", label: "Customer" },
        { key: "koli", label: "Koli" },
        { key: "berat", label: "Berat", type: "weight" },
        { key: "tujuan", label: "Alamat Tujuan" },
        {
            key: "harga",
            label: "Harga",
            render: (row: any) => {
                const harga =
                    row.hargaCustom && Number(row.hargaCustom) > 0
                        ? row.hargaCustom
                        : row.harga?.hargaTarif || 0;

                return new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                }).format(harga);
            },
        },
        { key: "total", label: "Total", type: "currency" },
        {
            key: "statusPay",
            label: "Status",
            render: (row: any) => {
                const status =
                    row.statusPay?.trim().toLowerCase();

                return (
                    <button
                        onClick={() =>
                            updateStatusPay(
                                row.id,
                                status === "lunas"
                                    ? "Belum Lunas"
                                    : "Lunas"
                            )
                        }
                    >
                        {status === "lunas" ? (
                            <Badge
                                variant="light"
                                color="success"
                            >
                                Lunas
                            </Badge>
                        ) : (
                            <Badge
                                variant="light"
                                color="error"
                            >
                                Belum Lunas
                            </Badge>
                        )}
                    </button>
                );
            },
        },
        {
            key: "prioritas",
            label: "Prioritas",
            render: (row: any) => {
                const v = row.prioritas?.trim().toLowerCase() || "";
                if (v.includes("ekspress")) {
                    return <Badge variant="light" color="success">Prioritas Express</Badge>;
                }
                if (v.includes("tinggi")) {
                    return <Badge variant="light" color="error">Prioritas Tinggi</Badge>;
                }
                if (v.includes("sedang")) {
                    return <Badge variant="light" color="warning">Prioritas Sedang</Badge>;
                }
                return <Badge variant="light" color="info">Prioritas Rendah</Badge>;
            }
        },
        {
            key: "actions",
            label: "Actions",
            render: (row: any) => (
                <button
                    onClick={() => handleRemovePengiriman(row.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                >
                    <Trash2 size={16} />
                </button>
            )
        }
    ];

    const pesananPengiriman =
        pesanan?.filter(
            (item) => item.pengirimanId === pengiriman?.id
        ) || [];

    const jumlahBarang = pesananPengiriman.length;

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="p-3 flex flex-col gap-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-xl font-semibold text-gray-700 dark:text-white">
                            Plat / Kode:{" "}
                            <div className="mt-2 text-2xl font-bold text-blue-600">
                                {pengiriman?.truck?.platNomor || "-"}
                            </div>
                        </div>

                        {/* TOTAL Kapasitas */}
                        <div className="text-xl font-semibold text-gray-700 dark:text-white">
                            Total Kapasitas:{" "}
                            <div className="mt-2 text-2xl font-bold text-green-600">
                                {formatNumber(Number(pengiriman?.kapasitas || 0))} KG
                            </div>
                        </div>

                        {/* TOTAL BB */}
                        <div className="text-xl font-semibold text-gray-700 dark:text-white">
                            Biaya Berangkat:{" "}
                            <div className="mt-2 text-2xl font-bold text-purple-600">
                                Rp {formatNumber(Number(pengiriman?.bb || 0))}
                            </div>
                        </div>

                        <div className="text-xl font-semibold text-gray-700 dark:text-white">
                            Total Belum Bayar
                            <div className="mt-2 text-2xl font-bold text-red-600">
                                {pesananBelumBayar.length}
                                {" / "}
                                Rp {formatNumber(totalBelumBayar)}
                            </div>
                        </div>

                        {/* JUMLAH BARANG */}
                        <div className="text-xl font-semibold text-gray-700 dark:text-white">
                            Jumlah Barang:{" "}
                            <div className="mt-2 text-2xl font-bold text-blue-600">
                                {formatNumber(jumlahBarang)}
                            </div>
                        </div>

                        {/* TOTAL KESELURUHAN DIPILIH */}
                        <div className="text-xl font-semibold text-gray-700 dark:text-white">
                            Total Berat:{" "}
                            <div className="mt-2 text-2xl font-bold text-green-600">
                                {formatNumber(Number(pengiriman?.totalBerat || 0))} KG
                            </div>
                        </div>

                        {/* TOTAL KESELURUHAN */}
                        <div className="text-xl font-semibold text-gray-700 dark:text-white">
                            Total Keseluruhan:{" "}
                            <div className="mt-2 text-2xl font-bold text-purple-600">
                                Rp {formatNumber(Number(pengiriman?.totalHarga || 0))}
                            </div>
                        </div>
                        <div className="text-xl font-semibold text-gray-700 dark:text-white">
                            Total Lunas
                            <div className="mt-2 text-2xl font-bold text-emerald-600">
                                {pesananLunas.length}
                                {" / "}
                                Rp {formatNumber(totalLunas)}
                            </div>
                        </div>
                    </div>


                    <div className="flex items-center justify-between">
                        <div className="hidden lg:block">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="relative">
                                    <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                                        <Search />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search Provinsi, kota & harga..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="dark:bg-dark-900 h-11 w-full rounded-lg border px-4 pl-12 text-sm"
                                    />
                                </div>
                            </form>
                            <span className="text-sm text-muted-foreground px-2 text-gray-500 dark:text-white">
                                Status Pembayaran bisa diubah dengan menekan saja!!!
                            </span>
                        </div>

                        {/* <button
                            onClick={handleAssign}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Assign ke Delivery
                        </button> */}
                    </div>
                </div>
                <div className="max-w-full overflow-x-auto px-4 pb-4">
                    <div className="min-w-[1102px]">
                        {
                            loading ? (
                                <p>Loading...</p>
                            ) : (
                                <Table columns={columns} data={pesanan} />
                            )
                        }
                    </div>
                </div>
                <div className="flex justify-end mt-6 pr-4">
                    <Pagination
                        currentPage={meta.page}
                        totalPages={meta.lastPage}
                        onPageChange={(page) => setPage(page)}
                    />
                </div>
            </div>
        </>
    );
}