import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { Modal } from "@/components/ui/modal";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    form: any;
    handleChange: (e: any) => void;
    handleSubmit: () => void;
    mode: "create" | "edit";
};

export default function TruckModal({
    isOpen,
    onClose,
    form,
    handleChange,
    handleSubmit,
    mode,
}: Props) {
    const [errors, setErrors] = useState({
        platNomor: "",
    });

    const onSubmit = () => {
        const newErrors = {
            platNomor: "",
        };

        let valid = true;

        if (!form.platNomor?.trim()) {
            newErrors.platNomor = "platNomor wajib diisi";
            valid = false;
        }

        setErrors(newErrors);
        if (!valid) return;
        handleSubmit();
    };

    const optionsStatus = [
        { value: "AKTIF", label: "Aktif" },
        { value: "SERVIS", label: "Service" },
        { value: "RUSAK", label: "Rusak" },
        { value: "NON AKTIF", label: "Non Aktif" },
    ];

    const handleStatusChange = (value: string) => {
        handleChange({
            target: { name: "status", value: value },
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-[700px] p-6 lg:p-10"
        >
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                <div>
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                        {mode === "edit" ? "Ubah Pemasukkan Truck" : "Pembuatan Truck yang akan Berangkat"}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pembuatan Truck, untuk memasukkan data truck baru. pastikan memberikan Harga yang benar.
                    </p>
                </div>
                <div className="space-y-4 mt-6">
                    <div>
                        <Label>Plat Nomor Truck *</Label>
                        <Input name="platNomor"
                            value={form.platNomor}
                            onChange={(e) => {
                                handleChange(e);
                                setErrors((prev) => ({
                                    ...prev,
                                    platNomor: "",
                                }));
                            }}
                            type="text"
                            error={!!errors.platNomor}
                            hint={errors.platNomor}
                        />
                    </div>
                    <div>
                        <Label>Kondisi</Label>
                        <Input name="kondisi"
                            value={form.kondisi}
                            onChange={handleChange}
                            type="text"
                        />
                    </div>
                    {mode === "edit" && (
                        <div>
                            <Label>Status Truck</Label>
                            <div className="relative">
                                <Select
                                    options={optionsStatus}
                                    value={String(form.status) || ""}
                                    placeholder="Select Status Truck"
                                    onChange={handleStatusChange}
                                    className="dark:bg-dark-900"
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                        <button
                            onClick={onClose}
                            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                        >
                            Batal
                        </button>

                        <button
                            onClick={onSubmit}
                            className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}