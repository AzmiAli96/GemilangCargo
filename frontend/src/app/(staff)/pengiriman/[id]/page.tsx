import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PengirimanPesanan from "@/components/staff/pengiriman/pesanan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Order / Pengiriman Barang",
  description: "Halaman untuk mengelola delivery pengiriman barang di aplikasi staf.",
};

export default function pagePengirimanPesanan() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Delivery Order / Pengiriman Barang" />
            <PengirimanPesanan />
        </div>
    )
}
