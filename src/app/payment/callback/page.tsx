"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  HiCheck,
  HiX,
  HiClock,
  HiRefresh,
  HiDownload,
  HiShoppingCart,
} from "react-icons/hi";
import { checkoutAPI } from "@/lib/api";
import { useCart } from "@/context/CartContext";

type PaymentStatus = "loading" | "success" | "failed";

interface PaymentResult {
  order_id?: number;
  order_number: string;
  ref_id?: string;
  total?: number;
  message?: string;
}

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

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
      setResult({
        order_number: "",
        message: "اطلاعات پرداخت نامعتبر است",
      });
      return;
    }

    try {
      const response = await checkoutAPI.verify(authority, paymentStatus || "");

      if (response.data.success) {
        setStatus("success");
        setResult({
          order_id: response.data.data.order_id,
          order_number: response.data.data.order_number,
          ref_id: response.data.data.ref_id,
          total: response.data.data.total,
        });
        // Clear cart on successful payment
        clearCart();
      } else {
        setStatus("failed");
        setResult({
          order_id: response.data.data?.order_id,
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

  const formatPrice = (price: number | undefined | null) => {
    if (!price) return "0 تومان";
    return price.toLocaleString() + " تومان";
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
        {/* Loading State */}
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

        {/* Success State */}
        {status === "success" && result && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiCheck className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">پرداخت موفق</h1>
            <p className="text-gray-500 mb-6">سفارش شما با موفقیت ثبت شد</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-right">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">شماره سفارش</span>
                <span className="font-medium">{result.order_number}</span>
              </div>
              {result.ref_id && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">کد پیگیری</span>
                  <span className="font-medium font-mono">{result.ref_id}</span>
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

            <div className="space-y-3">
              {result.order_id && (
                <Link
                  href={`/profile/orders/${result.order_id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  <HiDownload className="w-5 h-5" />
                  مشاهده سفارش و دانلود
                </Link>
              )}
              <Link
                href="/profile/purchases"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                مشاهده خریدها
              </Link>
              <Link
                href="/components"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                <HiShoppingCart className="w-5 h-5" />
                ادامه خرید
              </Link>
            </div>
          </>
        )}

        {/* Failed State */}
        {status === "failed" && result && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiX className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">پرداخت ناموفق</h1>
            <p className="text-gray-500 mb-6">
              {result.message || "متأسفانه پرداخت انجام نشد"}
            </p>

            {result.order_number && (
              <p className="text-sm text-gray-400 mb-6">
                شماره سفارش: {result.order_number}
              </p>
            )}

            <div className="space-y-3">
              {/* {result.order_id && (
                <Link
                  href={`/payment/pay/${result.order_id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  <HiRefresh className="w-5 h-5" />
                  تلاش مجدد
                </Link>
              )} */}
              {/* <Link
                href="/cart"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                <HiShoppingCart className="w-5 h-5" />
                بازگشت به سبد خرید
              </Link> */}
              <Link
                href="/profile/orders"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                لیست سفارشات
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen bg-gray-50 flex items-center justify-center"
          dir="rtl"
        >
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiClock className="w-10 h-10 text-blue-600 animate-pulse" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              در حال بارگذاری
            </h1>
            <p className="text-gray-500">لطفاً صبر کنید...</p>
          </div>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}