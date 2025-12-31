import { Component } from "@/types";

interface FileInfoCardProps {
  component: Component;
}

export function FileInfoCard({ component }: FileInfoCardProps) {
  if (!component.has_file) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">اطلاعات فایل</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">حجم فایل</span>
          <span className="font-medium">{component.file_size_formatted}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">فرمت</span>
          <span className="font-medium">ZIP</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">تاریخ آپدیت</span>
          <span className="font-medium">{formatDate(component.created_at)}</span>
        </div>
      </div>
    </div>
  );
}