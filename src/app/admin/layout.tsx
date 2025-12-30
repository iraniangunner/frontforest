import Sidebar from "@/app/_components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <Sidebar />
      <main className="mr-64">{children}</main>
    </div>
  );
}