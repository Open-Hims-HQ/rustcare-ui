import { Outlet } from "@remix-run/react";
import { AdminLayout } from "~/components/layout/AdminLayout";

export default function AdminLayoutRoute() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
