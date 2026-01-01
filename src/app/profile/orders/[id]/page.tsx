"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  HiArrowRight,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiExclamationCircle,
  HiDownload,
  HiExternalLink,
  HiCreditCard,
  HiCalendar,
  HiHashtag,
} from "react-icons/hi";
import { ordersAPI, publicComponentsAPI } from "@/lib/api";
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

interface Transaction {
  ref_id: string | null;
  gateway: string;
  status: string;
}

interface Order {
  id: number;
  order_number: string;
  status: "pending" | "paid" | "failed" | "cancelled" | "refunded";
  status_label: string;
  subtotal: number;
  discount: number;
  total: number;
  items_count: number;
  items: OrderItem[];
  created_at: string;
  paid_at: string | null;
  transaction: Transaction | null;
}

const STATUS_CONFIG = {
  pending: {
    label: "در انتظار پرداخت",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: HiClock,
    iconColor: "text-yellow-500",
  },
  paid: {
    label: "پرداخت شده",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: HiCheckCircle,
    iconColor: "text-green-500",
  },
  failed: {
    label: "ناموفق",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: HiXCircle,
    iconColor: "text-red-500",
  },
  cancelled: {
    label: "لغو شده",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: HiXCircle,
    iconColor: "text-gray-500",
  },
  refunded: {
    label: "مسترد شده",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: HiExclamationCircle,
    iconColor: "text-purple-500",
  },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingItem, setDownloadingItem] = useState<number | null>(null);
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
      setOrder(response.data.data);
    } catch (error: any) {
      console.error("Error loading order:", error);
      if (error.response?.status === 404) {
        toast.error("سفارش یافت نشد");
        router.push("/profile/orders");
      } else if (error.response?.status === 401) {
        toast.error("لطفاً وارد شوید");
        router.push("/login");
      } else if (error.response?.status === 403) {
        toast.error("شما اجازه دسترسی به این سفارش را ندارید");
        router.push("/profile/orders");
      } else {
        toast.error("خطا در دریافت اطلاعات سفارش");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (item: OrderItem) => {
    if (!item.component_slug) {
      toast.error("اطلاعات کامپوننت موجود نیست");
      return;
    }

    setDownloadingItem(item.id);
    try {
      const response = await publicComponentsAPI.download(item.component_slug);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${item.component_slug}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("دانلود شروع شد");
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error("دسترسی به دانلود ندارید");
      } else {
        toast.error("خطا در دانلود فایل");
      }
    } finally {
      setDownloadingItem(null);
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
      loadOrder(); // Reload to show updated status
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">سفارش یافت نشد</h1>
          <Link href="/profile/orders" className="text-blue-600 hover:text-blue-700">
            بازگشت به لیست سفارشات
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/profile/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <HiArrowRight className="w-5 h-5" />
          بازگشت به سفارشات
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-bold text-gray-900">
                  سفارش #{order.order_number}
                </h1>
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}
                >
                  <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                  {order.status_label || statusConfig.label}
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                ثبت شده در {formatDate(order.created_at)}
              </p>
            </div>

            {/* Action Buttons for Pending Orders */}
            {order.status === "pending" && (
              <div className="flex items-center gap-3">
                <Link
                  href={`/payment/pay/${order.id}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  <HiCreditCard className="w-5 h-5" />
                  پرداخت سفارش
                </Link>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {cancelling ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                  ) : (
                    <HiXCircle className="w-5 h-5" />
                  )}
                  <span className="hidden sm:inline">لغو</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              آیتم‌های سفارش ({order.items_count || order.items?.length || 0})
            </h2>

            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4"
                >
                  {/* Thumbnail */}
                  <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    {item.component_thumbnail ? (
                      <Image
                        src={item.component_thumbnail}
                        alt={item.component_title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">N/A</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/components/${item.component_slug}`}
                      className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                    >
                      {item.component_title}
                    </Link>

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

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      {order.status === "paid" && (
                        <button
                          onClick={() => handleDownload(item)}
                          disabled={downloadingItem === item.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          {downloadingItem === item.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          ) : (
                            <HiDownload className="w-4 h-4" />
                          )}
                          {downloadingItem === item.id ? "در حال دانلود..." : "دانلود"}
                        </button>
                      )}
                      {item.component_slug && (
                        <Link
                          href={`/components/${item.component_slug}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          <HiExternalLink className="w-4 h-4" />
                          مشاهده
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                آیتمی در این سفارش وجود ندارد
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Price Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">خلاصه سفارش</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-600">
                  <span>جمع کل</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {(order.discount || 0) > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>تخفیف</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">مبلغ قابل پرداخت</span>
                    <span className="font-bold text-lg text-gray-900">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">جزئیات سفارش</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <HiHashtag className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">شماره سفارش</p>
                    <p className="font-medium text-gray-900">
                      {order.order_number}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <HiCalendar className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">تاریخ ثبت</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>

                {order.paid_at && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <HiCheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">تاریخ پرداخت</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(order.paid_at)}
                      </p>
                    </div>
                  </div>
                )}

                {order.transaction?.ref_id && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <HiCreditCard className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">کد پیگیری</p>
                      <p className="font-medium text-gray-900 font-mono text-sm">
                        {order.transaction.ref_id}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Help Box */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-sm text-blue-800">
                در صورت داشتن هرگونه سوال یا مشکل با سفارش خود، با پشتیبانی تماس
                بگیرید.
              </p>
              <Link
                href="/contact"
                className="inline-block mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                تماس با پشتیبانی ←
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
