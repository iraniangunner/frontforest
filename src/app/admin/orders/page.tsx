"use client";

import { useState, useEffect } from "react";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import {
  HiSearch,
  HiEye,
  HiX,
  HiUser,
  HiCreditCard,
  HiLocationMarker,
  HiTruck,
  HiCheckCircle,
  HiClock,
  HiXCircle,
  HiBan,
  HiCube,
  HiRefresh,
  HiShoppingBag,
  HiTrendingUp,
  HiChevronDown,
} from "react-icons/hi";
import { adminOrdersAPI } from "@/lib/api";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface OrderItem {
  id: number;
  product_title: string;
  product_thumbnail: string | null;
  price: number;
  paid_price: number;
  quantity: number;
}

interface Order {
  id: number;
  order_number: string;
  total: number;
  subtotal: number;
  discount: number;
  coupon_code: string | null;
  coupon_discount: number;
  status: string;
  status_label: string;
  tracking_code: string | null;
  status_note: string | null;
  items_count: number;
  items?: OrderItem[];
  user: { id: number; name: string; mobile: string; email?: string };
  shipping?: {
    receiver_name: string;
    receiver_mobile: string;
    province: string;
    city: string;
    address: string;
    postal_code: string;
  };
  timeline?: {
    created_at: string | null;
    paid_at: string | null;
    processing_at: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
    cancelled_at: string | null;
  };
  latest_transaction?: { ref_id: string | null; status: string };
  created_at: string;
  paid_at: string | null;
}

