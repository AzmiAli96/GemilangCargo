import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import DeliveryStatus from "@/components/staff/status";

export const metadata: Metadata = {
  title: "Order Custom Pengiriman Barang",
  description: "Halaman untuk mengelola order custom pengiriman barang di aplikasi staf.",
};

export default function pageStatus() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Status Pengiriman Barang" />
            <DeliveryStatus />
        </div>
    )
}