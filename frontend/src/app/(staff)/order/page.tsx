"use client"

import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import Order from "@/components/staff/order"

export default function pagePrice() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Order Pengiriman Barang" />
            <Order />
        </div>
    )
}