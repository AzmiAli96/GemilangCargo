"use client";
import Hargas from "@/components/admin/harga";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function pageHarga() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Harga / Harga Wilayah" />
            <Hargas />
        </div>
    )
}