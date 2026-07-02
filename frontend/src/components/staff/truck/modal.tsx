import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Modal } from "@/components/ui/modal";
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
            kode: "",
            kapasitas: "",
            bb: "",
        });
    
        const onSubmit = () => {
            const newErrors = {
                kode: "",
                kapasitas: "",
                bb: "",
            };
    
            let valid = true;
    
            if (!form.kode?.trim()) {
                newErrors.kode = "kode wajib diisi";
                valid = false;
            }
            if (!form.kapasitas?.trim()) {
                newErrors.kapasitas = "kapasitas wajib diisi";
                valid = false;
            }
            if (!form.bb?.trim()) {
                newErrors.bb = "Biaya Berangkat wajib diisi";
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
                        {mode === "edit" ? "Ubah Pemasukkan Truck" : "Pembuatan Truck yang akan Berangkat"}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pembuatan Truck, untuk memasukkan data truck baru. pastikan memberikan Harga yang benar.
                    </p>
                </div>
                <div className="space-y-4 mt-6">
                    <div>
                        <Label>Kode</Label>
                        <Input name="kode"
                            value={form.kode}
                            onChange={(e) => {
                                handleChange(e);
                                setErrors((prev) => ({
                                    ...prev,
                                    kode: "",
                                }));
                            }}
                            type="text"
                            error={!!errors.kode}
                            hint={errors.kode}
                        />
                    </div>
                    <div>
                        <Label>Kapasitas</Label>
                        <Input name="kapasitas"
                            value={form.kapasitas}
                            onChange={(e) => {
                                handleChange(e);
                                setErrors((prev) => ({
                                    ...prev,
                                    kapasitas: "",
                                }));
                            }}
                            type="number"
                            error={!!errors.kapasitas}
                            hint={errors.kapasitas}
                        />
                    </div>
                    <div>
                        <Label>Biaya Berangkat</Label>
                        <Input name="bb"
                            value={form.bb}
                            onChange={(e) => {
                                handleChange(e);
                                setErrors((prev) => ({
                                    ...prev,
                                    bb: "",
                                }));
                            }}
                            placeholder="ex: 2000000"
                            type="number"
                            error={!!errors.bb}
                            hint={errors.bb}
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
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}