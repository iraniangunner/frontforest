"use client";

// app/(public)/profile/orders/[id]/page.tsx
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  HiArrowRight,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiCreditCard,
  HiLocationMarker,
  HiTruck,
  HiCube,
  HiRefresh,
  HiBan,
  HiHashtag,
  HiUpload,
  HiX,
} from "react-icons/hi";
import { ordersAPI, checkoutAPI } from "@/lib/api";
import toast from "react-hot-toast";

// ── Types ──
interface OrderItem {
  id: number;
  product_id: number;
  product_title: string;
  product_slug: string;
  product_thumbnail: string | null;
  price: number;
  sale_price: number | null;
  paid_price: number;
  quantity: number;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  status_label: string;
  subtotal: number;
  discount: number;
  coupon_code: string | null;
  coupon_discount: number;
  total: number;
  tracking_code: string | null;
  status_note: string | null;
  items: OrderItem[];
  // ── فیش پرداخت ──
  payment_method: string; // online | receipt
  payment_receipt_url: string | null;
  receipt_status: string | null; // pending | approved | rejected
  receipt_note: string | null;
  // ─────────────────
  shipping: {
    receiver_name: string;
    receiver_mobile: string;
    province: string;
    city: string;
    address: string;
    postal_code: string;
  } | null;
  timeline: {
    created_at: string | null;
    paid_at: string | null;
    processing_at: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
    cancelled_at: string | null;
  };
  latest_transaction: { ref_id: string | null; status: string } | null;
}

const formatPrice = (n: number) => Number(n).toLocaleString("fa-IR") + " تومان";
const formatDate = (d: string | null) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS: Record<
  string,
  { label: string; color: string; bg: string; icon: any }
> = {
  pending: {
    label: "در انتظار پرداخت",
    color: "text-yellow-700",
    bg: "bg-yellow-100",
    icon: HiClock,
  },
  paid: {
    label: "پرداخت شده",
    color: "text-blue-700",
    bg: "bg-blue-100",
    icon: HiCreditCard,
  },
  processing: {
    label: "در حال پردازش",
    color: "text-purple-700",
    bg: "bg-purple-100",
    icon: HiCube,
  },
  shipped: {
    label: "ارسال شده",
    color: "text-indigo-700",
    bg: "bg-indigo-100",
    icon: HiTruck,
  },
  delivered: {
    label: "تحویل داده شده",
    color: "text-green-700",
    bg: "bg-green-100",
    icon: HiCheckCircle,
  },
  canceled: {
    label: "لغو شده",
    color: "text-gray-700",
    bg: "bg-gray-100",
    icon: HiBan,
  },
  returned: {
    label: "مرجوعی",
    color: "text-orange-700",
    bg: "bg-orange-100",
    icon: HiRefresh,
  },
  failed: {
    label: "ناموفق",
    color: "text-red-700",
    bg: "bg-red-100",
    icon: HiXCircle,
  },
};

