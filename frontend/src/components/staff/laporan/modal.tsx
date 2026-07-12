import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    form: any;
    handleChange: (e: any) => void;
    handleSubmit: () => void;
};

const NAMA_BULAN = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const bulanOptions = NAMA_BULAN.map((nama, index) => ({
    value: String(index + 1),
    label: nama,
}));
const tahunSekarang = new Date().getFullYear();
const tahunOptions = Array.from({ length: 6 }, (_, i) => {
    const tahun = tahunSekarang - i;
    return { value: String(tahun), label: String(tahun) };
});

export default function LaporanModal({
    isOpen,
    onClose,
    form,
    handleChange,
    handleSubmit,
}: Props) {
    const [errors, setErrors] = useState({
        bulan: "",
        tahun: "",
    });

    const handleBulanChange = (value: string) => {
        handleChange({ target: { name: "bulan", value: Number(value) } });
        setErrors((prev) => ({ ...prev, bulan: "" }));
    };

    const handleTahunChange = (value: string) => {
        handleChange({ target: { name: "tahun", value: Number(value) } });
        setErrors((prev) => ({ ...prev, tahun: "" }));
    };

    const onSubmit = () => {
        const newErrors = {
            bulan: "",
            tahun: "",
        };

        let valid = true;

        if (!form.bulan) {            
            newErrors.bulan = "Bulan wajib dipilih";
            valid = false;
        }
        if (!form.tahun) {
            newErrors.tahun = "tahun wajib diisi";
            valid = false;
        }

        setErrors(newErrors);
        if (!valid) return;
        handleSubmit();
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
                        Export Laporan Bulanan
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pilih Bulan dan tahun yang akan diexport kan
                    </p>
                </div>
                <div className="space-y-4 mt-6">
                    <div>
                        <Label>bulan *</Label>
                        <Select
                            options={bulanOptions}
                            value={form.bulan ? String(form.bulan) : ""}
                            onChange={handleBulanChange}
                            placeholder="Pilih bulan"
                            error={!!errors.bulan}
                            hint={errors.bulan}
                        />
                    </div>
                    <div>
                        <Label>tahun *</Label>
                        <Select
                            options={tahunOptions}
                            value={form.tahun ? String(form.tahun) : ""}
                            onChange={handleTahunChange}
                            placeholder="Pilih tahun"
                            error={!!errors.tahun}
                            hint={errors.tahun}
                        />
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
                            Export
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
