import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import SelectSearch from "@/components/form/SelectSearch";
import { Modal } from "@/components/ui/modal";
import { ChevronDownIcon } from "lucide-react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    form: any;
    handleChange: (e: any) => void;
    handleSubmit: () => void;
};

export default function OrderStatusModal({
    isOpen,
    onClose,
    form,
    handleChange,
    handleSubmit,
}: Props) {

    const optionsPembayaran = [
        { value: "Lunas", label: "Lunas" },
        { value: "Belum Lunas", label: "Belum Lunas" },
    ];

    const handlePembayaranChange = (value: string) => {
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
                        Edit Status Pembayaran Order
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pembuatan Orderan untuk customer. pastikan memberikan informasi yang benar.
                    </p>
                </div>
                <div className="space-y-4 mt-6">
                    <div>
                        <Label>No SPB</Label>
                        <Input name="noSpb"
                            value={form.noSpb}
                            onChange={handleChange}
                            type="text"
                        />
                    </div>
                    <div>
                        <Label>Status Pembayaran</Label>
                        <div className="relative">
                            <Select
                                options={optionsPembayaran}
                                value={String(form.status || "")}
                                placeholder="Select Status Pembayaran"
                                onChange={handlePembayaranChange}
                                className="dark:bg-dark-900"
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 flex-wrap gap-3">

                        {/* BUTTON */}
                        <div className="flex items-center gap-3 sm:justify-end">
                            <button
                                onClick={onClose}
                                className="flex w-full justify-center rounded-lg border px-4 py-2.5 text-sm sm:w-auto"
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm text-white sm:w-auto"
                            >
                                Simpan
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </Modal>
    );
}