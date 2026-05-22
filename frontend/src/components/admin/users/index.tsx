import Table from "@/components/tables/Table";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { apiRequest } from "@/service/api.service";
import { userData } from "@/types";
import { Pencil, PlusCircleIcon, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import UserModal from "./Modal";
import Alert from "@/components/ui/alert/Alert";
import Pagination from "@/components/tables/Pagination";

export default function Users() {
    const [users, setUsers] = useState<userData[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, openModal, closeModal } = useModal();
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [search, setSearch] = useState("");

    const [meta, setMeta] = useState({
        total: 0,
        page: 1,
        lastPage: 1,
    });

    const [alert, setAlert] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const [form, setForm] = useState({
        id: 0,
        name: "",
        email: "",
        alamat: "",
        noTelp: "",
        roleId: "",
    });

    const getUsers = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await apiRequest({
                endpoint: `/users?page=${pageNumber}&limit=10&search=${search}`,
            });

            console.log("FULL RESPONSE:", res);
            console.log("ARRAY USERS:", res.data.data);
            setUsers(res.data.data);
            setMeta(res.data.meta);
        } catch (error) {
            console.error("Gagal ambil data Users:", error);
            // toast.error("Gagal mengambil data asal produksi.");
        } finally {
            setLoading(false);
        }
    }

    const getRoles = async () => {
        try {
            const res = await apiRequest({
                endpoint: "/roles",
            });
            console.log("Role:", res);
            setRoles(res.data);
        } catch (error) {
            console.error("Gagal ambil roles:", error);
        }
    };

    useEffect(() => {
        getUsers(1);
        getRoles();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm("Yakin mau hapus user ini?");
        if (!confirmDelete) return;

        try {
            await apiRequest({
                endpoint: `/users/${id}`,
                method: "DELETE",
            });

            setAlert({
                type: "success",
                message: "User berhasil dihapus",
            });
            getUsers(); // refresh data
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal membuat user",
            });
            console.error("Gagal delete:", error);
        }
    };

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreate = async () => {
        try {
            await apiRequest({
                endpoint: "/register",
                method: "POST",
                data: {
                    ...form,
                    roleId: Number(form.roleId),
                },
            });

            closeModal();
            setForm({
                id: 0,
                name: "",
                email: "",
                alamat: "",
                noTelp: "",
                roleId: "",
            });

            setAlert({
                type: "success",
                message: "User berhasil dibuat",
            });
            console.log("EMAIL:", form.email);

            getUsers(); // refresh
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal membuat user",
            });
            console.error("Gagal create:", error);
        }
    };

    const handleEdit = (row: any) => {
        setMode("edit");

        setForm({
            id: row.id,
            name: row.name || "",
            email: row.email || "",
            alamat: row.alamat || "",
            noTelp: row.noTelp || "",
            roleId: String(row.roleId || ""),
        });

        openModal();
    };


    const handleUpdate = async () => {
        try {
            await apiRequest({
                endpoint: `/users/${form.id}`,
                method: "PUT",
                data: {
                    ...form,
                    email: form.email || undefined,
                    roleId: Number(form.roleId),
                },
            });

            setAlert({
                type: "success",
                message: "User berhasil diupdate",
            });

            closeModal();
            getUsers();
        } catch (error) {
            setAlert({
                type: "error",
                message: "Gagal update user",
            });
            console.error("Gagal update:", error);
        }
    };

    const handleSubmit = async () => {
        if (mode === "create") {
            await handleCreate();
        } else {
            await handleUpdate();
        }
    };

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [alert]);

    useEffect(() => {
        const delay = setTimeout(() => {
            getUsers(1);
        }, 500);

        return () => clearTimeout(delay);
    }, [search]);


    const columns = [
        { key: "name", label: "Nama / Toko" },
        { key: "email", label: "Email" },
        { key: "alamat", label: "Alamat" },
        { key: "noTelp", label: "No. Telepon" },
        { key: "role.name", label: "Role" },
        {
            key: "action",
            label: "Action",
            render: (row: any) => (
                <div className="flex gap-2">

                    {/* EDIT */}
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                    >
                        <Pencil size={16} />
                    </button>

                    {/* DELETE */}
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                    >
                        <Trash2 size={16} />
                    </button>

                </div>
            ),
        },
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

                    {/* 🔍 SEARCH (KIRI) */}
                    <div className="hidden lg:block">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                                    <Search />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search nama, email, atau no telp..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                    }}
                                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 xl:w-[430px]"
                                />
                            </div>
                        </form>
                    </div>

                    {/* ➕ CREATE (KANAN) */}
                    <Button
                        size="sm"
                        variant="primary"
                        endIcon={<PlusCircleIcon />}
                        onClick={() => {
                            setMode("create");

                            setForm({
                                id: 0,
                                name: "",
                                email: "",
                                alamat: "",
                                noTelp: "",
                                roleId: "",
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
                                <Table columns={columns} data={users} />
                            )
                        }
                    </div>
                </div>
                <div className="flex justify-end mt-6 pr-4">
                    <Pagination
                        currentPage={meta.page}
                        totalPages={meta.lastPage}
                        onPageChange={(page) => getUsers(page)}
                    />
                </div>
            </div>

            <UserModal
                isOpen={isOpen}
                onClose={closeModal}
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                mode={mode}
                roles={roles}
            />
        </>
    );
}