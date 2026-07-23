import DatePicker from "@/components/form/date-picker";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import SelectSearch from "@/components/form/SelectSearch";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { GenerateTruck, truckData } from "@/types";
import { ChevronDownIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    form: any;
    handleChange: (e: any) => void;
    handleSubmit: () => void;
    onGenerate: (trucks: GenerateTruck[]) => void;
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
    onGenerate,
    mode,
    users,
    trucks,
}: Props) {
    const [selectedTruck, setSelectedTruck] = useState<GenerateTruck[]>([]);
    const [generateError, setGenerateError] = useState("");

    const addTruck = () => {
        setSelectedTruck(prev => [
            ...prev,
            {
                truckId: 0,
                kapasitas: 0,
                bb: 0
            }
        ]);
    };

    const removeTruck = (index: number) => {
        setSelectedTruck(prev => prev.filter((_, i) => i !== index)
        );
    };

    const truckOptions = (currentIndex: number) => {
        return trucks.filter((truck) => {
            return !selectedTruck.some((selected, index) => index !== currentIndex && selected.truckId === truck.id);
        }).map((truck) => ({
            value: String(truck.id),
            label: truck.platNomor,
        })) || [];
    };

    const updateTruck = (index: number, field: keyof GenerateTruck, value: any) => {
        setSelectedTruck(prev => {
            const data = [...prev];
            data[index] = {
                ...data[index],
                [field]: value
            };
            return data;
        });

    };

    const [errors, setErrors] = useState({
        sopir1: "",
    });

    const onSubmit = () => {
        if (mode === "generate") {
            if (selectedTruck.length === 0) {
                setGenerateError("Tambahkan minimal 1 truck");
                return;
            }
            const invalid = selectedTruck.some(
                t => !t.truckId || t.kapasitas <= 0 || t.bb <= 0
            );
            if (invalid) {
                setGenerateError("Lengkapi truck, kapasitas, dan bb untuk semua baris");
                return;
            }
            setGenerateError("");
            onGenerate(selectedTruck);
            return;
        }

        const newErrors = {
            sopir1: "",
        };

        let valid = true;

        if (!form.sopir1) {
            newErrors.sopir1 = "Nama wajib diisi";
            valid = false;
        }

        setErrors(newErrors);
        if (!valid) return;
        handleSubmit();
    };

    const optionsSopir = (currentValue: string) => {
        return users
            ?.filter((s) => !s.sedangBerangkat || String(s.id) === currentValue)
            .map((s) => ({
                value: String(s.id),
                label: s.sedangBerangkat
                    ? `${s.name} (sedang berangkat)`
                    : s.name,
            })) || [];
    };

    const handleSopirChange = (field: string, value: string) => {
        handleChange({
            target: {
                name: field,
                value,
            }
        });

        setErrors((prev) => ({
            ...prev,
            sopir1: "",
        }));
    };

    const optionsPengiriman = [
        { value: "PENDING", label: "Menunggu barang penuh" },
        { value: "SIAP BERANGKAT", label: "Siap Berangkat" },
        { value: "DALAM PERJALANAN", label: "Dalam Perjalanan" },
        { value: "SELESAI", label: "Selesai" },
    ];

    const handlePengirimanChange = (value: string) => {
        handleChange({
            target: { name: "statusPengiriman", value: value },
        });
    };



    const handleTruckChange = (value: string) => {
        handleChange({
            target: { name: "truckId", value: value },
        });
    }

    // const availableTrucks =
    //     trucks?.filter(
    //         (truck) =>
    //             truck.status === "BARANG MASUK" || truck.status === "PENDING"
    //     ) || [];
    console.log("data trucks modal:", trucks);
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
                        {mode === "edit" ? "Pilih sopir untuk truck, tanggal jalan untuk keberangkatan dan status pengiriman" : "Hanya perlu memasukkan truck mana saja yang akan berangkat dan memasukkan kapasitas dan BB untuk barang cargo."}
                    </p>
                </div>
                <div className="space-y-4 mt-6">
                    <div className="space-y-4 mt-6">
                        {mode === "edit" ? (
                            <>
                                <div>
                                    <Label>Sopir 1 *</Label>
                                    <SelectSearch
                                        options={optionsSopir(String(form.sopir1 || ""))}
                                        value={String(form.sopir1 || "")}
                                        onChange={(value) => handleSopirChange("sopir1", value)}
                                        placeholder="select sopir"
                                        error={!!errors.sopir1}
                                        hint={errors.sopir1}
                                    />
                                </div>
                                <div>
                                    <Label>Sopir 2</Label>
                                    <SelectSearch
                                        options={optionsSopir(String(form.sopir2 || ""))}
                                        value={String(form.sopir2 || "")}
                                        onChange={(value) => handleSopirChange("sopir2", value)}
                                        placeholder="select sopir"
                                        className="dark:bg-dark-900"
                                    />
                                </div>
                                <div>
                                    <Label>Tanggal Keberangkatan</Label>
                                    <DatePicker
                                        id="tanggalJalan"
                                        value={form.tanggalJalan || ""}
                                        onChange={handleChange}
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
                                <div className="flex items-center justify-between">
                                    <Label className="mb-0">Daftar Truck</Label>
                                    <button
                                        type="button"
                                        onClick={addTruck}
                                        className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        Tambah Truck
                                    </button>
                                </div>

                                {selectedTruck.length === 0 && (
                                    <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-400 dark:border-gray-700">
                                        Belum ada truck ditambahkan. Klik "Tambah Truck" untuk mulai.
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {selectedTruck.map((item, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg border p-4 dark:border-gray-700"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                                    Truck {index + 1}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTruck(index)}
                                                    className="text-gray-400 hover:text-error-500 transition-colors"
                                                    aria-label="Hapus truck"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <Select
                                                options={truckOptions(index)}
                                                value={String(item.truckId || "")}
                                                placeholder="Pilih truck"
                                                onChange={(value) => updateTruck(index, "truckId", Number(value))}
                                            />

                                            <div className="grid grid-cols-2 gap-3 mt-3">
                                                <div>
                                                    <Label className="text-xs text-gray-500">Kapasitas (KG)</Label>
                                                    <Input
                                                        type="number"
                                                        value={item.kapasitas}
                                                        onChange={(e) =>
                                                            updateTruck(index, "kapasitas", Number(e.target.value))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-gray-500">BB (Rp)</Label>
                                                    <Input
                                                        type="number"
                                                        value={item.bb}
                                                        onChange={(e) =>
                                                            updateTruck(index, "bb", Number(e.target.value))
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {generateError && (
                                    <p className="text-sm text-error-500">{generateError}</p>
                                )}
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
                            onClick={onSubmit}
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