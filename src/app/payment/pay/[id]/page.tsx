"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  HiArrowRight,
  HiShoppingCart,
  HiCreditCard,
  HiShieldCheck,
  HiLockClosed,
  HiExclamationCircle,
  HiXCircle,
} from "react-icons/hi";
import { ordersAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface OrderItem {
  id: number;
  component_id: string;
  component_title: string;
  component_slug: string;
  component_thumbnail: string | null;
  price: number;
  sale_price: number | null;
  paid_price: number;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  subtotal: number;
  discount: number;
  total: number;
  items_count: number;
  items: OrderItem[];
}

export default function PayOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getOne(orderId);
      const orderData = response.data.data;

      // Check if order is already paid
      if (orderData.status === "paid") {
        toast.success("این سفارش قبلاً پرداخت شده است");
        router.push(`/profile/orders/${orderId}`);
        return;
      }

      // Check if order is cancelled or failed
      if (orderData.status === "cancelled" || orderData.status === "refunded") {
        toast.error("این سفارش قابل پرداخت نیست");
        router.push("/profile/orders");
        return;
      }

      setOrder(orderData);
    } catch (error: any) {
      console.error("Error loading order:", error);
      if (error.response?.status === 404) {
        toast.error("سفارش یافت نشد");
      } else if (error.response?.status === 401) {
        toast.error("لطفاً وارد شوید");
        router.push("/login");
        return;
      } else if (error.response?.status === 403) {
        toast.error("شما اجازه دسترسی به این سفارش را ندارید");
      } else {
        toast.error("خطا در دریافت اطلاعات سفارش");
      }
      router.push("/profile/orders");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!order) return;

    setProcessing(true);
    try {
      const response = await ordersAPI.pay(order.id);

      if (response.data.success && response.data.payment_url) {
        toast.success("در حال انتقال به درگاه پرداخت...");
        window.location.href = response.data.payment_url;
      } else {
        toast.error(response.data.message || "خطا در ایجاد لینک پرداخت");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "سفارش قابل پرداخت نیست");
      } else if (error.response?.status === 401) {
        toast.error("لطفاً وارد شوید");
        router.push("/login");
      } else {
        toast.error("خطا در اتصال به درگاه پرداخت");
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;

    const confirmed = window.confirm("آیا از لغو این سفارش اطمینان دارید؟");
    if (!confirmed) return;

    setCancelling(true);
    try {
      await ordersAPI.cancel(order.id);
      toast.success("سفارش با موفقیت لغو شد");
      router.push("/profile/orders");
    } catch (error: any) {
      console.error("Cancel error:", error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "این سفارش قابل لغو نیست");
      } else {
        toast.error("خطا در لغو سفارش");
      }
    } finally {
      setCancelling(false);
    }
  };

  const formatPrice = (price: number | undefined | null) => {
    if (price === undefined || price === null) return "0 تومان";
    return price.toLocaleString() + " تومان";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HiExclamationCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">سفارش یافت نشد</h1>
          <Link href="/profile/orders" className="text-blue-600 hover:text-blue-700">
            بازگشت به لیست سفارشات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/profile/orders/${order.id}`}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <HiArrowRight className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تکمیل پرداخت</h1>
            <p className="text-gray-500">سفارش #{order.order_number}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <HiShoppingCart className="w-5 h-5 text-gray-500" />
                <h2 className="font-semibold text-gray-900">
                  آیتم‌های سفارش ({order.items_count || order.items?.length || 0})
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4">
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      {item.component_thumbnail ? (
                        <Image
                          src={item.component_thumbnail}
                          alt={item.component_title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-xs">N/A</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 line-clamp-1">
                        {item.component_title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {item.sale_price && item.sale_price < item.price && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(item.price)}
                          </span>
                        )}
                        <span className="font-medium text-gray-900">
                          {formatPrice(item.paid_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-start gap-3">
                <HiShieldCheck className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800">پرداخت امن</h3>
                  <p className="text-sm text-green-700 mt-1">
                    پرداخت شما از طریق درگاه امن زرین‌پال انجام می‌شود و اطلاعات
                    کارت شما نزد ما ذخیره نمی‌شود.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">خلاصه پرداخت</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-600">
                  <span>جمع کل</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>تخفیف</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">مبلغ قابل پرداخت</span>
                    <span className="font-bold text-xl text-blue-600">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={processing || cancelling}
                className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>در حال اتصال به درگاه...</span>
                  </>
                ) : (
                  <>
                    <HiCreditCard className="w-5 h-5" />
                    <span>پرداخت {formatPrice(order.total)}</span>
                  </>
                )}
              </button>

              {/* Cancel Button */}
              <button
                onClick={handleCancel}
                disabled={processing || cancelling}
                className="w-full mt-3 flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                    <span>در حال لغو...</span>
                  </>
                ) : (
                  <>
                    <HiXCircle className="w-5 h-5" />
                    <span>لغو سفارش</span>
                  </>
                )}
              </button>

              {/* Secure Badge */}
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                <HiLockClosed className="w-4 h-4" />
                <span>پرداخت امن با زرین‌پال</span>
              </div>
            </div>

            {/* Back Link */}
            <div className="text-center">
              <Link
                href={`/profile/orders/${order.id}`}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                بازگشت به جزئیات سفارش
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}