// ── Timeline ──
function OrderTimeline({
  status,
  timeline,
}: {
  status: string;
  timeline: Order["timeline"];
}) {
  const steps = [
    { key: "created_at", label: "ثبت سفارش", icon: HiHashtag, always: true },
    {
      key: "paid_at",
      label: "پرداخت شده",
      icon: HiCreditCard,
      statuses: ["paid", "processing", "shipped", "delivered"],
    },
    {
      key: "processing_at",
      label: "در حال پردازش",
      icon: HiCube,
      statuses: ["processing", "shipped", "delivered"],
    },
    {
      key: "shipped_at",
      label: "ارسال شده",
      icon: HiTruck,
      statuses: ["shipped", "delivered"],
    },
    {
      key: "delivered_at",
      label: "تحویل داده شده",
      icon: HiCheckCircle,
      statuses: ["delivered"],
    },
  ];

  if (status === "canceled")
    return (
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <HiBan className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <p className="font-medium text-gray-700">سفارش لغو شد</p>
          {timeline.cancelled_at && (
            <p className="text-xs text-gray-400">
              {formatDate(timeline.cancelled_at)}
            </p>
          )}
        </div>
      </div>
    );

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isCompleted = step.always
          ? !!timeline[step.key as keyof typeof timeline]
          : step.statuses?.includes(status) ||
            !!timeline[step.key as keyof typeof timeline];
        const date = timeline[step.key as keyof typeof timeline];
        const Icon = step.icon;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                  isCompleted
                    ? "bg-green-500 border-green-500"
                    : "bg-white border-gray-200"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isCompleted ? "text-white" : "text-gray-300"}`}
                />
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 h-8 my-1 ${isCompleted ? "bg-green-300" : "bg-gray-200"}`}
                />
              )}
            </div>
            <div className="pb-6 flex-1">
              <p
                className={`font-medium text-sm ${isCompleted ? "text-gray-900" : "text-gray-400"}`}
              >
                {step.label}
              </p>
              {date && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(date as string)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── ReceiptSection — نمایش وضعیت فیش برای کاربر ──
function ReceiptSection({
  order,
  onUploaded,
}: {
  order: Order;
  onUploaded: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (order.payment_method !== "receipt") return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      toast.error("حجم فایل نباید بیشتر از ۲MB باشد");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("receipt", file);
      fd.append("order_id", String(order.id));
      await checkoutAPI.submitWithReceipt(fd);
      toast.success("فیش آپلود شد. منتظر تایید ادمین باشید");
      setFile(null);
      setPreview(null);
      onUploaded();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در آپلود");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
      <h2 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
        🏦 پرداخت کارت به کارت
      </h2>

      {/* وضعیت فیش */}
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-4 ${
          order.receipt_status === "pending"
            ? "bg-amber-100 text-amber-700"
            : order.receipt_status === "approved"
              ? "bg-green-100 text-green-700"
              : order.receipt_status === "rejected"
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-500"
        }`}
      >
        {order.receipt_status === "pending"
          ? "⏳ فیش در انتظار بررسی"
          : order.receipt_status === "approved"
            ? "✅ فیش تایید شده"
            : order.receipt_status === "rejected"
              ? "❌ فیش رد شده"
              : "در انتظار آپلود فیش"}
      </div>

      {/* تصویر فیش فعلی */}
      {order.payment_receipt_url && (
        <div className="mb-4">
          <p className="text-xs text-amber-700 mb-2">فیش آپلود شده:</p>
          <a
            href={order.payment_receipt_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={order.payment_receipt_url}
              alt="فیش پرداخت"
              className="max-h-40 rounded-xl border border-amber-200 cursor-zoom-in"
            />
          </a>
        </div>
      )}

      {/* توضیح رد فیش */}
      {order.receipt_status === "rejected" && order.receipt_note && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-xs text-red-600 font-medium mb-1">دلیل رد:</p>
          <p className="text-sm text-red-700">{order.receipt_note}</p>
        </div>
      )}

      {!order.payment_receipt_url && order.status === "pending" && (
        <div className="space-y-3">
          <p className="text-xs text-amber-700">
            {order.receipt_status === "rejected"
              ? "لطفاً فیش معتبر آپلود کنید:"
              : "لطفاً فیش پرداخت را آپلود کنید:"}
          </p>

          {preview && (
            <div className="relative w-32 h-32 mb-2">
              <Image
                src={preview}
                alt="پیش‌نمایش"
                fill
                className="object-cover rounded-xl"
              />
              <button
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <HiX className="w-3 h-3" />
              </button>
            </div>
          )}

          <label className="inline-flex items-center gap-2 px-4 py-2 border border-amber-300 rounded-xl text-sm text-amber-700 hover:border-amber-400 cursor-pointer bg-white transition-colors">
            <HiUpload className="w-4 h-4" />
            {file ? "تغییر فیش" : "انتخاب تصویر فیش"}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>

          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="block w-full py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors"
            >
              {uploading ? "در حال آپلود..." : "ارسال فیش"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ──
export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (orderId) loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.getOne(orderId);
      setOrder(res.data.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error("سفارش یافت نشد");
        router.push("/profile/orders");
      } else if (error.response?.status === 403) {
        toast.error("دسترسی غیرمجاز");
        router.push("/profile/orders");
      } else {
        toast.error("خطا در دریافت سفارش");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!order || !confirm("آیا از لغو این سفارش اطمینان دارید؟")) return;
    setCancelling(true);
    try {
      await ordersAPI.cancel(order.id);
      toast.success("سفارش لغو شد");
      loadOrder();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در لغو سفارش");
    } finally {
      setCancelling(false);
    }
  };

  const handleRepay = async () => {
    if (!order) return;
    try {
      const res = await ordersAPI.pay(order.id);
      if (res.data.payment_url) window.location.href = res.data.payment_url;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در اتصال به درگاه");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );

  if (!order) return null;

  const statusConfig = STATUS[order.status] || STATUS.pending;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* هدر */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/profile/orders"
            className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition"
          >
            <HiArrowRight className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-lg font-bold text-gray-900">
                سفارش {order.order_number}
              </h1>
              <span
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {STATUS[order.status]?.label || order.status_label}
              </span>
              {/* نشانه روش پرداخت */}
              {order.payment_method === "receipt" && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                  🏦 کارت به کارت
                </span>
              )}
            </div>
          </div>

          {/* دکمه‌های اکشن */}
          {order.status === "pending" && order.payment_method === "online" && (
            <div className="flex gap-2">
              <button
                onClick={handleRepay}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition"
              >
                پرداخت
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
              >
                {cancelling ? "..." : "لغو"}
              </button>
            </div>
          )}
          {order.status === "pending" && order.payment_method === "receipt" && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
            >
              {cancelling ? "..." : "لغو سفارش"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ستون چپ */}
          <div className="lg:col-span-2 space-y-4">
            {/* ── بخش فیش پرداخت ── */}
            <ReceiptSection order={order} onUploaded={loadOrder} />

            {/* آیتم‌ها */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">
                آیتم‌های سفارش ({order.items?.length || 0})
              </h2>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      {item.product_thumbnail ? (
                        <Image
                          src={item.product_thumbnail}
                          alt={item.product_title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HiCube className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product_slug}`}
                        className="text-sm font-medium text-gray-900 hover:text-teal-600 transition truncate block"
                      >
                        {item.product_title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.quantity} عدد × {formatPrice(item.paid_price)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                      {formatPrice(item.paid_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              {order.latest_transaction?.ref_id && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">کد پیگیری پرداخت:</p>
                  <p className="text-sm font-mono font-bold text-gray-800 mt-0.5">
                    {order.latest_transaction.ref_id}
                  </p>
                </div>
              )}
            </div>

            {/* آدرس */}
            {order.shipping?.address && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <HiLocationMarker className="w-5 h-5 text-teal-500" /> آدرس
                  تحویل
                </h2>
                <p className="text-sm text-gray-700 mb-2">
                  {order.shipping.address}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span>
                    {order.shipping.province}، {order.shipping.city}
                  </span>
                  <span>{order.shipping.receiver_name}</span>
                  <span dir="ltr">{order.shipping.receiver_mobile}</span>
                  <span>کد پستی: {order.shipping.postal_code}</span>
                </div>
              </div>
            )}

            {/* کد رهگیری */}
            {order.tracking_code && (
              <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
                <h2 className="font-semibold text-indigo-900 flex items-center gap-2 mb-2">
                  <HiTruck className="w-5 h-5 text-indigo-500" /> کد رهگیری
                  مرسوله
                </h2>
                <p className="text-2xl font-bold text-indigo-700 font-mono tracking-wider">
                  {order.tracking_code}
                </p>
                <a
                  href="https://tracking.post.ir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-500 hover:text-indigo-700 mt-1 inline-block"
                >
                  رهگیری در سایت پست ملی ←
                </a>
              </div>
            )}

            {/* یادداشت */}
            {order.status_note && (
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                <p className="text-sm text-amber-800">
                  <span className="font-medium">یادداشت: </span>
                  {order.status_note}
                </p>
              </div>
            )}

            {/* پشتیبانی */}
            <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100">
              <p className="text-sm text-teal-800 mb-2">
                سوالی درباره سفارش دارید؟
              </p>
              <Link
                href="/contact"
                className="text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                تماس با پشتیبانی ←
              </Link>
            </div>
          </div>

          {/* ستون راست */}
          <div className="space-y-4">
            {/* Timeline */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">پیگیری سفارش</h2>
              <OrderTimeline status={order.status} timeline={order.timeline} />
            </div>

            {/* خلاصه مالی */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">خلاصه مالی</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>جمع محصولات</span>
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
                      کوپن{" "}
                      {order.coupon_code && (
                        <span className="font-mono text-xs">
                          ({order.coupon_code})
                        </span>
                      )}
                    </span>
                    <span>− {formatPrice(order.coupon_discount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-gray-900">
                  <span>مبلغ پرداختی</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
