import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Driver from "@/components/staff/driver";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Driver / Sopir",
  description: "Halaman untuk mengelola driver sopir di aplikasi staf.",
};

export default function pageDriver() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Driver / Sopir" />
            <Driver />
        </div>
    )
}
