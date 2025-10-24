import { Outlet } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { AdminLayout } from "~/components/layout/AdminLayout";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin Dashboard - RustCare" },
    { name: "description", content: "RustCare Healthcare Management System - Administrative Dashboard" },
    { name: "robots", content: "noindex, nofollow" }, // Don't index admin pages
  ];
};

export default function AdminLayoutRoute() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
