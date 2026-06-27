"use client"

import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import Order from "@/components/staff/pesanan"

export default function pagePesanan() {
    return (
        <div>
            <PageBreadcrumb pageTitle="List Pesanan Paket dalam Antrian untuk pengiriman" />
            <Order />
        </div>
    )
}