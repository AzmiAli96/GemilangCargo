import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Truck from "@/components/staff/truck";

export const metadata: Metadata = {
  title: "Pembuatan Truck",
  description: "Halaman untuk mengelola pembuatan truck di aplikasi staf.",
};

export default function pageTruck() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Pembuatan Truck" />
            <Truck />
        </div>
    )
}