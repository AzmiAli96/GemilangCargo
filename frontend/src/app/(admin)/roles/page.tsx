"use client";
import Roles from "@/components/admin/roles";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function pageRoles() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Roles" />
            <Roles />
        </div>
    )
}