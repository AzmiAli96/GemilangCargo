import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import SelectSearch from "@/components/form/SelectSearch";
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
    pengiriman: any[];
};

export default function PengeluaranModal({
    isOpen,
    onClose,
    form,
    handleChange,
    handleSubmit,
    mode,
    pengiriman,
}: Props) {
    const [errors, setErrors] = useState({
        nama: "",
        kategori: "",
        nominal: "",
    });

    const onSubmit = () => {
        const newErrors = {
            nama: "",
            kategori: "",
            nominal: "",
        };

        let valid = true;

        if (!form.nama?.trim()) {
            newErrors.nama = "nama wajib diisi";
            valid = false;
        }
        if (!form.kategori?.trim()) {
            newErrors.kategori = "kategori wajib diisi";
            valid = false;
        }
        if (!form.nominal?.trim()) {
            newErrors.nominal = "nominal wajib diisi";
            valid = false;
        }
        setErrors(newErrors);
        if (!valid) return;
        handleSubmit();
    };

    const pengirimanOptions = pengiriman?.map((pengiriman) => ({
        value: String(pengiriman.id),
        label: [
            pengiriman.name ?? "No Name",
            pengiriman.tanggalJalan
                ? new Date(pengiriman.tanggalJalan).toLocaleDateString("id-ID")
                : "No Date",
        ].join(" - "),
    })) || [];

    const handlePengirimanChange = (value: string) => {
        handleChange({
            target: { name: "pengirimanId", value: value },
        });
    }

    const optionsKategori = [
        { value: "Gaji", label: "Gaji" },
        { value: "Operasional", label: "Operasional" },
        { value: "SDM", label: "SDM" },
        { value: "Pengeluaran Harian", label: "Pengeluaran Harian" },
        { value: "Pengeluaran Lainnya", label: "Pengeluaran Lainnya" },
    ];

    const handleKategoriChange = (value: string) => {
        handleChange({
            target: { name: "kategori", value: value },
        });
        setErrors((prev) => ({
            ...prev,
            kategori: "",
        }));
    };

    //     console.log("pengiriman", pengiriman);
    // console.log("options", pengirimanOptions);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-[700px] p-6 lg:p-10"
        >
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                <div>
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                        {mode === "edit" ? "Edit Pengeluaran" : "Pencatatan Pengeluaran"}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pembuatan Pesanan barang untuk pelanggan. pastikan memberikan informasi yang benar.
                    </p>
                </div>
                <div className="space-y-4 mt-6">
                    <div>
                        <Label>Nama *</Label>
                        <Input name="nama"
                            value={form.nama}
                            onChange={(e) => {
                                handleChange(e);
                                setErrors((prev) => ({
                                    ...prev,
                                    nama: "",
                                }));
                            }}
                            type="text"
                            error={!!errors.nama}
                            hint={errors.nama}
                        />
                    </div>
                    <div>
                        <Label>Pengiriman</Label>
                        <div className="relative">
                            <SelectSearch
                                options={pengirimanOptions}
                                value={String(form.pengirimanId || "")}
                                placeholder="select Pengiriman"
                                onChange={handlePengirimanChange}
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>
                    <div>
                        <Label>Kategori *</Label>
                        <div className="relative">
                            <SelectSearch
                                options={optionsKategori}
                                value={String(form.kategori || "")}
                                placeholder="select Kategori"
                                onChange={handleKategoriChange}
                                error={!!errors.kategori}
                                hint={errors.kategori}
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>
                    <div>
                        <Label>Nominal *</Label>
                        <Input name="nominal"
                            value={form.nominal}
                            onChange={(e) => {
                                handleChange(e);
                                setErrors((prev) => ({
                                    ...prev,
                                    nominal: "",
                                }));
                            }}
                            type="text"
                            error={!!errors.nominal}
                            hint={errors.nominal}
                        />
                    </div>
                    <div>
                        <Label>Keterangan *</Label>
                        <TextArea
                            name="keterangan"
                            value={form.keterangan}
                            onChange={handleChange}
                            rows={6}
                        />
                    </div>

                    <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                        {/* BUTTON */}
                        <div className="flex items-center gap-3 sm:justify-end">
                            <button
                                onClick={onClose}
                                className="flex w-full justify-center rounded-lg border px-4 py-2.5 text-sm sm:w-auto"
                            >
                                Batal
                            </button>

                            <button
                                onClick={onSubmit}
                                className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm text-white sm:w-auto"
                            >
                                Simpan
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </Modal>
    )

}