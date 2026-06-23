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
    <div className="min-h-screen bg-white grid lg:grid-cols-2">
      {/* ───── سمت راست (RTL): فرم لخت و بدون حاشیه ───── */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* لوگو */}
          <div className="flex justify-center lg:justify-start mb-10">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/petra-logo.png"
                alt="فروشگاه پترا"
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A72F3B]" />
              </div>
            }
          >
            <LoginContent />
          </Suspense>
        </div>
      </div>

      {/* ───── سمت چپ (RTL): تصویر — روی موبایل مخفی ───── */}
      <div className="hidden lg:flex items-center justify-center bg-[#FCF7F7] p-12">
        {/*
          تصویر دقیق فیگما را از فایل خودت اکسپورت کن (PNG یا SVG) و اینجا بذار:
          public/images/login-illustration.png
        */}
        <Image
          src="/images/login-illustration.png"
          alt="فروشگاه پترا"
          width={560}
          height={560}
          className="w-full max-w-lg h-auto object-contain"
          priority
        />
      </div>
    </div>
  );
}
