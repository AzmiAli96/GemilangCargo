"use client"
import Pagination from "@/components/tables/Pagination";
import Table from "@/components/tables/Table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { apiRequest } from "@/service/api.service";
import { Column, deliverData, orderData, priceData, userData } from "@/types";
import { Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const initialForm = {
    id: 0,
    userId: 0,
    priceId: 0,
    deliveryId: 0,
    noSpb: "",
    koli: "",
    berat: "",
    hargaCustom: "",
    alamaTujuan: "",
    ket: "",
    prioritas: "",
    total: "",
    image: "",
};

export default function DeliveryOrder() {
    const [order, setOrder] = useState<orderData[]>([]);
    const [price, setPrice] = useState<priceData[]>([]);
    const [user, setUser] = useState<userData[]>([]);
    const [delivery, setDelivery] = useState<deliverData | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const params = useParams();
    const deliveryId = params.id;
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

    console.log("PARAMS:", params);
    console.log("DELIVERY ID:", deliveryId);

    const getOrder = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await apiRequest({
                endpoint: `/order?deliveryId=null&page=${pageNumber}&limit=50&search=${search}`
            });

            console.log("Data Full Order:", res);
            console.log("Array Order:", res.data);
            setOrder(res.data.data);
            setMeta(res.data.meta)
        } catch (error) {
            console.error("gagal dapat data Order:", error);
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

    const getPrice = async () => {
        try {
            const res = await apiRequest({
                endpoint: "/allprice"
            });
            console.log("Price:", res);
            setPrice(res.data);
        } catch (error) {
            console.error("Gagal ambil Price:", error);
        }
    }

    const getDeliveryDetail = async () => {
        try {
            console.log("FETCH DELIVERY ID:", deliveryId);

            const res = await apiRequest({
                endpoint: `/delivery/${deliveryId}`
            });

            console.log("DELIVERY DETAIL:", res);

            setDelivery(res);
        } catch (error) {
            console.error("Gagal ambil delivery:", error);
        }
    };

    useEffect(() => {
        getOrder(page);
        getUsers();
        getPrice();
    }, [page, search]);

    useEffect(() => {
        if (deliveryId) {
            getDeliveryDetail();
        }
    }, [deliveryId]);

    useEffect(() => {
        const delay = setTimeout(() => {
            getOrder(1);
        }, 500);

        return () => clearTimeout(delay);
    }, [search]);

    const TotalSelected = order
        .filter((o) => selectedOrders.includes(o.id))
        .reduce((sum, item) => sum + Number(item.total || 0), 0);

    const formatNumber = (value: number) =>
        new Intl.NumberFormat("id-ID").format(value);

    const handleAssign = async () => {
        try {
            await apiRequest({
                endpoint: "/order/assign-delivery",
                method: "PUT",
                data: {
                    orderIds: selectedOrders,
                    deliveryId: Number(deliveryId),
                },
            });

            console.log("Berhasil assign order!");
            getOrder();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckbox = (id: number) => {
        setSelectedOrders((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedOrders.length === order.length) {
            // kalau sudah semua ke-select → uncheck semua
            setSelectedOrders([]);
        } else {
            // kalau belum → select semua ID di halaman ini
            setSelectedOrders(order.map((item) => item.id));
        }
    };

    const columns: Column[] = [
        {
            key: "checkbox",
            label: (
                <input
                    type="checkbox"
                    checked={selectedOrders.length === order.length && order.length > 0}
                    onChange={handleSelectAll}
                />
            ),
            render: (row: any) => (
                <input
                    type="checkbox"
                    checked={selectedOrders.includes(row.id)}
                    onChange={() => handleCheckbox(row.id)}
                />
            ),
        },
        { key: "noSpb", label: "No SPB" },
        { key: "user.name", label: "Customer" },
        { key: "koli", label: "Koli" },
        { key: "berat", label: "Berat" },
        { key: "alamaTujuan", label: "Alamat Tujuan" },
        {
            key: "harga",
            label: "Harga",
            render: (row: any) => {
                const harga =
                    row.hargaCustom && Number(row.hargaCustom) > 0
                        ? row.hargaCustom
                        : row.price?.hargaTarif || 0;

                return new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                }).format(harga);
            },
        },
        { key: "price.kota", label: "Kota Tujuan" },
        { key: "total", label: "Total", type: "currency" },
        {
            key: "prioritas",
            label: "Prioritas",
            render: (row: any) => {
                const v = row.prioritas?.trim().toLowerCase() || "";

                if (v.includes("tinggi")) {
                    return <Badge variant="light" color="error">Prioritas Tinggi</Badge>;
                }
                if (v.includes("sedang")) {
                    return <Badge variant="light" color="warning">Prioritas Sedang</Badge>;
                }
                return <Badge variant="light" color="info">Prioritas Rendah</Badge>;
            }
        },
    ];

    const bb = Number(delivery?.bb || 0);
    const selisih = TotalSelected - bb;

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="p-3 flex flex-col gap-3">

                    <div className="flex flex-wrap items-center justify-between gap-4">

                        {/* BB DELIVERY */}
                        <div className="text-sm font-semibold text-gray-700 dark:text-white">
                            BB Delivery:{" "}
                            <span className="text-blue-600">
                                {formatNumber(Number(delivery?.bb || 0))}
                            </span>
                        </div>

                        {/* TOTAL KESELURUHAN DIPILIH */}
                        <div className="text-sm font-semibold text-gray-700 dark:text-white">
                            Total Keseluruhan Dipilih:{" "}
                            <span className="text-green-600">
                                {formatNumber(TotalSelected)}
                            </span>
                        </div>

                        {/* SELISIH */}
                        <div className="text-sm font-semibold text-gray-700 dark:text-white">
                            Profit / Selisih:{" "}
                            <span
                                className={
                                    selisih >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            >
                                {selisih >= 0 ? "+" : "-"}{" "}
                                {formatNumber(Math.abs(selisih))}
                            </span>
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
                        </div>

                        <button
                            onClick={handleAssign}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Assign ke Delivery
                        </button>

                    </div>

                </div>
                <div className="max-w-full overflow-x-auto px-4 pb-4">
                    <div className="min-w-[1102px]">
                        {
                            loading ? (
                                <p>Loading...</p>
                            ) : (
                                <Table columns={columns} data={order} />
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