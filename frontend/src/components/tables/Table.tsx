
type Column = {
  key: string;
  label: React.ReactNode;
  render?: (row: any) => React.ReactNode;
  type?: "text" | "currency" | "number" | "date";
};

type Props = {
  columns: Column[];
  data: any[];
};

export default function Table({ columns, data }: Props) {
  const getValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  const formatValue = (value: any, type?: string) => {
    if (value == null) return "-";

    switch (type) {
      case "currency":
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(value);

      case "date":
        return new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(value));

      case "number":
        return new Intl.NumberFormat("id-ID").format(value);

      default:
        return value;
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

      <div className="max-w-full overflow-x-auto">
        <table className="min-w-full">

          {/* HEADER */}
          <thead className="border-b border-gray-100 dark:border-white/[0.05]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data.length > 0 ? (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition"
                >
                  {columns.map((col) => (
                    // <td
                    //   key={col.key}
                    //   className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300"
                    // >
                    //   {getValue(row, col.key) ?? "-"}
                    // </td>
                    <td
                      key={col.key}
                      className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {col.render
                        ? col.render(row)
                        : formatValue(getValue(row, col.key), col.type)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-6 text-center text-gray-500"
                >
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}