"use client"
import Pagination from "@/components/tables/Pagination";
import Table from "@/components/tables/Table";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { apiRequest } from "@/service/api.service";
import { Column, pengeluaranData, pengirimanData } from "@/types";
import { Pencil, PlusCircleIcon, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import PengeluaranModal from "./modal";

export default function Pengeluaran() {
    const [pengeluaran, setPengeluaran] = useState<pengeluaranData[]>([]);
    const [pengiriman, setPengiriman] = useState<pengirimanData[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { isOpen, openModal, closeModal } = useModal();
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [form, setForm] = useState({
        id: 0,
        pengirimanId: 0,
        nama: "",
        kategori: "",
        nominal: "",
        keterangan: "",
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

    const getPengeluaran = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await apiRequest({
                endpoint: `/pengeluaranpaginate?&page=${pageNumber}&limit=10&search=${search}`,
            });
            console.log("Data Pengeluaran", res.data.data);
            setPengeluaran(res.data.data);
            setMeta(res.data.meta);
            setLoading(false);
        } catch (error) {
            console.error("gagal mengambil data pengeluaran:", error);
        } finally {
            setLoading(false);
        }
    }

    const getPengiriman = async () => {
        try {
            const res = await apiRequest({
                endpoint: "/pengiriman",
            });
            console.log("Data Pengiriman", res.data);
            setPengiriman(res);
        } catch (error) {
            console.error("gagal mengambil data pengiriman:", error);
        }
    }

    useEffect(() => {
        getPengeluaran();
        getPengiriman();
    }, [page, search]);

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreate = async () => {
        try {
            await apiRequest({
                endpoint: "/pengeluaran",
                method: "POST",
                data: {
                    pengirimanId:
                        form.pengirimanId
                            ? Number(form.pengirimanId)
                            : null,
                    nama: form.nama,
                    nominal: Number(form.nominal),
                    kategori: form.kategori,
                    keterangan: form.keterangan,
                },
            });
            closeModal();
            setForm({
                id: 0,
                pengirimanId: 0,
                nama: "",
                kategori: "",
                nominal: "",
                keterangan: "",
            });
            setAlert({
                type: "success",
                message: "Data pengeluaran berhasil ditambahkan",
            });
            getPengeluaran();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Data pengeluaran gagal ditambahkan",
            });
            console.error("gagal menambahkan data pengeluaran:", error);
        }
    }

    const handleEdit = (row: any) => {
        setMode("edit");
        setForm({
            id: row.id,
            pengirimanId: row.pengirimanId,
            nama: row.nama,
            kategori: row.kategori,
            nominal: String(row.nominal),
            keterangan: row.keterangan,
        });
        openModal();
    };

    const handleUpdate = async () => {
        try {
            await apiRequest({
                endpoint: `/pengeluaran/${form.id}`,
                method: "PUT",
                data: {
                    ...form,
                    pengirimanId: Number(form.pengirimanId)
                }
            });

            setAlert({
                type: "success",
                message: "Pengeluaran berhasil diupdate",
            });

            closeModal();
            getPengeluaran();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal membuat update data barang Pengeluaran"
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
        const confirmDelete = confirm("Yakin mau hapus pengeluaran ini?");
        if (!confirmDelete) return;

        try {
            await apiRequest({
                endpoint: `/pengeluaran/${id}`,
                method: "DELETE",
            });

            setAlert({
                type: "success",
                message: "data Pengeluaran berhasil dihapus",
            });
            getPengeluaran();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal menghapus data Pengeluaran",
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
        { key: "id", label: "ID" },
        { key: "pengirimanId", label: "Pengiriman ID" },
        { key: "nama", label: "Nama" },
        { key: "kategori", label: "Kategori" },
        { key: "nominal", label: "Nominal", type: "currency" },
        { key: "keterangan", label: "Keterangan" },
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
                                pengirimanId: 0,
                                nama: "",
                                kategori: "",
                                nominal: "",
                                keterangan: "",
                            });

                            openModal();
                        }}
                    >
                        Pencatatan Pengeluaran
                    </Button>

                </div>
                <div className="max-w-full overflow-x-auto px-4 pb-4">
                    <div className="min-w-[1102px]">
                        {
                            loading ? (
                                <p>Loading...</p>
                            ) : (
                                <Table columns={columns} data={pengeluaran} />
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
            </div >

            <PengeluaranModal
                isOpen={isOpen}
                onClose={closeModal}
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                mode={mode}
                pengiriman={pengiriman}
            />
        </>
    )
}