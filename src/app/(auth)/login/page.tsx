import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LoginFormClient } from "@/app/_components/auth";

export const metadata = {
  title: "ورود | نمایندگی انحصاری فانتوم پلاس در ایران",
};

export default async function LoginPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (accessToken) {
    redirect("/profile");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-teal-200/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-200/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
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

        <Suspense fallback={<LoginSkeleton />}>
          <LoginFormClient />
        </Suspense>
      </div>
    </div>
  );
}

function LoginSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-4 mr-auto" />
      <div className="h-12 bg-slate-100 rounded-xl mb-2" />
      <div className="h-3 bg-slate-100 rounded w-2/3 mb-6 mr-auto" />
      <div className="h-12 bg-slate-200 rounded-xl" />
    </div>
  );
}
