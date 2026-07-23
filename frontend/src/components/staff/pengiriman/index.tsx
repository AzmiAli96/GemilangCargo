"use client"

import Pagination from "@/components/tables/Pagination";
import Table from "@/components/tables/Table";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { apiRequest } from "@/service/api.service";
import { Column, GenerateTruck, pengirimanData, truckData, userData } from "@/types";
import { Package, Pencil, PlusCircleIcon, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PengirimanModal from "./Modal";
import Badge from "@/components/ui/badge/Badge";

export default function Pengiriman() {
    const [pengiriman, setPengiriman] = useState<pengirimanData[]>([]);
    const [truck, setTruck] = useState<truckData[]>([]);
    const [user, setUser] = useState<userData[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { isOpen, openModal, closeModal } = useModal();
    const [mode, setMode] = useState<"generate" | "edit">("generate");
    const router = useRouter();

    const [form, setForm] = useState({
        id: 0,
        sopir1: "",
        sopir2: "",
        truckId: "",
        name: "",
        kapasitas: "",
        bb: "",
        totalHarga: "",
        totalBerat: "",
        tanggalJalan: "",
        statusPengiriman: "",
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

    const getPengiriman = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await apiRequest({
                endpoint: `/pengirimanpaginate?page=${pageNumber}&limit=10&search=${search}`
            });
            console.log("Data Full pengiriman:", res.data.data);
            console.log("Array pengiriman:", res.data);
            setPengiriman(res.data.data);
            setMeta(res.meta);

        } catch (error) {
            console.error("gagal dapat data Pengiriman:", error);
        } finally {
            setLoading(false);
        }
    }
    const getUsers = async (pengirimanId?: number) => {
        try {
            const query = pengirimanId ? `?pengirimanId=${pengirimanId}` : "";
            const res = await apiRequest({
                endpoint: `/sopir${query}`
            });
            console.log("Users:", res);
            setUser(res.data);
        } catch (error) {
            console.error("Gagal ambil users:", error);
        }
    }

    const getTrucks = async () => {
        try {
            const res = await apiRequest({
                endpoint: "/truck-ada"
            });
            console.log("Data Full Truck:", res.data);
            setTruck(res.data);
        } catch (error) {
            console.error("gagal dapat data Truck:", error);
        }
    }

    useEffect(() => {
        getPengiriman(page);
        getUsers();
        getTrucks();
        // getDeliverySummary();
    }, [page, search]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: name === "bb" ? Number(value) : value,
        });

    };

    const handleGenerate = async (trucks: GenerateTruck[]) => {
        try {
            const payload = {
                truckList: trucks,
                tanggalJalan: form.tanggalJalan
                    ? new Date(form.tanggalJalan).toISOString()
                    : null,
            };

            console.log("PAYLOAD:", payload);


            await apiRequest({
                endpoint: "/pengiriman/generate",
                method: "POST",
                data: payload,
            });

            await getPengiriman();
            await getTrucks();

            closeModal();
            setForm({
                id: 0,
                truckId: "",
                sopir1: "",
                sopir2: "",
                name: "",
                kapasitas: "",
                bb: "",
                totalHarga: "",
                totalBerat: "",
                tanggalJalan: "",
                statusPengiriman: "",
            });

            setAlert({
                type: "success",
                message: "Generate pengiriman berhasil",
            });
            getPengiriman();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Generate pengiriman gagal",
            });
            console.error("console.error", error);
        }
    }

    const handleEdit = (row: any) => {
        setMode("edit");

        setForm({
            id: row.id,
            sopir1: row.sopir?.[0]?.id || "",
            sopir2: row.sopir?.[1]?.id || "",
            truckId: row.truckId || "",
            name: row.name || "",
            kapasitas: row.kapasitas || "",
            bb: row.bb || "",
            totalHarga: row.totalHarga || "",
            totalBerat: row.totalBerat || "",
            tanggalJalan: row.tanggalJalan || new Date(),
            statusPengiriman: row.statusPengiriman || "",
        });

        getUsers(row.id);
        openModal();
    };

    const handleUpdate = async () => {
        try {
            const payload = {
                id: form.id,
                truckId: Number(form.truckId),
                name: form.name,
                totalHarga: Number(form.totalHarga),
                totalBerat: Number(form.totalBerat),
                tanggalJalan: form.tanggalJalan,
                statusPengiriman: form.statusPengiriman,
                sopirIds: [
                    form.sopir1 && Number(form.sopir1),
                    form.sopir2 && Number(form.sopir2),
                ].filter(Boolean),
            };
            console.log("payload", payload);

            await apiRequest({
                endpoint: `/pengiriman/${form.id}`,
                method: "PUT",
                data: payload
            });

            setAlert({
                type: "success",
                message: "Pengiriman berhasil diupdate",
            });

            closeModal();
            getPengiriman();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal membuat update data Pengiriman"
            });
            console.error("console.error", error);
        }
    }

    const handleSubmit = async () => {
        await handleUpdate();
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm("Yakin mau hapus Data ini?");
        if (!confirmDelete) return;

        try {
            await apiRequest({
                endpoint: `/pengiriman/${id}`,
                method: "DELETE",
            });

            setAlert({
                type: "success",
                message: "Pengiriman berhasil dihapus",
            });
            getPengiriman();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal menghapus Pengiriman",
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

        { key: "id", label: "ID" }, {
            key: "sopir",
            label: "Sopir",
            render: (row: any) => {
                if (!row.sopir || row.sopir.length === 0) {
                    return "-";
                }
                return row.sopir.map(
                    (user: any) => user.name
                ).join(" / ");
            },
        },
        { key: "truck.platNomor", label: "Truck" },
        { key: "kapasitas", label: "Kapasitas", type: "weight" },
        { key: "totalBerat", label: "Total Berat", type: "weight" },
        { key: "bb", label: "Biaya Berangkat", type: "currency" },
        { key: "totalHarga", label: "Total Harga", type: "currency" },
        { key: "tanggalJalan", label: "Tanggal Jalan", type: "date" },
        { key: "statusPengiriman", label: "Status Pengiriman" },
        {
            key: "statusLunas",
            label: "Status",
            render: (row: any) => {
                if (!row.pesanan || row.pesanan.length === 0) {
                    return "-";
                }
                const semuaLunas = row.pesanan.every(
                    (p: any) => p.statusPay === "Lunas"
                );
                return semuaLunas ? (
                    <Badge variant="light" color="success">
                        Lunas
                    </Badge>
                ) : (
                    <Badge variant="light" color="error">
                        Belum Lunas
                    </Badge>
                );;
            },
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
                    <button
                        onClick={() => router.push(`/pengiriman/${row.id}`)}
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
                            setMode("generate");

                            setForm({
                                id: 0,
                                truckId: "",
                                sopir1: "",
                                sopir2: "",
                                name: "",
                                kapasitas: "",
                                bb: "",
                                totalHarga: "",
                                totalBerat: "",
                                tanggalJalan: "",
                                statusPengiriman: "",
                            });

                            openModal();
                        }}
                    >
                        Pembuatan Pengiriman Barang / Generate Pengiriman
                    </Button>

                </div>
                <div className="max-w-full overflow-x-auto px-4 pb-4">
                    <div className="min-w-[1102px]">
                        {
                            loading ? (
                                <p>Loading...</p>
                            ) : (
                                <Table columns={columns} data={pengiriman} />
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

            <PengirimanModal
                isOpen={isOpen}
                onClose={closeModal}
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                onGenerate={handleGenerate}
                mode={mode}
                users={user}
                trucks={truck}
            />
        </>
    )

}