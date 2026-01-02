// components/home/StatsSection.tsx

import { HiCube, HiDownload, HiUsers, HiStar } from "react-icons/hi";

const stats = [
  { icon: HiCube, value: "۵۰۰+", label: "کامپوننت", color: "text-blue-600" },
  { icon: HiDownload, value: "۱۰K+", label: "دانلود", color: "text-green-600" },
  { icon: HiUsers, value: "۲K+", label: "کاربر فعال", color: "text-purple-600" },
  { icon: HiStar, value: "۴.۹", label: "امتیاز", color: "text-yellow-600" },
];

export default function StatsSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}