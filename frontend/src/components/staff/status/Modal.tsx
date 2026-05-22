
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
    mode: "create" | "edit";
    delivery: any[];
};

export default function StatusModal({
    isOpen,
    onClose,
    form,
    handleChange,
    handleSubmit,
    mode,
    delivery
}: Props) {

    const optionsPengiriman = [
        { value: "PERSIAPAN", label: "Persiapan" },
        { value: "DALAM PERJALANAN", label: "Dalam Perjalanan" },
        { value: "SELESAI", label: "Selesai" },
    ];

    const handlePengirimanChange = (value: string) => {
        handleChange({
            target: { name: "statusPengiriman", value: value },
        });
    };

    const optionsDelivery = delivery?.map((deliver) => ({
        value: String(deliver.id),
        label: [
            deliver.name ?? "No Name",
            deliver.tanggalJalan
                ? new Date(deliver.tanggalJalan).toLocaleDateString("id-ID")
                : "No Date",
        ].join(" - "),
    })) || [];

    const handleDeliveryChange = (value: string) => {
        handleChange({
            target: {
                name: "deliverId",
                value: value,
            },
        });
    };

    // console.log("form.deliverId", form.deliverId);
    // console.log("form.statusPengiriman", form.statusPengiriman);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-[700px] p-6 lg:p-10"
        >
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                <div>
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                        {mode === "edit" ? "Edit Status Pengiriman" : "Add Status Pengiriman"}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pengaturan Status Delivery / pengiriman. pastikan memberikan informasi yang benar.
                    </p>
                </div>
                <div className="space-y-4 mt-6">
                    <div>
                        <Label>Pengiriman yang dilakukan</Label>
                        <div className="relative">
                            <SelectSearch
                                options={optionsDelivery}
                                value={String(form.deliverId) || ""}
                                placeholder="select delivery"
                                onChange={handleDeliveryChange}
                                className="dark:bg-dark-900"
                            />
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
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>
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