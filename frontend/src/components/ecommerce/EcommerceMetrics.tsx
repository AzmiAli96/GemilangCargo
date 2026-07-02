"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { pengirimanData, pesananData, userData } from "@/types";
import { apiRequest } from "@/service/api.service";
import { CircleDollarSign, Package } from "lucide-react";

export const EcommerceMetrics = () => {
  const [users, setUsers] = useState<userData[]>([]);
  const [pesanan, setPesanan] = useState<pesananData[]>([]);
  const [pengiriman, setPengiriman] = useState<pengirimanData[]>([]);
  const [loading, setLoading] = useState(true);
  

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await apiRequest({
        endpoint: `/allusers`,
      });
      // console.log("FULL RESPONSE:", res);
      setUsers(res.data);
    } catch (error) {
      console.error("Gagal ambil data Users:", error);
    } finally {
      setLoading(false);
    }
  }

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
    getUsers();
  }, []);

  const totalPelanggan = users.filter(
    (user) => Number(user.roleId) === 4
  ).length;

  const totalPesanan = pesanan.filter(
    (pesanan) => pesanan.pengirimanId === null
  ).length;

  const totalStatusPay = pesanan.filter(
    (pesanan) => pesanan.statusPay === "Belum Lunas" && pesanan.pengirimanId != null
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pelanggan
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : totalPelanggan}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-yellow-600 rounded-xl dark:bg-gray-800">
          <Package className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Jumlah Paket yang masih dalam Antrian 
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : totalPesanan}
            </h4>
          </div>

        </div>
      </div>
      {/* <!-- Metric Item End --> */}
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-yellow-200 rounded-xl dark:bg-gray-800">
          <CircleDollarSign className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Jumlah Pelanggan Yang Belum Bayar
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : totalStatusPay}
            </h4>
          </div>

          {/* <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
