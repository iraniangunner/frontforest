// components/home/FeaturesSection.tsx

import {
  HiCode,
  HiLightningBolt,
  HiColorSwatch,
  HiShieldCheck,
  HiTemplate,
  HiRefresh,
} from "react-icons/hi";

const features = [
  {
    icon: HiCode,
    title: "کد تمیز و استاندارد",
    description: "تمامی کامپوننت‌ها با رعایت بهترین استانداردها نوشته شده‌اند",
    color: "bg-blue-500",
  },
  {
    icon: HiLightningBolt,
    title: "عملکرد سریع",
    description: "بهینه‌سازی شده برای بهترین عملکرد و سرعت بارگذاری",
    color: "bg-yellow-500",
  },
  {
    icon: HiColorSwatch,
    title: "قابل شخصی‌سازی",
    description: "به راحتی می‌توانید استایل‌ها را مطابق نیاز تغییر دهید",
    color: "bg-purple-500",
  },
  {
    icon: HiShieldCheck,
    title: "پشتیبانی مداوم",
    description: "به‌روزرسانی منظم و پشتیبانی فنی برای تمام محصولات",
    color: "bg-green-500",
  },
  {
    icon: HiTemplate,
    title: "طراحی واکنش‌گرا",
    description: "سازگار با تمام دستگاه‌ها و اندازه‌های صفحه نمایش",
    color: "bg-pink-500",
  },
  {
    icon: HiRefresh,
    title: "به‌روزرسانی رایگان",
    description: "تمام به‌روزرسانی‌های آینده به صورت رایگان در اختیار شماست",
    color: "bg-indigo-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            چرا فرانت‌فارست؟
          </h2>
          {/* <p className="text-gray-500 max-w-2xl mx-auto">
            ما بهترین کامپوننت‌های React را با کیفیت بالا و قیمت مناسب ارائه می‌دهیم
          </p> */}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-2xl transition-all duration-300"
            >
              <div
                className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}