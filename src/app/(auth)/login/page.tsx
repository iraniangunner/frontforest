// app/login/page.tsx — Server Component
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { LoginContent } from "@/app/_components/auth";

export const metadata = {
  title: "ورود | فروشگاه پترا",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Background blobs — static، روی سرور رندر میشه */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-teal-200/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-200/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo — static */}
        <div className="flex justify-center items-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/petra-logo.png"
              alt="فانتوم پلاس"
              width={120}
              height={40}
              className="w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* فقط همین بخش client است — همه‌ی منطق اصلی بدون تغییر */}
        <Suspense
          fallback={
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
            </div>
          }
        >
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
