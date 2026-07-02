import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
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
    users: any[];
    hargas: any[];
};

export default function OrderModal({
    isOpen,
    onClose,
    form,
    handleChange,
    handleSubmit,
    mode,
    users,
    hargas
}: Props) {
    const [errors, setErrors] = useState({
        noSpb: "",
        userId: "",
        koli: "",
        berat: "",
        hargaId: "",
        tujuan: "",
    });

    const onSubmit = () => {
        const newErrors = {
            noSpb: "",
            userId: "",
            koli: "",
            berat: "",
            hargaId: "",
            tujuan: "",
        };

        let valid = true;

        if (!form.noSpb?.trim()) {
            newErrors.noSpb = "noSpb wajib diisi";
            valid = false;
        }
        if (!form.userId) {
            newErrors.userId = "Pelanggan wajib diisi";
            valid = false;
        }
        if (!form.koli?.trim()) {
            newErrors.koli = "Koli wajib diisi";
            valid = false;
        }
        if (!form.berat?.trim()) {
            newErrors.berat = "Berat wajib diisi";
            valid = false;
        }
        if (!form.hargaId) {
            newErrors.hargaId = "Harga wajib diisi";
            valid = false;
        }
        if (!form.tujuan?.trim()) {
            newErrors.tujuan = "Tujuan wajib diisi";
            valid = false;
        }

        setErrors(newErrors);
        if (!valid) return;
        handleSubmit();
    };

    const optionsUsers = users
        ?.filter((user) => user.roleId === 2 || user.roleId === 4)
        .map((user) => ({
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

        setErrors((prev) => ({
            ...prev,
            userId: "",
        }));
    };

    const optionsHargas = hargas?.map((harga) => ({
        value: String(harga.id),
        label: [
            harga.kota ?? "NO Kota",
            harga.hargaTarif
                ? new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                }).format(Number(harga.hargaTarif))
                : "Harga Kosong / belum terisi",
        ].join(" - "),
        hargaTarif: harga.hargaTarif,
    })) || [];

    const handleHargaChange = (value: string) => {
        handleChange({
            target: {
                name: "hargaId",
                value: value,
            },
        });
        setErrors((prev) => ({
            ...prev,
            hargaId: "",
        }));
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

    const selectedHarga = optionsHargas.find(
        (p) => p.value == form.hargaId
    );

    console.log("form.hargaId", form.hargaId);
    // console.log("optionsUsers", optionsUsers);

    const total =
        Number(form.berat || 0) *
        Number(selectedHarga?.hargaTarif || 0);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-[700px] p-6 lg:p-10"
        >
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                <div>
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                        {mode === "edit" ? "Edit Order" : "Add Order"}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pembuatan Pesanan barang untuk pelanggan. pastikan memberikan informasi yang benar.
                    </p>
                </div>
                <div className="space-y-4 mt-6">
                    <div>
                        <Label>No SPB *</Label>
                        <Input name="noSpb"
                            value={form.noSpb}
                            onChange={(e) => {
                                handleChange(e);
                                setErrors((prev) => ({
                                    ...prev,
                                    noSpb: "",
                                }));
                            }}
                            type="text"
                            error={!!errors.noSpb}
                            hint={errors.noSpb}
                        />
                    </div>
                    <div>
                        <Label>Pelanggan / user *</Label>
                        <div className="relative">
                            <SelectSearch
                                options={optionsUsers}
                                value={String(form.userId || "")}
                                placeholder="select customer"
                                onChange={handleUserChange}
                                error={!!errors.userId}
                                hint={errors.userId}
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>
                    <div>
                        <Label>KOLI *</Label>
                        <Input name="koli"
                            value={form.koli}
                            onChange={(e) => {
                                handleChange(e);
                                setErrors((prev) => ({
                                    ...prev,
                                    koli: "",
                                }));
                            }}
                            type="text"
                            error={!!errors.koli}
                            hint={errors.koli}
                        />
                    </div>
                    <div>
                        <Label>Berat *</Label>
                        <div className="relative">
                            <Input
                                name="berat"
                                value={form.berat}
                                onChange={(e) => {
                                    handleChange(e);
                                    setErrors((prev) => ({
                                        ...prev,
                                        berat: "",
                                    }));
                                }}
                                type="text"
                                className="pr-12"
                                error={!!errors.berat}
                                hint={errors.berat}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                KG
                            </span>
                        </div>
                    </div>
                    <div>
                        <Label>Kota Tujuan *</Label>
                        <div className="relative">
                            <SelectSearch
                                options={optionsHargas}
                                value={String(form.hargaId || "")}
                                placeholder="Select Kota Tujuan"
                                onChange={handleHargaChange}
                                error={!!errors.hargaId}
                                hint={errors.hargaId}
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>
                    <div>
                        <Label>Alamat Tujuan *</Label>
                        <Input name="tujuan"
                            value={form.tujuan}
                            onChange={(e) => {
                                handleChange(e);
                                setErrors((prev) => ({
                                    ...prev,
                                    tujuan: "",
                                }));
                            }}
                            placeholder="ex: Jl. example "
                            type="text"
                            error={!!errors.tujuan}
                            hint={errors.tujuan}
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

                    <div className="flex items-center justify-between mt-6 flex-wrap gap-3">

                        {/* TOTAL */}
                        <div className="text-lg font-semibold text-gray-800 dark:text-white">
                            Total:{" "}
                            <span className="text-brand-500">
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                }).format(total)}
                            </span>
                        </div>

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
    );
}