// app/components/[slug]/component-detail/Features.tsx

"use client";

import { HiCheck, HiSparkles } from "react-icons/hi";

interface FeaturesProps {
  features?: string[];
}

const defaultFeatures = [
  "کد تمیز و استاندارد",
  "کاملاً واکنش‌گرا",
  "قابل شخصی‌سازی",
  "پشتیبانی TypeScript",
  "به‌روزرسانی رایگان",
];

export function Features({ features = defaultFeatures }: FeaturesProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <HiSparkles className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-bold text-gray-900">ویژگی‌ها</h3>
      </div>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-center gap-3 text-sm text-gray-600"
          >
            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <HiCheck className="w-3 h-3 text-emerald-600" />
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}