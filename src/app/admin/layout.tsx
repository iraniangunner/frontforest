// app/admin/layout.tsx
import { AdminGuard } from "../_components/guards";
import Sidebar from "../_components/admin/Sidebar";
import { Suspense } from "react";
import TopLoader from "../_components/home/TopLoader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <Suspense>
        <TopLoader />
      </Suspense>
      <div className="flex min-h-screen bg-gray-100" dir="rtl">
        <Sidebar />
        {/* desktop: margin برای sidebar — موبایل: بدون margin */}
        <main className="flex-1 lg:mr-64 min-w-0">{children}</main>
      </div>
    </AdminGuard>
  );
}
