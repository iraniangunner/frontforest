import { AdminGuard } from "../_components/guards";
import Sidebar from "../_components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-100" dir="rtl">
        <Sidebar />
        <main className="flex-1 mr-64">{children}</main>
      </div>
    </AdminGuard>
  );
}
