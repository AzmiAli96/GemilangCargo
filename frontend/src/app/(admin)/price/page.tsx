"use client";
import Price from "@/components/admin/price";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function pagePrice() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Price / Harga Wilayah" />
            <Price />
        </div>
    )
}