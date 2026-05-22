"use client"
import Pagination from "@/components/tables/Pagination";
import Table from "@/components/tables/Table";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { apiRequest } from "@/service/api.service";
import { Column, orderData, priceData, userData } from "@/types";
import { Pencil, PlusCircleIcon, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import OrderCustomModal from "./Modal";
import Badge from "@/components/ui/badge/Badge";

const initialForm = {
    id: 0,
    userId: 0,
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

export default function OrderCustom() {
    const [order, setOrder] = useState<orderData[]>([]);
    const [user, setUser] = useState<userData[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { isOpen, openModal, closeModal } = useModal();
    const [mode, setMode] = useState<"create" | "edit">("create");

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

    const getOrder = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await apiRequest({
                endpoint: `/order?filterHarga=hargaCustom&page=${pageNumber}&limit=10&search=${search}`
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

    useEffect(() => {
        getOrder(page);
        getUsers();
    }, [page, search]);

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

    const handleCreate = async () => {
        try {
            await apiRequest({
                endpoint: "/order",
                method: "POST",
                data: {
                    ...form,
                    userId: Number(form.userId),
                    deliveryId: form.deliveryId ? Number(form.deliveryId) : null,
                    koli: Number(form.koli),
                    berat: Number(form.berat),
                    hargaCustom: form.hargaCustom ? Number(form.hargaCustom) : null,
                    total: Number(form.total),
                },
            });

            closeModal();
            setForm(initialForm);

            setAlert({
                type: "success",
                message: "order berhasil dibuat",
            });
            getOrder();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal membuat order"
            });
            console.error("console.error", error);
        }
    }

    const handleEdit = (row: any) => {
        setMode("edit");

        setForm({
            id: row.id,
            userId: row.userId,
            deliveryId: row.deliveryId,
            noSpb: row.noSpb || "",
            koli: row.koli || "",
            berat: row.berat || "",
            hargaCustom: row.hargaCustom || "",
            alamaTujuan: row.alamaTujuan || "",
            ket: row.ket || "",
            prioritas: row.prioritas || "",
            total: row.total || "",
            image: row.image || "",
        });

        openModal();
    };

    const handleUpdate = async () => {
        try {
            await apiRequest({
                endpoint: `/order/${form.id}`,
                method: "PUT",
                data: {
                    ...form,
                }
            });

            setAlert({
                type: "success",
                message: "Order berhasil diupdate",
            });

            closeModal();
            getOrder();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal membuat update data Order"
            });
            console.error("console.error", error);
        }
    }

    const handleSubmit = async () => {
        if (mode === "create") {
            await handleCreate();
        } else {
            await handleUpdate();
        }
    }

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm("Yakin mau hapus user ini?");
        if (!confirmDelete) return;

        try {
            await apiRequest({
                endpoint: `/order/${id}`,
                method: "DELETE",
            });

            setAlert({
                type: "success",
                message: "Order berhasil dihapus",
            });
            getOrder();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal menghapus Order",
            });
            console.error("Gagal delete:", error);
        }
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
        { key: "hargaCustom", label: "Harga", type: "currency", },
        {key: "total", label:"Total", type: "currency"},
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

                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                    >
                        <Trash2 size={16} />
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
                <div className="p-3 flex items-center justify-between">

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
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                    }}
                                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 xl:w-[430px]"
                                />
                            </div>
                        </form>
                    </div>

                    <Button
                        size="sm"
                        variant="primary"
                        endIcon={<PlusCircleIcon />}
                        onClick={() => {
                            setMode("create");

                            setForm(initialForm);

                            openModal();
                        }}
                    >
                        Create
                    </Button>

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

            <OrderCustomModal
                isOpen={isOpen}
                onClose={closeModal}
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                mode={mode}
                users={user}
            />
        </>
    );

} 