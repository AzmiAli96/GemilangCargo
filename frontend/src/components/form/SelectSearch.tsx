import React, { useState } from "react";

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    options: Option[];
    placeholder?: string;
    onChange: (value: string) => void;
    className?: string;
    value?: string;
}

const SelectSearch: React.FC<SelectProps> = ({
    options,
    placeholder = "Cari...",
    onChange,
    className = "",
    value = "",
}) => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const selected = options.find((o) => o.value === value);

    const filtered = options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={`relative ${className}`}>

            {/* INPUT */}
            <input
                type="text"
                value={open ? search : selected?.label || ""}
                placeholder={placeholder}
                onFocus={() => setOpen(true)}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-lg border px-4 text-sm"
            />

            {/* DROPDOWN */}
            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-lg border bg-white shadow max-h-60 overflow-y-auto">
                    {filtered.length > 0 ? (
                        filtered.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setSearch("");
                                    setOpen(false);
                                }}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-500">Tidak ditemukan</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SelectSearch;