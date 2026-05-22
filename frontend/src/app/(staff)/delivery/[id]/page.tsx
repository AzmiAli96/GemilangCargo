import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DeliveryOrder from "@/components/staff/delivery/order";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Order / Pengiriman Barang",
  description: "Halaman untuk mengelola delivery pengiriman barang di aplikasi staf.",
};

export default function pageDeliveryOrder() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Delivery Order / Pengiriman Barang" />
            <DeliveryOrder />
        </div>
    )
}
