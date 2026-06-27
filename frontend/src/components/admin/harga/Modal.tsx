import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Modal } from "@/components/ui/modal";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    form: any;
    handleChange: (e: any) => void;
    handleSubmit: () => void;
    mode: "create" | "edit";
};

export default function HargaModal({
    isOpen,
    onClose,
    form,
    handleChange,
    handleSubmit,
    mode,
}: Props) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-[700px] p-6 lg:p-10"
        >
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                <div>
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                        {mode === "edit" ? "Edit Harga Tarif Wilayah" : "Add Harga Tarif Wilayah"}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pembuatan Harga / harga Wilayah. pastikan memberikan Harga yang benar.
                    </p>
                </div>
                <div className="space-y-4 mt-6">
                    <div>
                        <Label>Provinsi</Label>
                        <Input name="provinsi"
                            value={form.provinsi}
                            onChange={handleChange}
                            type="text"
                        />
                    </div>
                    <div>
                        <Label>Kota</Label>
                        <Input name="kota"
                            value={form.kota}
                            onChange={handleChange}
                            type="text"
                        />
                    </div>
                    <div>
                        <Label>Harga Tarif Wilayah</Label>
                        <Input name="hargaTarif"
                            value={form.hargaTarif}
                            onChange={handleChange}
                            placeholder="ex: 2000"
                            type="number"
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
                            onClick={handleSubmit}
                            className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
