"use client"

import Pagination from "@/components/tables/Pagination";
import Table from "@/components/tables/Table";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { apiRequest } from "@/service/api.service";
import { Column, deliverData } from "@/types";
import { Package, Pencil, PlusCircleIcon, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import DeliveryModal from "./Modal";
import { useRouter } from "next/navigation";

export default function Delivery() {
    const [delivery, setDelivery] = useState<deliverData[]>([]);
    const [deliverySummary, setDeliverySummary] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { isOpen, openModal, closeModal } = useModal();
    const [mode, setMode] = useState<"create" | "edit">("create");
    const router = useRouter();

    const [form, setForm] = useState({
        id: 0,
        name: "",
        bb: "",
        tanggalJalan: "",
    });

    const [meta, setMeta] = useState({
        total: 0,
        page: 1,
        lastPage: 1,
    });

    const [alert, setAlert] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const getDelivery = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await apiRequest({
                endpoint: `/deliverypaginate?page=${pageNumber}&limit=10&search=${search}`
            });
            console.log("Data Full delivery:", res);
            console.log("Array delivery:", res.data);
            setDelivery(res.data.data);
            setMeta(res.meta);

        } catch (error) {
            console.error("gagal dapat data Delivery:", error);
        } finally {
            setLoading(false);
        }
    }

    const getDeliverySummary = async () => {
        try {
            const res = await apiRequest({
                endpoint: "/delivery-summary"
            });
            setDeliverySummary(res.data);
        } catch (error) {
            console.error("gagal dapat data Delivery Summary:", error);
        }
    };

    const mergedDelivery = delivery.map((d) => {
        const summary = deliverySummary.find((s) => s.id === d.id);

        return {
            ...d,
            totalOrder: summary?.totalOrder || 0,
            profit: summary?.profit || 0,
        };
    });

    useEffect(() => {
        getDelivery(page);
        getDeliverySummary();
    }, [page, search]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: name === "bb" ? Number(value) : value,
        });

    };

    const handleCreate = async () => {
        try {
            const payload = {
                name: form.name,
                bb: Number(form.bb),
                tanggalJalan: new Date(form.tanggalJalan).toISOString(),
            };

            console.log("PAYLOAD:", payload); // debug


            await apiRequest({
                endpoint: "/delivery",
                method: "POST",
                data: payload,
            });

            closeModal();
            setForm({
                id: 0,
                name: "",
                bb: "",
                tanggalJalan: "",
            });

            setAlert({
                type: "success",
                message: "Delivery berhasil dibuat",
            });
            getDelivery();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal membuat delivery"
            });
            console.error("console.error", error);
        }
    }

    const handleEdit = (row: any) => {
        setMode("edit");

        setForm({
            id: row.id,
            name: row.name || "",
            bb: row.bb || "",
            tanggalJalan: row.tanggalJalan || new Date(),
        });

        openModal();
    };

    const handleUpdate = async () => {
        try {
            await apiRequest({
                endpoint: `/delivery/${form.id}`,
                method: "PUT",
                data: {
                    ...form,
                }
            });

            setAlert({
                type: "success",
                message: "Delivery berhasil diupdate",
            });

            closeModal();
            getDelivery();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal membuat update data Delivery"
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
        const confirmDelete = confirm("Yakin mau hapus Data ini?");
        if (!confirmDelete) return;

        try {
            await apiRequest({
                endpoint: `/delivery/${id}`,
                method: "DELETE",
            });

            setAlert({
                type: "success",
                message: "delivery berhasil dihapus",
            });
            getDelivery();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal menghapus delivery",
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
        { key: "name", label: "Nama Pengiriman" },
        { key: "bb", label: "BB", type: "currency" },
        { key: "totalOrder", label: "Total Order", type: "currency" },
        { key: "profit", label: "Profit/ selisih", type: "currency" },
        { key: "tanggalJalan", label: "Tanggal Jalan", type: "date" },
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
                    <button
                        onClick={() => router.push(`/delivery/${row.id}`)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded"
                    >
                        <Package size={16} />
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
                <div className="p-4 flex justify-end">

                    {/* <div className="hidden lg:block">
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
                    </div> */}

                    <Button
                        size="sm"
                        variant="primary"
                        endIcon={<PlusCircleIcon />}
                        onClick={() => {
                            setMode("create");

                            setForm({
                                id: 0,
                                name: "",
                                bb: "",
                                tanggalJalan: "",
                            });

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
                                <Table columns={columns} data={mergedDelivery} />
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

            <DeliveryModal
                isOpen={isOpen}
                onClose={closeModal}
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                mode={mode}
            />
        </>
    )

}