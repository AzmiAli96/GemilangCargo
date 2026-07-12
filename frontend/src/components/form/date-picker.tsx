import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon } from '../../icons';
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  name?: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: (e: { target: { name: string; value: string } }) => void;
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  value?: any;
};

export default function DatePicker({
  id,
  name,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  value
}: PropsType) {
  const fpRef = useRef<ReturnType<typeof flatpickr> | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const instance = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate: value || defaultDate,
      onChange: (_selectedDates, dateStr) => {
        onChangeRef.current?.({
          target: {
            name: name || id,
            value: dateStr,
          },
        });
      },
    });

    fpRef.current = instance;

    return () => {
      if (!Array.isArray(instance)) {
        instance.destroy();
      }
    };
  }, [mode, id, name]);

  useEffect(() => {
    const instance = fpRef.current;
    if (instance && !Array.isArray(instance)) {
      instance.setDate(value || "", false);
    }
  }, [value]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
