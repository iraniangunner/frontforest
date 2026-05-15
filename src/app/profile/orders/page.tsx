"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HiShoppingBag,
  HiArrowRight,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiBan,
  HiCreditCard,
  HiCube,
  HiTruck,
  HiRefresh,
} from "react-icons/hi";
import { ordersAPI } from "@/lib/api";
import Pagination from "@/app/_components/ui/Pagination";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Order {
  id: number;
  order_number: string;
  total: number;
  status: string;
  status_label: string;
  items_count: number;
  tracking_code: string | null;
  created_at: string;
  paid_at: string | null;
  latest_transaction?: { ref_id: string | null };
}

// ─────────────────────────────────────────────
// Status Config — همه وضعیت‌های جدید
// ─────────────────────────────────────────────
const STATUS_CONFIG: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    badgeColor: string;
    label: string;
  }
> = {
  pending: {
    icon: HiClock,
    iconColor: "text-yellow-500",
    badgeColor: "bg-yellow-100 text-yellow-700",
    label: "در انتظار پرداخت",
  },
  paid: {
    icon: HiCreditCard,
    iconColor: "text-blue-500",
    badgeColor: "bg-blue-100 text-blue-700",
    label: "پرداخت شده",
  },
  processing: {
    icon: HiCube,
    iconColor: "text-purple-500",
    badgeColor: "bg-purple-100 text-purple-700",
    label: "در حال پردازش",
  },
  shipped: {
    icon: HiTruck,
    iconColor: "text-indigo-500",
    badgeColor: "bg-indigo-100 text-indigo-700",
    label: "ارسال شده",
  },
  delivered: {
    icon: HiCheckCircle,
    iconColor: "text-green-500",
    badgeColor: "bg-green-100 text-green-700",
    label: "تحویل داده شده",
  },
  canceled: {
    icon: HiBan,
    iconColor: "text-gray-400",
    badgeColor: "bg-gray-100 text-gray-600",
    label: "لغو شده",
  },
  returned: {
    icon: HiRefresh,
    iconColor: "text-orange-500",
    badgeColor: "bg-orange-100 text-orange-700",
    label: "مرجوعی",
  },
  failed: {
    icon: HiXCircle,
    iconColor: "text-red-400",
    badgeColor: "bg-red-100 text-red-700",
    label: "ناموفق",
  },
};

const getStatusConfig = (status: string) =>
  STATUS_CONFIG[status] || STATUS_CONFIG.pending;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatPrice = (n: number) => Number(n).toLocaleString("fa-IR") + " تومان";

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  useEffect(() => {
    loadOrders();
  }, [meta.current_page]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.getAll({
        page: meta.current_page,
        per_page: 10,
      });
      setOrders(res.data.data);
      setMeta(res.data.meta);
    } catch {
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* هدر */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/profile"
            className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition"
          >
            <HiArrowRight className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">سفارشات من</h1>
            <p className="text-sm text-gray-500">{meta.total} سفارش</p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          // خالی
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HiShoppingBag className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              هنوز سفارشی ثبت نشده
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              سفارشات شما اینجا نمایش داده می‌شوند
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          // لیست سفارشات
          <div className="space-y-3">
            {orders.map((order) => {
              const cfg = getStatusConfig(order.status);
              const Icon = cfg.icon;

              return (
                <Link
                  key={order.id}
                  href={`/profile/orders/${order.id}`}
                  className="block bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow border border-transparent hover:border-gray-100"
                >
                  {/* ردیف بالا: آیکون + شماره + badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          cfg.badgeColor.split(" ")[0]
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm font-mono">
                          {order.order_number}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${cfg.badgeColor}`}
                    >
                      {cfg.label || order.status_label}
                    </span>
                  </div>

                  {/* ردیف پایین: تعداد + مبلغ */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {order.items_count} محصول
                    </span>
                    <span className="font-bold text-gray-900 text-sm">
                      {formatPrice(order.total)}
                    </span>
                  </div>

                  {/* کد رهگیری */}
                  {order.tracking_code && (
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-2">
                      <HiTruck className="w-3.5 h-3.5 text-indigo-400" />
                      <p className="text-xs text-indigo-600 font-mono">
                        کد رهگیری: {order.tracking_code}
                      </p>
                    </div>
                  )}

                  {/* کد پیگیری پرداخت */}
                  {!order.tracking_code && order.latest_transaction?.ref_id && (
                    <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
                      کد پیگیری: {order.latest_transaction.ref_id}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {orders.length > 0 && meta.last_page > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              onPageChange={(page) => setMeta({ ...meta, current_page: page })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
