import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PesananKhusus from "@/components/staff/pesananKhusus";

export const metadata: Metadata = {
  title: "Order Custom Pengiriman Barang",
  description: "Halaman untuk mengelola order custom pengiriman barang di aplikasi staf.",
};

export default function pagePesananKhusus() {
    return (
        <div>
            <PageBreadcrumb pageTitle="List Pesanan Paket khusus dalam Antrian untuk pengiriman" />
            <PesananKhusus />
        </div>
    )
}