"use client"

import Pagination from "@/components/tables/Pagination";
import Table from "@/components/tables/Table";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { apiRequest } from "@/service/api.service";
import { Column, deliverData, driverData, userData } from "@/types";
import { Pencil, PlusCircleIcon, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import DriverModal from "./Modal";

export default function Driver() {
    const [driver, setDriver] = useState<driverData[]>([]);
    const [delivery, setDelivery] = useState<deliverData[]>([]);
    const [user, setUser] = useState<userData[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { isOpen, openModal, closeModal } = useModal();
    const [mode, setMode] = useState<"create" | "edit">("create");

    const [form, setForm] = useState({
        id: 0,
        userId: "",
        deliverId: "",
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

    const getDriver = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await apiRequest({
                endpoint: `/delivery/driverpagination?page=${pageNumber}&limit=10&search=${search}`
            });

            console.log("Data Full driver:", res);
            console.log("Array driver:", res.data);
            setDriver(res.data.data);
            setMeta(res.meta);
        } catch (error) {
            console.error("gagal dapat data driver:", error);
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

    const getDelivery = async () => {
        try {
            const res = await apiRequest({
                endpoint: "/delivery"
            });
            console.log("Delivery RAW:", res);         // lihat full response
            console.log("Delivery data:", res.data);   // lihat isi datanya
            setDelivery(res);
        } catch (error) {
            console.error("Gagal ambil delivery:", error);
        }
    }

    useEffect(() => {
        getDriver(page);
        getUsers();
        getDelivery();
    }, [page, search]);

    useEffect(() => {
        const delay = setTimeout(() => {
            getDriver(1);
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
                endpoint: "/delivery/driver",
                method: "POST",
                data: {
                    ...form,
                    userId: Number(form.userId),
                    deliverId: Number(form.deliverId)

                },
            });

            closeModal();
            setForm({
                id: 0,
                userId: "",
                deliverId: "",
            });

            setAlert({
                type: "success",
                message: "Driver berhasil dibuat",
            });
            getDriver();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal membuat driver"
            });
            console.error("console.error", error);
        }
    }

    const handleEdit = (row: any) => {
        setMode("edit");

        setForm({
            id: row.id,
            userId: row.userId,
            deliverId: row.deliverId,
        });

        openModal();
    };

    const handleUpdate = async () => {
        try {
            await apiRequest({
                endpoint: `/delivery/driver/${form.id}`,
                method: "PUT",
                data: {
                    ...form,
                }
            });

            setAlert({
                type: "success",
                message: "Driver berhasil diupdate",
            });

            closeModal();
            getDriver();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal membuat update data Driver"
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
                endpoint: `/delivery/driver/${id}`,
                method: "DELETE",
            });

            setAlert({
                type: "success",
                message: "Driver berhasil dihapus",
            });
            getDriver();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal menghapus Driver",
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
        { key: "user.name", label: "Sopir" },
        { key: "deliver.name", label: "Nama Pengiriman" },
        { key: "deliver.bb", label: "BB", type: "currency" },
        { key: "deliver.tanggalJalan", label: "Tanggal keberangkatan", type: "date" },
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

                            setForm({
                                id: 0,
                                userId: "",
                                deliverId: "",
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
                                <Table columns={columns} data={driver} />
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

            <DriverModal
                isOpen={isOpen}
                onClose={closeModal}
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                mode={mode}
                users={user}
                delivery={delivery}
            />
        </>
    );
}