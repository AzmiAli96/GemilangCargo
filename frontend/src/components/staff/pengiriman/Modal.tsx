import DatePicker from "@/components/form/date-picker";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { Modal } from "@/components/ui/modal";
import { ChevronDownIcon } from "lucide-react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    form: any;
    handleChange: (e: any) => void;
    handleSubmit: () => void;
    mode: "generate" | "edit";
    users: any[];
    trucks: any[];
};

export default function PengirimanModal({
    isOpen,
    onClose,
    form,
    handleChange,
    handleSubmit,
    mode,
    users,
    trucks,
}: Props) {
    const optionsSopir = users?.filter((user) => user.roleId === 3).map((user) => ({
        value: String(user.id),
        label: user.name,
    })) || [];

    const handleSopirChange = (field: string, value: string) => {
        handleChange({
            target: {
                name: field,
                value,
            }
        });
    };

    const optionsPengiriman = [
        { value: "SIAP BERANGKAT", label: "Siap Berangkat" },
        { value: "DALAM PERJALANAN", label: "Dalam Perjalanan" },
        { value: "SELESAI", label: "Selesai" },
    ];

    const handlePengirimanChange = (value: string) => {
        handleChange({
            target: { name: "statusPengiriman", value: value },
        });
    };

    const availableTrucks =
        trucks?.filter(
            (truck) =>
                truck.status === "BARANG MASUK" || truck.status === "PENDING"
        ) || [];
    // console.log("data trucks modal:", trucks);
    // console.log("available:", availableTrucks);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-[700px] p-6 lg:p-10"
        >
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                <div>
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                        {mode === "edit" ? "Edit Pengiriman Barang" : "Generate Pengiriman Barang"}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pembuatan Pengiriman Barang. pastikan memberikan informasi yang benar.
                    </p>
                </div>
                <div className="space-y-4 mt-6">
                    <div className="space-y-4 mt-6">
                        {mode === "edit" ? (
                            <>
                                <div>
                                    <Label>Sopir 1</Label>
                                    <Select
                                        options={optionsSopir}
                                        value={String(form.sopir1 || "")}
                                        onChange={(value) => handleSopirChange("sopir1", value)}
                                        placeholder="select sopir"
                                        className="dark:bg-dark-900"
                                    />
                                </div>
                                <div>
                                    <Label>Sopir 2</Label>
                                    <Select
                                        options={optionsSopir}
                                        value={String(form.sopir2 || "")}
                                        onChange={(value) => handleSopirChange("sopir2", value)}
                                        placeholder="select sopir"
                                        className="dark:bg-dark-900"
                                    />
                                </div>
                                <div>
                                    <Label>Status Pengiriman</Label>
                                    <div className="relative">
                                        <Select
                                            options={optionsPengiriman}
                                            value={String(form.statusPengiriman) || ""}
                                            placeholder="Select Status Pengiriman"
                                            onChange={handlePengirimanChange}
                                            className="dark:bg-dark-900"
                                        />
                                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                    <p className="mb-3">
                                        Sistem akan melakukan generate pengiriman berdasarkan:
                                    </p>

                                    <ul className="list-disc pl-5 text-sm">
                                        <li>Kapasitas truck</li>
                                        <li>Biaya berangkat (BB)</li>
                                        <li>Prioritas pesanan</li>
                                        <li>Status pesanan yang dapat diproses</li>
                                    </ul>
                                </div>

                                <div className="mt-4 space-y-3">
                                    {availableTrucks.map((truck) => (
                                        <div
                                            key={truck.id}
                                            className="rounded-lg border p-3"
                                        >
                                            <p>
                                                <strong>{truck.kode}</strong>
                                            </p>

                                            <p>
                                                Kapasitas:
                                                {" "}
                                                {Number(truck.kapasitas).toLocaleString("id-ID")} KG
                                            </p>

                                            <p>
                                                BB:
                                                {" "}
                                                Rp {Number(truck.bb).toLocaleString("id-ID")}
                                            </p>
                                            <p>
                                                Status: {truck.status}
                                            </p>
                                        </div>
                                    ))}

                                    {availableTrucks.length === 0 && (
                                        <p>Tidak ada truck yang tersedia.</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                        <button
                            onClick={onClose}
                            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                        >
                            Batal
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                        >
                            {mode === "edit"
                                ? "Simpan Perubahan"
                                : "Generate Pengiriman"}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}