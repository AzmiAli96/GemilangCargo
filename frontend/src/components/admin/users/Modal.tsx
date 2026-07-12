import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/service/api.service";
import { userData } from "@/types";
import { ChevronDownIcon, EyeClosedIcon, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    form: any;
    handleChange: (e: any) => void;
    handleSubmit: () => void;
    mode: "create" | "edit";
    roles: any[];
};

export default function UserModal({
    isOpen,
    onClose,
    form,
    handleChange,
    handleSubmit,
    mode,
    roles,
}: Props) {
    const { user } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        name: "",
    });

    const onSubmit = () => {
        const newErrors = {
            name: "",
        };

        let valid = true;

        if (!form.name?.trim()) {
            newErrors.name = "Nama wajib diisi";
            valid = false;
        }

        setErrors(newErrors);
        if (!valid) return;
        handleSubmit();
    };


    const filteredRoles = roles.filter((role) => {
        if (user?.roleId === 1) {
            return true;
        }

        if (user?.roleId === 2) {
            return role.id === 3 || role.id === 4;
        }
        return false;
    });

    const options = filteredRoles.map((role) => ({
        value: String(role.id),
        label: role.name,
    })) || [];


    const handleRoleChange = (value: string) => {
        handleChange({
            target: {
                name: "roleId",
                value: value,
            },
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
                        {mode === "edit" ? "Perubahan data User" : "Pembuatan Pelanggan / User"}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pembuatan Pelanggan / sopir baru. pastikan memberikan informasi yang benar.
                    </p>
                </div>
                <div className="space-y-4 mt-6">
                    <div>
                        <Label>Name *</Label>
                        <Input name="name"
                            value={form.name}
                            onChange={(e) => {
                                handleChange(e);
                                setErrors((prev) => ({
                                    ...prev,
                                    name: "",
                                }));
                            }}
                            type="text"
                            error={!!errors.name}
                            hint={errors.name}
                        />
                    </div>
                    {user?.roleId === 1 && (
                        <>
                            <div>
                                <Label>Email</Label>
                                <Input
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    type="email"
                                    placeholder="info@gmail.com"
                                />
                            </div>

                            {mode === "create" && (
                                <div>
                                    <Label>Password</Label>

                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="Enter password"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2"
                                        >
                                            {showPassword
                                                ? <EyeIcon />
                                                : <EyeClosedIcon />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <div>
                        <Label>Alamat</Label>
                        <Input name="alamat"
                            value={form.alamat}
                            onChange={handleChange}
                            type="text"
                        />
                    </div>
                    <div>
                        <Label>No Telepon</Label>
                        <Input name="noHp"
                            value={form.noHp}
                            onChange={handleChange}
                            placeholder="08xx-xxxx-xxxx"
                            type="text"
                            maxLength={13}
                        />
                    </div>
                    <div>
                        <Label>Role</Label>
                        <div className="relative">
                            <Select
                                options={options}
                                value={form.roleId || ""}
                                placeholder="Select Role"
                                onChange={handleRoleChange}
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
                            onClick={onSubmit}
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