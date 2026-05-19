"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Pagination from "@/app/_components/admin/Pagination";
import {
  HiSearch,
  HiEye,
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

// ── Types ──
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
  shipping_carrier: string | null; // ← اضافه
  status_note: string | null;
  items_count: number;
  items?: OrderItem[];
  payment_method: string;
  payment_receipt_url: string | null;
  receipt_status: string | null;
  receipt_note: string | null;
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
  canceled: number;
  returned: number;
  failed: number;
  total_revenue: number;
}

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

const CARRIERS: Record<string, string> = {
  post: "پست ملی",
  snapbox: "اسنپ‌باکس",
  tipax: "تیپاکس",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; textColor: string; bgColor: string; icon: any }
> = {
  pending: {
    label: "در انتظار",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-100",
    icon: HiClock,
  },
  paid: {
    label: "پرداخت شده",
    textColor: "text-blue-700",
    bgColor: "bg-blue-100",
    icon: HiCreditCard,
  },
  processing: {
    label: "در حال پردازش",
    textColor: "text-purple-700",
    bgColor: "bg-purple-100",
    icon: HiCube,
  },
  shipped: {
    label: "ارسال شده",
    textColor: "text-indigo-700",
    bgColor: "bg-indigo-100",
    icon: HiTruck,
  },
  delivered: {
    label: "تحویل داده شد",
    textColor: "text-green-700",
    bgColor: "bg-green-100",
    icon: HiCheckCircle,
  },
  canceled: {
    label: "لغو شده",
    textColor: "text-gray-700",
    bgColor: "bg-gray-100",
    icon: HiBan,
  },
  returned: {
    label: "مرجوعی",
    textColor: "text-orange-700",
    bgColor: "bg-orange-100",
    icon: HiRefresh,
  },
  failed: {
    label: "ناموفق",
    textColor: "text-red-700",
    bgColor: "bg-red-100",
    icon: HiXCircle,
  },
};

const TRANSITIONS: Record<string, { status: string; label: string }[]> = {
  paid: [
    { status: "processing", label: "شروع پردازش" },
    { status: "canceled", label: "لغو سفارش" },
  ],
  processing: [
    { status: "shipped", label: "ارسال شد" },
    { status: "canceled", label: "لغو سفارش" },
  ],
  shipped: [
    { status: "delivered", label: "تحویل شد" },
    { status: "returned", label: "مرجوعی" },
  ],
  delivered: [{ status: "returned", label: "مرجوعی" }],
  pending: [{ status: "canceled", label: "لغو سفارش" }],
};

// ── Portal ──
function PortalModal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  if (!mounted) return null;
  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
    >
      {children}
    </div>,
    document.body,
  );
}

