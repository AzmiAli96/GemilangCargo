import Pagination from "@/components/tables/Pagination";
import Table from "@/components/tables/Table";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { apiRequest } from "@/service/api.service";
import { Column, priceData } from "@/types";
import { Pencil, PlusCircleIcon, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import PriceModal from "./Modal";
import Alert from "@/components/ui/alert/Alert";

export default function Price() {
    const [price, setPrice] = useState<priceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { isOpen, openModal, closeModal } = useModal();
    const [mode, setMode] = useState<"create" | "edit">("create");

    const [form, setForm] = useState({
        id: 0,
        provinsi: "",
        kota: "",
        hargaTarif: ""
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

    const getPrice = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await apiRequest({
                endpoint: `/price?page=${pageNumber}&limit=10&search=${search}`
            });

            console.log("Data Full Price:", res);
            console.log("Array Price:", res.data);
            setPrice(res.data.data);
            setMeta(res.data.meta)
        } catch (error) {
            console.error("gagal dapat data price:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPrice(page);
    }, [page, search]);

    useEffect(() => {
        const delay = setTimeout(() => {
            getPrice(1);
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
                endpoint: "/price",
                method: "POST",
                data: {
                    ...form,
                },
            });

            closeModal();
            setForm({
                id: 0,
                provinsi: "",
                kota: "",
                hargaTarif: "",
            });

            setAlert({
                type: "success",
                message: "Price berhasil dibuat",
            });
            getPrice();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal membuat price"
            });
            console.error("console.error", error);
        }
    }

    const handleEdit = (row: any) => {
        setMode("edit");

        setForm({
            id: row.id,
            provinsi: row.provinsi || "",
            kota: row.kota || "",
            hargaTarif: row.hargaTarif || "",
        });

        openModal();
    };

    const handleUpdate = async () => {
        try {
            await apiRequest({
                endpoint: `/price/${form.id}`,
                method: "PUT",
                data: {
                    ...form,
                }
            });

            setAlert({
                type: "success",
                message: "Price berhasil diupdate",
            });

            closeModal();
            getPrice();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal membuat update data price"
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
                endpoint: `/price/${id}`,
                method: "DELETE",
            });

            setAlert({
                type: "success",
                message: "price berhasil dihapus",
            });
            getPrice();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal menghapus price",
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
        { key: "provinsi", label: "Provinsi" },
        { key: "kota", label: "Kota" },
        { key: "hargaTarif", label: "Harga Wilayah", type: "currency", },
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
                                provinsi: "",
                                kota: "",
                                hargaTarif: "",
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
                                <Table columns={columns} data={price} />
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

            <PriceModal
                isOpen={isOpen}
                onClose={closeModal}
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                mode={mode}
            />
        </>
    );

}