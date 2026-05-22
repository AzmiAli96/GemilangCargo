import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DeliveryOrder from "@/components/staff/delivery/order";
import StatusOrder from "@/components/staff/status/order";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Status Barang / Status Pengiriman Barang",
  description: "Halaman untuk mengelola pengiriman barang, untuk mengatus status pelunasan di aplikasi staf.",
};

export default function pageDeliveryOrder() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Delivery Order / Pengiriman Barang" />
            <StatusOrder />
        </div>
    )
}
