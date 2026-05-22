import Table from "@/components/tables/Table";
import { apiRequest } from "@/service/api.service";
import { roleData } from "@/types";
import { useEffect, useState } from "react";

const columns = [
    { key: "name", label: "Role" },
];

export default function Roles() {
    const [roles, setRoles] = useState<roleData[]>([]);
    const [loading, setLoading] = useState(true);

    const getRoles = async () => {
        try {
            setLoading(true);
            const data = await apiRequest({
                endpoint: "/roles",
            });
            console.log("DATA:", data);
            setRoles(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.error("Gagal ambil data Roles:", error);
            // toast.error("Gagal mengambil data asal produksi.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getRoles();
    }, []);

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    {
                        loading ? (
                            <p>Loading...</p>
                        ) : (
                            <Table columns={columns} data={roles} />
                        )
                    }
                </div>
            </div>
        </div>
    )
}