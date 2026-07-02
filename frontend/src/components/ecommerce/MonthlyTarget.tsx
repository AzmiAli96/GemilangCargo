"use client";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import { useEffect, useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoveUp } from "lucide-react";
import { pesananData } from "@/types";
import { apiRequest } from "@/service/api.service";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTarget() {
  const [pesanan, setPesanan] = useState<pesananData[]>([]);
  const [loading, setLoading] = useState(true);

  const getPesanan = async () => {
    try {
      setLoading(true);
      const res = await apiRequest({
        endpoint: `/allPesanan`
      });
      setPesanan(res);
    } catch (error) {
      console.error("gagal dapat data Pesanan:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPesanan();
  }, []);

  const pesananPengiriman = pesanan.filter((item) =>
    item.pengirimanId !== null
  );

  const totalPesanan = pesananPengiriman.length;

  const totalBelumLunas = pesananPengiriman.filter(
    (item) => item.statusPay === "Belum Lunas"
  ).length;

  const totalLunas = totalPesanan - totalBelumLunas;

  // persentase pembayaran
  const progress =
    totalPesanan > 0
      ? Number(((totalLunas / totalPesanan) * 100).toFixed(2))
      : 0;

  const progressBelumLunas =
    totalPesanan > 0
      ? Number(((totalBelumLunas / totalPesanan) * 100).toFixed(2))
      : 0;

  // total nominal belum lunas
  const totalNominalBelumLunas =
    pesananPengiriman
      .filter((item) => item.statusPay === "Belum Lunas")
      .reduce(
        (sum, item) =>
          sum + Number(item.total || 0),
        0
      );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const series = [progress];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };


  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Status Pembayaran
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Status Pembayaran jika 100% maka semua pembayaran sudah Lunas
            </p>
          </div>
        </div>
        <div className="relative ">
          <div className="max-h-[330px]">
            {!loading && (
              <ReactApexChart
                options={options}
                series={[progress]}
                type="radialBar"
                height={330}
              />
            )}
          </div>

          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-error-50 px-3 py-1 text-xs font-medium text-error-600 dark:bg-error-500/15 dark:text-error-500">
            {progressBelumLunas}%
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          Masih ada {progressBelumLunas}% yang belum membayar, segera hubungi untuk meminta pembayaran
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Total tagihan yang belum dibayar saat ini sebesar{" "}
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {formatCurrency(totalNominalBelumLunas)}
          </p>
        </div>

        {/* <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div> */}

        {/* <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Revenue
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            $20K
          </p>
        </div> */}

      </div>
    </div>
  );
}