// ── Status Modal ──
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
  const [trackingCode, setTrackingCode] = useState(order.tracking_code || "");
  const [carrier, setCarrier] = useState(""); // ← اضافه
  const [saving, setSaving] = useState(false);

  const inp =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition";

  const handleSave = async () => {
    if (!selectedStatus) return;
    if (selectedStatus === "shipped" && !trackingCode.trim()) {
      toast.error("کد رهگیری الزامی است");
      return;
    }
    if (selectedStatus === "shipped" && !carrier) {
      toast.error("شرکت حمل‌ونقل را انتخاب کنید");
      return;
    }

    setSaving(true);
    try {
      await adminOrdersAPI.updateStatus(order.id, {
        status: selectedStatus as any,
        note: note.trim() || undefined,
        tracking_code: trackingCode.trim() || undefined,
        shipping_carrier: carrier || undefined, // ← اضافه
      });
      toast.success("وضعیت بروزرسانی شد — SMS ارسال شد");
      onSuccess();
      onClose(); // ← fix: بستن modal
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در بروزرسانی");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalModal>
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
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
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-900 font-mono">
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

          {transitions.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-4">
              این سفارش قابل تغییر وضعیت نیست
            </p>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وضعیت جدید <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {transitions.map((t) => (
                    <label
                      key={t.status}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${selectedStatus === t.status ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-gray-200"}`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={t.status}
                        checked={selectedStatus === t.status}
                        onChange={() => setSelectedStatus(t.status)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {t.label}
                        </span>
                        {t.status === "shipped" && (
                          <p className="text-xs text-gray-400">
                            SMS کد رهگیری ارسال میشه
                          </p>
                        )}
                        {t.status === "canceled" && (
                          <p className="text-xs text-gray-400">
                            SMS لغو سفارش ارسال میشه
                          </p>
                        )}
                        {t.status === "delivered" && (
                          <p className="text-xs text-gray-400">
                            SMS تحویل ارسال میشه
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* فیلدهای ارسال */}
              {selectedStatus === "shipped" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      شرکت حمل‌ونقل <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className={inp}
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="post">پست ملی</option>
                      <option value="snapbox">اسنپ‌باکس</option>
                      <option value="tipax">تیپاکس</option>
                    </select>
                  </div>
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
                    <p className="text-xs text-gray-400 mt-1">
                      این کد در SMS به مشتری ارسال میشه
                    </p>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  یادداشت (اختیاری)
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="پیام اضافه برای کاربر..."
                  className={inp}
                />
              </div>

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
                    (selectedStatus === "shipped" &&
                      (!trackingCode.trim() || !carrier))
                  }
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {saving ? "در حال ثبت..." : "ثبت + ارسال SMS"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </PortalModal>
  );
}

// ── Receipt Section ──
function ReceiptSection({
  order,
  onReviewed,
}: {
  order: Order;
  onReviewed: () => void;
}) {
  const [reviewing, setReviewing] = useState(false);

  const handleReview = async (action: "approve" | "reject") => {
    const note = action === "reject" ? (prompt("دلیل رد فیش:") ?? "") : "";
    setReviewing(true);
    try {
      await adminOrdersAPI.reviewReceipt(order.id, { action, note });
      toast.success(action === "approve" ? "فیش تایید شد" : "فیش رد شد");
      onReviewed();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا");
    } finally {
      setReviewing(false);
    }
  };

  if (order.payment_method !== "receipt" || !order.receipt_status) return null;

  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
      <p className="font-semibold text-amber-800 text-sm">
        🏦 پرداخت کارت به کارت
      </p>
      {order.payment_receipt_url && (
        <a
          href={order.payment_receipt_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={order.payment_receipt_url}
            alt="فیش پرداخت"
            className="max-h-52 rounded-xl border border-amber-200 cursor-zoom-in hover:opacity-90 transition"
          />
        </a>
      )}
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
          order.receipt_status === "pending"
            ? "bg-amber-100 text-amber-700"
            : order.receipt_status === "approved"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
        }`}
      >
        {order.receipt_status === "pending"
          ? "⏳ در انتظار بررسی"
          : order.receipt_status === "approved"
            ? "✅ تایید شده"
            : "❌ رد شده"}
      </div>
      {order.receipt_note && (
        <p className="text-xs text-gray-600 bg-white rounded-lg p-2 border border-amber-100">
          توضیح: {order.receipt_note}
        </p>
      )}
      {order.receipt_status === "pending" && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => handleReview("approve")}
            disabled={reviewing}
            className="flex-1 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition"
          >
            ✅ تایید فیش
          </button>
          <button
            onClick={() => handleReview("reject")}
            disabled={reviewing}
            className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition"
          >
            ❌ رد فیش
          </button>
        </div>
      )}
    </div>
  );
}

// ── Order Detail Modal ──
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
      <PortalModal>
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[88vh] overflow-hidden flex flex-col shadow-2xl">
          {/* هدر */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-bold text-gray-900 font-mono">
                {order.order_number}
              </h2>
              <span
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusCfg.bgColor} ${statusCfg.textColor}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {statusCfg.label}
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                {order.payment_method === "receipt"
                  ? "🏦 کارت به کارت"
                  : "💳 آنلاین"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {canChange && (
                <button
                  onClick={() => setStatusModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                >
                  <HiChevronDown className="w-4 h-4" /> تغییر وضعیت
                </button>
              )}
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* بدنه */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ستون راست */}
              <div className="space-y-4">
                <ReceiptSection
                  order={order}
                  onReviewed={() => {
                    onStatusChange();
                    onClose();
                  }}
                />

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                    آیتم‌های سفارش ({order.items?.length || order.items_count})
                  </h3>
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-1 min-w-0 ml-3">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product_title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} عدد × {formatPrice(item.paid_price)}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                          {formatPrice(item.paid_price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.shipping?.address && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-1.5">
                      <HiLocationMarker className="w-4 h-4 text-blue-500" />{" "}
                      آدرس تحویل
                    </h3>
                    <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-sm">
                      <p className="text-gray-700">{order.shipping.address}</p>
                      <p className="text-gray-500 text-xs">
                        {order.shipping.province}، {order.shipping.city}
                      </p>
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span>{order.shipping.receiver_name}</span>
                        <span dir="ltr">{order.shipping.receiver_mobile}</span>
                        <span>کد: {order.shipping.postal_code}</span>
                      </div>
                    </div>
                  </div>
                )}

                {order.tracking_code && (
                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <p className="text-xs text-indigo-600 mb-1 flex items-center gap-1">
                      <HiTruck className="w-3.5 h-3.5" /> کد رهگیری پستی
                      {order.shipping_carrier &&
                        CARRIERS[order.shipping_carrier] && (
                          <span className="mr-1">
                            — {CARRIERS[order.shipping_carrier]}
                          </span>
                        )}
                    </p>
                    <p className="text-xl font-bold text-indigo-700 font-mono">
                      {order.tracking_code}
                    </p>
                  </div>
                )}

                {order.status_note && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs text-amber-600 mb-1">یادداشت</p>
                    <p className="text-sm text-amber-800">
                      {order.status_note}
                    </p>
                  </div>
                )}
              </div>

              {/* ستون چپ */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-1.5">
                    <HiUser className="w-4 h-4 text-blue-500" /> اطلاعات کاربر
                  </h3>
                  <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">نام</span>
                      <span className="font-medium">{order.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">موبایل</span>
                      <span className="font-mono text-xs" dir="ltr">
                        {order.user.mobile}
                      </span>
                    </div>
                    {order.user.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">ایمیل</span>
                        <span className="text-xs" dir="ltr">
                          {order.user.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">
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
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                    جزئیات
                  </h3>
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

          <div className="px-6 py-4 border-t border-gray-100 flex justify-end flex-shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              بستن
            </button>
          </div>
        </div>
      </PortalModal>

      {statusModalOpen && (
        <StatusModal
          order={order}
          onClose={() => setStatusModalOpen(false)}
          onSuccess={() => {
            onStatusChange();
            setStatusModalOpen(false);
            // ← fix: detail modal هم بسته میشه تا data آپدیت بشه
            onClose();
          }}
        />
      )}
    </>
  );
}

// ── Page ──
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
      canceled: 0,
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
        search: search.trim() || undefined,
      });
      setOrders(res.data.data);
      setMeta((p) => ({
        ...p,
        current_page: res.data.meta.current_page,
        last_page: res.data.meta.last_page,
        total: res.data.meta.total,
        stats: res.data.meta.stats || p.stats,
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
    { key: "canceled", label: "لغو شده", count: meta.stats.canceled },
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
      header: "پرداخت",
      render: (row: Order) => (
        <div>
          <span className="text-xs text-gray-600">
            {row.payment_method === "receipt" ? "🏦 کارت به کارت" : "💳 آنلاین"}
          </span>
          {row.receipt_status === "pending" && (
            <span className="block text-xs text-amber-500 font-medium mt-0.5">
              ⏳ فیش در انتظار
            </span>
          )}
        </div>
      ),
    },
    {
      header: "وضعیت",
      render: (row: Order) => {
        const cfg = STATUS_CONFIG[row.status] || STATUS_CONFIG.pending;
        const Icon = cfg.icon;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bgColor} ${cfg.textColor}`}
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
          title="مشاهده جزئیات"
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "کل سفارشات",
              value: meta.stats.total,
              icon: HiShoppingBag,
              bg: "bg-blue-100",
              ic: "text-blue-600",
              isText: false,
            },
            {
              label: "پرداخت شده",
              value: meta.stats.paid,
              icon: HiCheckCircle,
              bg: "bg-green-100",
              ic: "text-green-600",
              isText: false,
            },
            {
              label: "در انتظار",
              value: meta.stats.pending,
              icon: HiClock,
              bg: "bg-yellow-100",
              ic: "text-yellow-600",
              isText: false,
            },
            {
              label: "درآمد کل",
              value: formatPrice(meta.stats.total_revenue),
              icon: HiTrendingUp,
              bg: "bg-purple-100",
              ic: "text-purple-600",
              isText: true,
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}
              >
                <s.icon className={`w-5 h-5 ${s.ic}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p
                  className={`font-bold text-gray-900 ${s.isText ? "text-sm" : "text-xl"}`}
                >
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

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
          <div className="p-4 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setFilter(f.key);
                  setMeta((p) => ({ ...p, current_page: 1 }));
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${filter === f.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {f.label}
                {f.count > 0 && (
                  <span
                    className={`mr-1.5 px-1.5 py-0.5 rounded-full text-xs ${filter === f.key ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    {f.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

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

      {detailModalOpen &&
        (loadingOrder ? (
          <PortalModal>
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDetailModalOpen(false)}
            />
            <div className="relative bg-white rounded-2xl p-10 shadow-2xl">
              <div className="w-10 h-10 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-500 mt-3 text-center">
                در حال بارگذاری...
              </p>
            </div>
          </PortalModal>
        ) : selectedOrder ? (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => {
              setDetailModalOpen(false);
              setSelectedOrder(null);
            }}
            onStatusChange={loadOrders}
          />
        ) : null)}
    </div>
  );
}
