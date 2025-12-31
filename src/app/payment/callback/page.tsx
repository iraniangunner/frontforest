"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HiCheck, HiX, HiClock } from "react-icons/hi";
import { checkoutAPI } from "@/lib/api";

type PaymentStatus = "loading" | "success" | "failed";

interface PaymentResult {
  order_number: string;
  ref_id?: string;
  total?: number;
  message?: string;
}

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [result, setResult] = useState<PaymentResult | null>(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    const authority = searchParams.get("Authority");
    const paymentStatus = searchParams.get("Status");

    if (!authority) {
      setStatus("failed");
      setResult({ order_number: "", message: "اطلاعات پرداخت نامعتبر است" });
      return;
    }

    try {
      const response = await checkoutAPI.verify(authority, paymentStatus || "");

      if (response.data.success) {
        setStatus("success");
        setResult({
          order_number: response.data.data.order_number,
          ref_id: response.data.data.ref_id,
          total: response.data.data.total,
        });
      } else {
        setStatus("failed");
        setResult({
          order_number: response.data.data?.order_number || "",
          message: response.data.message,
        });
      }
    } catch (error: any) {
      setStatus("failed");
      setResult({
        order_number: "",
        message: error.response?.data?.message || "خطا در تایید پرداخت",
      });
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString() + " تومان";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiClock className="w-10 h-10 text-blue-600 animate-pulse" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              در حال بررسی پرداخت
            </h1>
            <p className="text-gray-500">لطفاً صبر کنید...</p>
          </>
        )}

        {status === "success" && result && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiCheck className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              پرداخت موفق
            </h1>
            <p className="text-gray-500 mb-6">
              سفارش شما با موفقیت ثبت شد
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-right">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">شماره سفارش</span>
                <span className="font-medium">{result.order_number}</span>
              </div>
              {result.ref_id && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">کد پیگیری</span>
                  <span className="font-medium">{result.ref_id}</span>
                </div>
              )}
              {result.total && (
                <div className="flex justify-between">
                  <span className="text-gray-500">مبلغ پرداختی</span>
                  <span className="font-medium text-green-600">
                    {formatPrice(result.total)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Link
                href="/profile/purchases"
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
              >
                مشاهده خریدها
              </Link>
              <Link
                href="/components"
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                ادامه خرید
              </Link>
            </div>
          </>
        )}

        {status === "failed" && result && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiX className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              پرداخت ناموفق
            </h1>
            <p className="text-gray-500 mb-6">
              {result.message || "متأسفانه پرداخت انجام نشد"}
            </p>

            {result.order_number && (
              <p className="text-sm text-gray-400 mb-6">
                شماره سفارش: {result.order_number}
              </p>
            )}

            <div className="flex gap-3">
              <Link
                href="/cart"
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
              >
                بازگشت به سبد خرید
              </Link>
              <Link
                href="/"
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                صفحه اصلی
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}