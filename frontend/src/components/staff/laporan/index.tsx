"use client"
import Pagination from "@/components/tables/Pagination";
import Table from "@/components/tables/Table";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { apiRequest } from "@/service/api.service";
import { Column, pengirimanData } from "@/types";
import { Pencil, PlusCircleIcon, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import LaporanModal from "./modal";

export default function Laporan() {
    const [laporan, setLaporan] = useState<pengirimanData[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { isOpen, openModal, closeModal } = useModal();
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [form, setForm] = useState({
        bulan: "",
        tahun: "",
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

    const getLaporan = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await apiRequest({
                endpoint: `/laporan/ringkasan-bulanan`,
                method: "GET",
            });
            setLaporan(res.data);
        } catch (error) {
            setAlert({
                type: "error",
                message: "Terjadi Kesalahan saat mengambil data Laporan"
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getLaporan(page);
    }, [page, search]);

    useEffect(() => {
        const delay = setTimeout(() => {
            getLaporan(1);
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
            const res = await apiRequest({
                endpoint: `/laporan/export-bulanan?bulan=${form.bulan}&tahun=${form.tahun}`,
                method: "GET",
                responseType: "blob",
            });

            const blob = new Blob([res.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Laporan-${form.bulan}-${form.tahun}.xlsx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            closeModal();
            setForm({
                bulan: "",
                tahun: ""
            });
            setAlert({
                type: "success",
                message: "Laporan berhasil ditambahkan"
            });
            getLaporan();
        } catch (error: any) {
            setAlert({
                type: "error",
                message: "Terjadi Kesalahan saat export Laporan"
            });
        }
    }
    const handleSubmit = async () => {
        await handleCreate();
    }

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm("Yakin mau hapus user ini?");
        if (!confirmDelete) return;

        try {
            await apiRequest({
                endpoint: `/laporan/${id}`,
                method: "DELETE",
            });

            setAlert({
                type: "success",
                message: "Laporan berhasil dihapus",
            });
            getLaporan();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal menghapus Laporan",
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
        { key: "bulan", label: "Bulan" },
        { key: "totalPendapatan", label: "Total Pendapatan", type: "currency" },
        { key: "totalBb", label: "Total BB", type: "currency" },
        { key: "totalPengeluaran", label: "Total Pengeluaran", type: "currency" },
        { key: "totalLaba", label: "Total Laba", type: "currency" },
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
                                bulan: "",
                                tahun: ""
                            });

                            openModal();
                        }}
                    >
                        Export Laporan Bulanan
                    </Button>

                </div>
                <div className="max-w-full overflow-x-auto px-4 pb-4">
                    <div className="min-w-[1102px]">
                        {
                            loading ? (
                                <p>Loading...</p>
                            ) : (
                                <Table columns={columns} data={laporan} />
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

            <LaporanModal
                isOpen={isOpen}
                onClose={closeModal}
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </>
    );
}
