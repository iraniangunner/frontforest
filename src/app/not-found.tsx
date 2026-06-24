// app/not-found.tsx
import Link from "next/link";
import { HiHome } from "react-icons/hi";

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 overflow-hidden"
      dir="rtl"
    >
      <div className="max-w-lg w-full text-center">
        {/* عدد ۴۰۴ */}
        <div className="relative inline-block mb-2">
          <h1 className="text-[120px] sm:text-[160px] font-black leading-none tracking-tight bg-gradient-to-b from-[#A72F3B] to-[#641C23] bg-clip-text text-transparent select-none">
            ۴۰۴
          </h1>

          {/* حباب‌های تزئینی شناور */}
          <span className="absolute -top-2 right-4 w-3 h-3 rounded-full bg-[#DCACB1] animate-[float_3s_ease-in-out_infinite]" />
          <span className="absolute top-8 -left-2 w-2 h-2 rounded-full bg-[#A72F3B] animate-[float_4s_ease-in-out_infinite]" />
          <span className="absolute bottom-4 left-8 w-2.5 h-2.5 rounded-full bg-[#EDD5D8] animate-[float_3.5s_ease-in-out_infinite]" />
        </div>

        {/* کارت سبد خالیِ سرگردان */}

        {/* متن */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#242424] mb-3">
          این صفحه پیدا نشد!
        </h2>
        <p className="text-[#898989] text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          به‌نظر می‌رسه آدرسی که دنبالش بودید وجود نداره یا جابه‌جا شده. نگران
          نباشید — می‌تونید به صفحه‌ی اصلی برگردید.
        </p>

        {/* دکمه */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#A72F3B] text-white rounded-xl font-medium hover:bg-[#86262F] transition-colors"
          >
            <HiHome className="w-5 h-5" />
            بازگشت به خانه
          </Link>
        </div>
      </div>

      {/* انیمیشن‌ها */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(-12px); opacity: 1; }
        }
        @keyframes wobble {
          0%, 100% { transform: rotate(6deg); }
          50% { transform: rotate(-4deg); }
        }
      `}</style>
    </div>
  );
}
