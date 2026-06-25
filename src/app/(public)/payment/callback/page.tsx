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
import { useUserStatus } from "@/context/UserStatusContext";

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

  const { refresh } = useUserStatus();

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
        await refresh();
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
    return price.toLocaleString("fa-IR") + " تومان";
  };

  return (
    <div
      className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl border border-[#F0F0F0] shadow-sm p-8 max-w-md w-full text-center">
        {/* Loading State */}
        {status === "loading" && (
          <>
            <div className="w-20 h-20 bg-[#F6EAEB] rounded-full flex items-center justify-center mx-auto mb-6">
              <HiClock className="w-10 h-10 text-[#A72F3B] animate-pulse" />
            </div>
            <h1 className="text-xl font-bold text-[#242424] mb-2">
              در حال بررسی پرداخت
            </h1>
            <p className="text-[#898989]">لطفاً صبر کنید...</p>
          </>
        )}

        {/* Success State */}
        {status === "success" && result && (
          <>
            <div className="w-20 h-20 bg-[#E6F4EF] rounded-full flex items-center justify-center mx-auto mb-6">
              <HiCheck className="w-10 h-10 text-[#00966D]" />
            </div>
            <h1 className="text-xl font-bold text-[#242424] mb-2">
              پرداخت موفق
            </h1>
            <p className="text-[#898989] mb-6">سفارش شما با موفقیت ثبت شد</p>

            <div className="bg-[#F8F8F8] rounded-2xl p-4 mb-6 text-right">
              <div className="flex justify-between mb-2">
                <span className="text-[#898989]">شماره سفارش</span>
                <span className="font-medium text-[#242424]">
                  {result.order_number}
                </span>
              </div>
              {result.ref_id && (
                <div className="flex justify-between mb-2">
                  <span className="text-[#898989]">کد پیگیری</span>
                  <span className="font-medium font-mono text-[#242424]">
                    {result.ref_id}
                  </span>
                </div>
              )}
              {result.total && (
                <div className="flex justify-between">
                  <span className="text-[#898989]">مبلغ پرداختی</span>
                  <span className="font-medium text-[#00966D]">
                    {formatPrice(result.total)}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {result.order_id && (
                <Link
                  href={`/profile/orders/${result.order_id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#A72F3B] text-white rounded-xl font-medium hover:bg-[#86262F] transition-colors"
                >
                  <HiDownload className="w-5 h-5" />
                  مشاهده سفارش
                </Link>
              )}
              <Link
                href="/products"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#F5F5F5] text-[#656565] rounded-xl font-medium hover:bg-[#EDEDED] transition-colors"
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
            <div className="w-20 h-20 bg-[#FBEAEA] rounded-full flex items-center justify-center mx-auto mb-6">
              <HiX className="w-10 h-10 text-[#C30000]" />
            </div>
            <h1 className="text-xl font-bold text-[#242424] mb-2">
              پرداخت ناموفق
            </h1>
            <p className="text-[#898989] mb-6">
              {result.message || "متأسفانه پرداخت انجام نشد"}
            </p>

            {result.order_number && (
              <p className="text-sm text-[#AFAFAF] mb-6">
                شماره سفارش: {result.order_number}
              </p>
            )}

            <div className="space-y-3">
              <Link
                href="/cart"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#F5F5F5] text-[#656565] rounded-xl font-medium hover:bg-[#EDEDED] transition-colors"
              >
                <HiShoppingCart className="w-5 h-5" />
                بازگشت به سبد خرید
              </Link>
              <Link
                href="/profile/orders"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[#898989] hover:text-[#656565] transition-colors"
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
          className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"
          dir="rtl"
        >
          <div className="bg-white rounded-3xl border border-[#F0F0F0] shadow-sm p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-[#F6EAEB] rounded-full flex items-center justify-center mx-auto mb-6">
              <HiClock className="w-10 h-10 text-[#A72F3B] animate-pulse" />
            </div>
            <h1 className="text-xl font-bold text-[#242424] mb-2">
              در حال بارگذاری
            </h1>
            <p className="text-[#898989]">لطفاً صبر کنید...</p>
          </div>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
