import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import OrderCustom from "@/components/staff/orderCustom"

export const metadata: Metadata = {
  title: "Order Custom Pengiriman Barang",
  description: "Halaman untuk mengelola order custom pengiriman barang di aplikasi staf.",
};

export default function pagePrice() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Order Custom Pengiriman Barang" />
            <OrderCustom />
        </div>
    )
}