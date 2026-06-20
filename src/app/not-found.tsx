// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4"
      dir="rtl"
    >
      <h1 className="text-6xl font-bold text-gray-300 mb-4">۴۰۴</h1>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        صفحه مورد نظر پیدا نشد
      </h2>
      <p className="text-gray-500 mb-6">
        متاسفانه صفحه‌ای که دنبالش بودید وجود ندارد یا حذف شده است.
      </p>
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="px-5 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
