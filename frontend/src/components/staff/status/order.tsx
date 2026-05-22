"use client"
import Pagination from "@/components/tables/Pagination";
import Table from "@/components/tables/Table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { apiRequest } from "@/service/api.service";
import { Column, deliverData, orderData, priceData, userData } from "@/types";
import { Pencil, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderStatusModal from "./ModalOrder";
import Alert from "@/components/ui/alert/Alert";

const initialForm = {
    id: 0,
    noSpb: "",
    status: "",
};

export default function StatusOrder() {
    const [order, setOrder] = useState<orderData[]>([]);
    const [price, setPrice] = useState<priceData[]>([]);
    const [user, setUser] = useState<userData[]>([]);
    const [delivery, setDelivery] = useState<deliverData | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { isOpen, openModal, closeModal } = useModal();
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

    // console.log("PARAMS:", params);
    // console.log("TYPE:", typeof params.id);
    // console.log("DELIVERY ID RAW:", params.id);
    // console.log("DELIVERY ID NUMBER:", Number(params.id));

    const getOrder = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await apiRequest({
                endpoint: `/order?deliveryId=${deliveryId}&page=${pageNumber}&limit=50&search=${search}`
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
        if (deliveryId) {
            getOrder(page);
        }
        getUsers();
        getPrice();
    }, [page, search, deliveryId]);

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

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleEdit = (row: any) => {
        setForm({
            id: row.id,
            noSpb: row.noSpb || "",
            status: row.status || "",
        });

        openModal();
    };

    const handleUpdate = async () => {
        try {
            await apiRequest({
                endpoint: `/order/${form.id}`,
                method: "PUT",
                data: {
                    status: form.status
                }
            });

            setAlert({
                type: "success",
                message: "Status berhasil diupdate",
            });

            closeModal();
            getOrder();

        } catch (error: any) {
            console.error("ERROR:", error?.response?.data);
        }
    };

    const handleSubmit = async () => {
        await handleUpdate();
    }

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [alert]);


    const columns: Column[] = [
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
        {
            key: "status", label: "Status Pembayaran",
        },
        {
            key: "action",
            label: "Action",
            render: (row: any) => (
                <div className="flex gap-2">

                    <button
                        onClick={() => handleEdit(row)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                    >
                        <Pencil size={16} />
                    </button>
                </div>
            ),
        }
    ];

    return (
        <>
            {alert && (
                <div className="fixed top-20 right-5 z-[9999] w-[300px]">
                    <Alert
                        variant={alert.type}
                        title={alert.type === "success" ? "Success" : "Error"}
                        message={alert.message}
                        showLink={false}
                    />
                </div>
            )}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="p-3 flex flex-col gap-3">


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
            <OrderStatusModal
                isOpen={isOpen}
                onClose={closeModal}
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </>
    );
}