interface Stats {
  total: number;
  pending: number;
  paid: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  returned: number;
  failed: number;
  total_revenue: number;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const formatPrice = (n: number) => Number(n).toLocaleString("fa-IR") + " تومان";

const formatDate = (d: string | null) => {
  if (!d) return "−";
  return new Date(d).toLocaleDateString("fa-IR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: string; icon: any }
> = {
  pending: { label: "در انتظار", variant: "warning", icon: HiClock },
  paid: { label: "پرداخت شده", variant: "info", icon: HiCreditCard },
  processing: { label: "در حال پردازش", variant: "secondary", icon: HiCube },
  shipped: { label: "ارسال شده", variant: "primary", icon: HiTruck },
  delivered: {
    label: "تحویل داده شد",
    variant: "success",
    icon: HiCheckCircle,
  },
  cancelled: { label: "لغو شده", variant: "default", icon: HiBan },
  returned: { label: "مرجوعی", variant: "warning", icon: HiRefresh },
  failed: { label: "ناموفق", variant: "danger", icon: HiXCircle },
};

const TRANSITIONS: Record<
  string,
  { status: string; label: string; color: string }[]
> = {
  paid: [
    { status: "processing", label: "شروع پردازش", color: "bg-purple-600" },
    { status: "cancelled", label: "لغو سفارش", color: "bg-red-500" },
  ],
  processing: [
    { status: "shipped", label: "ارسال شد", color: "bg-indigo-600" },
    { status: "cancelled", label: "لغو سفارش", color: "bg-red-500" },
  ],
  shipped: [
    { status: "delivered", label: "تحویل شد", color: "bg-green-600" },
    { status: "returned", label: "مرجوعی", color: "bg-orange-500" },
  ],
  delivered: [{ status: "returned", label: "مرجوعی", color: "bg-orange-500" }],
};

// ─────────────────────────────────────────────
// Status Update Modal
// ─────────────────────────────────────────────
function StatusModal({
  order,
  onClose,
  onSuccess,
}: {
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const transitions = TRANSITIONS[order.status] || [];
  const [selectedStatus, setSelectedStatus] = useState(
    transitions[0]?.status || "",
  );
  const [note, setNote] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [saving, setSaving] = useState(false);

  const inp =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition";

  const handleSave = async () => {
    if (!selectedStatus) return;
    setSaving(true);
    try {
      await adminOrdersAPI.updateStatus(order.id, {
        status: selectedStatus,
        note: note || undefined,
        tracking_code: trackingCode || undefined,
      });
      toast.success("وضعیت سفارش بروزرسانی شد");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در بروزرسانی");
    } finally {
      setSaving(false);
    }
  };

  if (transitions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm text-center">
          <p className="text-gray-600 mb-4">این سفارش قابل تغییر وضعیت نیست</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 rounded-xl text-sm"
          >
            بستن
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">تغییر وضعیت سفارش</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* اطلاعات سفارش */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-900">
              {order.order_number}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {order.user.name} — {order.user.mobile}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              وضعیت فعلی:{" "}
              <span className="font-medium text-gray-700">
                {STATUS_CONFIG[order.status]?.label || order.status_label}
              </span>
            </p>
          </div>

          {/* انتخاب وضعیت جدید */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وضعیت جدید <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {transitions.map((t) => (
                <label
                  key={t.status}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                    selectedStatus === t.status
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={t.status}
                    checked={selectedStatus === t.status}
                    onChange={() => setSelectedStatus(t.status)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* کد رهگیری — فقط برای ارسال */}
          {selectedStatus === "shipped" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                کد رهگیری پستی <span className="text-red-500">*</span>
              </label>
              <input
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="کد رهگیری را وارد کنید"
                dir="ltr"
                className={inp}
              />
            </div>
          )}

          {/* یادداشت */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              یادداشت (اختیاری)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="پیامی برای کاربر..."
              className={inp}
            />
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              انصراف
            </button>
            <button
              onClick={handleSave}
              disabled={
                saving ||
                !selectedStatus ||
                (selectedStatus === "shipped" && !trackingCode)
              }
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {saving ? "در حال ذخیره..." : "ثبت و ارسال SMS"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Order Detail Modal
// ─────────────────────────────────────────────
function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: () => void;
}) {
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusCfg.icon;
  const canChange = !!TRANSITIONS[order.status]?.length;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
          {/* هدر */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-gray-900">
                سفارش {order.order_number}
              </h2>
              <span
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "shipped"
                      ? "bg-indigo-100 text-indigo-700"
                      : order.status === "processing"
                        ? "bg-purple-100 text-purple-700"
                        : order.status === "paid"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "cancelled"
                            ? "bg-gray-100 text-gray-600"
                            : order.status === "returned"
                              ? "bg-orange-100 text-orange-700"
                              : order.status === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                }`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {statusCfg.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {canChange && (
                <button
                  onClick={() => setStatusModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                >
                  <HiChevronDown className="w-4 h-4" />
                  تغییر وضعیت
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* بدنه */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ستون چپ */}
              <div className="space-y-4">
                {/* آیتم‌ها */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    آیتم‌ها ({order.items?.length || order.items_count})
                  </h3>
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product_title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} عدد × {formatPrice(item.paid_price)}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-gray-900 ml-3">
                          {formatPrice(item.paid_price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* آدرس */}
                {order.shipping?.address && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                      <HiLocationMarker className="w-4 h-4 text-blue-500" />{" "}
                      آدرس تحویل
                    </h3>
                    <div className="p-3 bg-gray-50 rounded-xl text-sm space-y-1">
                      <p className="text-gray-700">{order.shipping.address}</p>
                      <p className="text-gray-500 text-xs">
                        {order.shipping.province}، {order.shipping.city} ·
                        {order.shipping.receiver_name} ·
                        {order.shipping.receiver_mobile}
                      </p>
                      <p className="text-gray-400 text-xs">
                        کد پستی: {order.shipping.postal_code}
                      </p>
                    </div>
                  </div>
                )}

                {/* کد رهگیری */}
                {order.tracking_code && (
                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <p className="text-xs text-indigo-600 mb-1 flex items-center gap-1">
                      <HiTruck className="w-3.5 h-3.5" /> کد رهگیری
                    </p>
                    <p className="text-lg font-bold text-indigo-700 font-mono">
                      {order.tracking_code}
                    </p>
                  </div>
                )}

                {/* یادداشت */}
                {order.status_note && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs text-amber-600 mb-1">یادداشت ادمین</p>
                    <p className="text-sm text-amber-800">
                      {order.status_note}
                    </p>
                  </div>
                )}
              </div>

              {/* ستون راست */}
              <div className="space-y-4">
                {/* اطلاعات کاربر */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                    <HiUser className="w-4 h-4 text-blue-500" /> اطلاعات کاربر
                  </h3>
                  <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">نام</span>
                      <span className="font-medium">{order.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">موبایل</span>
                      <span className="font-medium font-mono" dir="ltr">
                        {order.user.mobile}
                      </span>
                    </div>
                    {order.user.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">ایمیل</span>
                        <span className="font-medium text-xs" dir="ltr">
                          {order.user.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* خلاصه مالی */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    خلاصه مالی
                  </h3>
                  <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>جمع</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>تخفیف</span>
                        <span>− {formatPrice(order.discount)}</span>
                      </div>
                    )}
                    {order.coupon_discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>
                          کوپن {order.coupon_code && `(${order.coupon_code})`}
                        </span>
                        <span>− {formatPrice(order.coupon_discount)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                      <span>مبلغ نهایی</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* جزئیات */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">جزئیات</h3>
                  <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>تاریخ ثبت</span>
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                    {order.paid_at && (
                      <div className="flex justify-between text-gray-600">
                        <span>تاریخ پرداخت</span>
                        <span>{formatDate(order.paid_at)}</span>
                      </div>
                    )}
                    {order.latest_transaction?.ref_id && (
                      <div className="flex justify-between text-gray-600">
                        <span>کد پیگیری</span>
                        <span className="font-mono text-xs">
                          {order.latest_transaction.ref_id}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* فوتر */}
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              بستن
            </button>
          </div>
        </div>
      </div>

      {statusModalOpen && (
        <StatusModal
          order={order}
          onClose={() => setStatusModalOpen(false)}
          onSuccess={onStatusChange}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    stats: {
      total: 0,
      pending: 0,
      paid: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
      failed: 0,
      total_revenue: 0,
    } as Stats,
  });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [meta.current_page, filter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await adminOrdersAPI.getAll({
        page: meta.current_page,
        per_page: 15,
        status: filter !== "all" ? filter : undefined,
        search: search || undefined,
      });
      setOrders(res.data.data);
      setMeta((prev) => ({
        ...prev,
        current_page: res.data.meta.current_page,
        last_page: res.data.meta.last_page,
        total: res.data.meta.total,
        stats: res.data.meta.stats || prev.stats,
      }));
    } catch {
      toast.error("خطا در دریافت سفارشات");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
    setLoadingOrder(true);
    try {
      const res = await adminOrdersAPI.getOne(order.id);
      setSelectedOrder(res.data.data);
    } catch {
      toast.error("خطا در دریافت جزئیات");
    } finally {
      setLoadingOrder(false);
    }
  };

  const filters = [
    { key: "all", label: "همه", count: meta.stats.total },
    { key: "pending", label: "در انتظار", count: meta.stats.pending },
    { key: "paid", label: "پرداخت شده", count: meta.stats.paid },
    { key: "processing", label: "در حال پردازش", count: meta.stats.processing },
    { key: "shipped", label: "ارسال شده", count: meta.stats.shipped },
    { key: "delivered", label: "تحویل شده", count: meta.stats.delivered },
    { key: "cancelled", label: "لغو شده", count: meta.stats.cancelled },
    { key: "returned", label: "مرجوعی", count: meta.stats.returned },
    { key: "failed", label: "ناموفق", count: meta.stats.failed },
  ];

  const columns = [
    {
      header: "سفارش",
      render: (row: Order) => (
        <div>
          <p className="font-medium font-mono text-sm text-gray-900">
            {row.order_number}
          </p>
          <p className="text-xs text-gray-400">{formatDate(row.created_at)}</p>
        </div>
      ),
    },
    {
      header: "کاربر",
      render: (row: Order) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {row.user?.name || "−"}
          </p>
          <p className="text-xs text-gray-500" dir="ltr">
            {row.user?.mobile}
          </p>
        </div>
      ),
    },
    {
      header: "مبلغ",
      render: (row: Order) => (
        <p className="font-medium text-sm">{formatPrice(row.total)}</p>
      ),
    },
    {
      header: "وضعیت",
      render: (row: Order) => {
        const cfg = STATUS_CONFIG[row.status] || STATUS_CONFIG.pending;
        const Icon = cfg.icon;
        const colors: Record<string, string> = {
          delivered: "bg-green-100 text-green-700",
          shipped: "bg-indigo-100 text-indigo-700",
          processing: "bg-purple-100 text-purple-700",
          paid: "bg-blue-100 text-blue-700",
          cancelled: "bg-gray-100 text-gray-600",
          returned: "bg-orange-100 text-orange-700",
          failed: "bg-red-100 text-red-700",
          pending: "bg-yellow-100 text-yellow-700",
        };
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colors[row.status] || colors.pending}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {cfg.label}
          </span>
        );
      },
    },
    {
      header: "عملیات",
      render: (row: Order) => (
        <button
          onClick={() => handleViewOrder(row)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        >
          <HiEye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <Header title="مدیریت سفارشات" />

      <div className="p-6 space-y-6">
        {/* آمار */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "کل سفارشات",
              value: meta.stats.total,
              icon: HiShoppingBag,
              color: "bg-blue-100 text-blue-600",
            },
            {
              label: "پرداخت شده",
              value: meta.stats.paid,
              icon: HiCheckCircle,
              color: "bg-green-100 text-green-600",
            },
            {
              label: "در انتظار",
              value: meta.stats.pending,
              icon: HiClock,
              color: "bg-yellow-100 text-yellow-600",
            },
            {
              label: "درآمد کل",
              value: formatPrice(meta.stats.total_revenue),
              icon: HiTrendingUp,
              color: "bg-purple-100 text-purple-600",
              isText: true,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color.split(" ")[0]}`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color.split(" ")[1]}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p
                  className={`font-bold ${(stat as any).isText ? "text-sm" : "text-xl"} text-gray-900`}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* جستجو + فیلتر */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <HiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadOrders()}
                  placeholder="جستجو با شماره سفارش یا نام کاربر..."
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <Button onClick={loadOrders} variant="primary" size="sm">
                جستجو
              </Button>
            </div>
          </div>

          {/* فیلترهای وضعیت */}
          <div className="p-4 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setFilter(f.key);
                  setMeta((p) => ({ ...p, current_page: 1 }));
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  filter === f.key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
                {f.count > 0 && (
                  <span
                    className={`mr-1 px-1.5 py-0.5 rounded-full text-xs ${
                      filter === f.key ? "bg-white/20" : "bg-gray-200"
                    }`}
                  >
                    {f.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* جدول */}
        <div className="bg-white rounded-xl shadow-sm">
          <Table columns={columns} data={orders} loading={loading} />
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={(page) =>
              setMeta((p) => ({ ...p, current_page: page }))
            }
          />
        </div>
      </div>

      {/* مودال جزئیات */}
      {detailModalOpen &&
        selectedOrder &&
        (loadingOrder ? (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl p-8">
              <div className="w-10 h-10 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            </div>
          </div>
        ) : (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => {
              setDetailModalOpen(false);
              setSelectedOrder(null);
            }}
            onStatusChange={() => {
              loadOrders();
            }}
          />
        ))}
    </div>
  );
}
