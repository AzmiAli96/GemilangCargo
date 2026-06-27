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
    mode: "create" | "edit";
    users: any[];
};

export default function OrderCustomModal({
    isOpen,
    onClose,
    form,
    handleChange,
    handleSubmit,
    mode,
    users,
}: Props) {
    const optionsUsers = users?.map((user) => ({
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

    const optionsPembayaran = [
        { value: "Lunas", label: "Lunas" },
        { value: "Belum Lunas", label: "Belum Lunas" },
    ];

    const handlePembayaranChange = (value: string) => {
        handleChange({
            target: { name: "statusPembayaran", value: value },
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
                        {mode === "edit" ? "Edit User" : "Add User"}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pembuatan Pesanan Khusus untuk customer. pastikan memberikan informasi yang benar.
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
                        <Label>Pelanggan / user</Label>
                        <div className="relative">
                            <SelectSearch
                                options={optionsUsers}
                                value={String(form.userId || "")}
                                placeholder="select pelanggan"
                                onChange={handleUserChange}
                                className="dark:bg-dark-900"
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>
                    <div>
                        <Label>KOLI</Label>
                        <Input name="koli"
                            value={form.koli}
                            onChange={handleChange}
                            type="text"
                        />
                    </div>
                    <div>
                        <Label>Berat</Label>
                        <Input name="berat"
                            value={form.berat}
                            onChange={handleChange}
                            type="text"
                        />
                    </div>
                    <div>
                        <Label>Harga</Label>
                        <Input name="hargaCustom"
                            value={form.hargaCustom}
                            onChange={handleChange}
                            type="number"
                        />
                    </div>
                    <div>
                        <Label>Alamat Tujuan</Label>
                        <Input name="tujuan"
                            value={form.tujuan}
                            onChange={handleChange}
                            placeholder="ex: Jl. example "
                            type="text"
                        />
                    </div>
                    {mode === "edit" && (
                        <div>
                            <Label>Status Pembayaran</Label>
                            <div className="relative">
                                <Select
                                    options={optionsPembayaran}
                                    value={String(form.statusPay || "")}
                                    placeholder="Select Status Pembayaran"
                                    onChange={handlePembayaranChange}
                                    className="dark:bg-dark-900"
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                        </div>
                    )}
                    <div>
                        <Label>Keterangan</Label>
                        <TextArea
                            name="ket"
                            value={form.ket}
                            onChange={handleChange}
                            rows={6}
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