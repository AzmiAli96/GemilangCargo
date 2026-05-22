import Label from "@/components/form/Label";
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
    users: any[];
    delivery: any[];
};

export default function DriverModal({
    isOpen,
    onClose,
    form,
    handleChange,
    handleSubmit,
    mode,
    users,
    delivery
}: Props) {
    const optionsUsers = users?.filter((user) => user.roleId === 3).map((user) => ({
        value: String(user.id),
        label: user.name,
    })) || [];

    const handleUserChange = (value: string) => {
        handleChange({
            target: {
                name: "userId",
                value: value,
            },
        });
    };

    const optionsDelivery = delivery?.map((deliver) => ({
        value: String(deliver.id),
        label: `${deliver.name} - ${deliver.tanggalJalan
            ? new Date(deliver.tanggalJalan).toLocaleDateString("id-ID")
            : "No Date"}`,
        tanggalJalan: deliver.tanggalJalan,
    })) || [];


    const handleDeliveryChange = (value: string) => {
        handleChange({
            target: {
                name: "deliverId",
                value: value,
            },
        });
    };
    // console.log("DELIVERY MASUK MODAL:", delivery);
    // console.log("OPTIONS DELIVERY:", optionsDelivery);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-[700px] p-6 lg:p-10"
        >
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                <div>
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                        {mode === "edit" ? "Edit Driver" : "Add Driver"}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pembuatan sopir pengiriman. pastikan memberikan Harga yang benar.
                    </p>
                </div>
                <div className="space-y-4 mt-6">
                    <div>
                        <Label>Customer / user</Label>
                        <div className="relative">
                            <SelectSearch
                                options={optionsUsers}
                                value={String(form.userId) || ""}
                                placeholder="select customer"
                                onChange={handleUserChange}
                                className="dark:bg-dark-900"
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>
                    <div>
                        <Label>Tanggal Pengiriman</Label>
                        <div className="relative">
                            <SelectSearch
                                options={optionsDelivery}
                                value={String(form.deliverId) || ""}
                                placeholder="select delivery"
                                onChange={handleDeliveryChange}
                                className="dark:bg-dark-900"
                            />
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