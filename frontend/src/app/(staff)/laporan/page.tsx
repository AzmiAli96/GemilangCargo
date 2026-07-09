import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Laporan from "@/components/staff/laporan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan Bulanan",
  description: "Halaman untuk mengelola Laporan pengiriman barang di aplikasi staf.",
};

export default function pageLaporan() {
    return (
        <div>
            <PageBreadcrumb pageTitle="pencatatan Laporan Bulanan " />
            <Laporan />
        </div>
    )
}
