"use client";
import Users from "@/components/admin/users";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function pageUsers() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Users" />
            <Users />
        </div>
    )
}