// components/home/CTASection.tsx

import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
          آماده‌اید پروژه خود را متحول کنید؟
        </h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          همین حالا عضو فرانت‌فارست شوید و به صدها کامپوننت حرفه‌ای دسترسی داشته
          باشید
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-600 font-bold rounded-2xl hover:bg-gray-50 shadow-2xl shadow-black/20 hover:-translate-y-1 transition-all"
          >
            شروع رایگان
          </Link> */}
          <Link
            href="/components"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all"
          >
            مشاهده کامپوننت‌ها
            <HiArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}