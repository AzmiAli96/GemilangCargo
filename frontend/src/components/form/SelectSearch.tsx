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
    error?: boolean
    hint?: string
    required?: boolean
    disabled?: boolean;
}

const SelectSearch: React.FC<SelectProps> = ({
    options,
    placeholder = "Cari...",
    onChange,
    className = "",
    value = "",
    error = false,
    hint,
    required = false,
    disabled = false,
}) => {
    let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;
    if (disabled) {
        inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
    } else if (error) {
        inputClasses += ` text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10  dark:text-error-400 dark:border-error-500`;
    } else {
        inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
    }

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
                className={inputClasses}
                required={required}
            />

            {/* Optional Hint Text */}
            {hint && (
                <p
                    className={`mt-1.5 text-xs ${error
                        ? "text-error-500"
                        : "text-gray-500"
                        }`}
                >
                    {hint}
                </p>
            )}

            {/* DROPDOWN */}
            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-theme-xs max-h-60 overflow-y-auto dark:border-gray-700 dark:bg-gray-900">
                    {filtered.length > 0 ? (
                        filtered.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setSearch("");
                                    setOpen(false);
                                }}
                                className="cursor-pointer px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-white/90 dark:hover:bg-white/[0.05]"
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-500 dark:text-gray-400">Tidak ditemukan</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SelectSearch;