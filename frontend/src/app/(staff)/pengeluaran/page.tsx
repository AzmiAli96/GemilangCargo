import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pengeluaran from "@/components/staff/pengeluaran";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengeluaran / pencatatan Pengeluaran",
  description: "Halaman untuk mengelola delivery pengiriman barang di aplikasi staf.",
};

export default function pagePengeluaran() {
    return (
        <div>
            <PageBreadcrumb pageTitle="pencatatan Pengeluaran " />
            <Pengeluaran />
        </div>
    )
}
