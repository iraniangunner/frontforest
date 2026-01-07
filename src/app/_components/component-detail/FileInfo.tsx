// app/components/[slug]/component-detail/FileInfo.tsx

"use client";

import { HiDocumentDownload, HiCode, HiColorSwatch, HiCube } from "react-icons/hi";

interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  type?: string;
}

interface FileInfoProps {
  fileSizeFormatted?: string | null;
  tags?: Tag[];
}

export function FileInfo({ fileSizeFormatted, tags }: FileInfoProps) {
  const framework = tags?.find((t) => t.type === "framework")?.name || "";
  const styling = tags?.find((t) => t.type === "styling")?.name || "";

  const infoItems = [
    {
      icon: HiDocumentDownload,
      label: "حجم فایل",
      value: fileSizeFormatted || "—",
      color: "text-blue-500",
    },
    {
      icon: HiCube,
      label: "فرمت",
      value: "ZIP",
      color: "text-purple-500",
    },
    {
      icon: HiCode,
      label: "فریم‌ورک",
      value: framework,
      color: "text-cyan-500",
    },
    {
      icon: HiColorSwatch,
      label: "استایل",
      value: styling,
      color: "text-pink-500",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-sm font-bold text-gray-900 mb-4">اطلاعات فایل</h3>
      <div className="space-y-3">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-sm text-gray-500">{item.label}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}