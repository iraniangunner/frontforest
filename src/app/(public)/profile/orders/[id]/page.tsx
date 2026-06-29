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
  HiDownload,
} from "react-icons/hi";
import { ordersAPI, checkoutAPI } from "@/lib/api";
import toast from "react-hot-toast";

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
  shipping_carrier: string | null;
  status_note: string | null;
  items: OrderItem[];
  payment_method: string;
  payment_receipt_url: string | null;
  receipt_status: string | null;
  receipt_note: string | null;
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
  return_request: { id: number; status: string; refund_status?: string } | null;
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

const CARRIERS: Record<string, { label: string; url: string }> = {
  post: { label: "پست ملی", url: "https://tracking.post.ir" },
  snapbox: { label: "اسنپ‌باکس", url: "https://snapbox.ir/tracking" },
  tipax: { label: "تیپاکس", url: "https://tipax.com.ir/fa/tracking" },
};

const STATUS: Record<
  string,
  { label: string; color: string; bg: string; icon: any }
> = {
  pending: {
    label: "در انتظار پرداخت",
    color: "text-[#A9791C]",
    bg: "bg-[#FBEFD7]",
    icon: HiClock,
  },
  paid: {
    label: "پرداخت شده",
    color: "text-[#A72F3B]",
    bg: "bg-[#F6EAEB]",
    icon: HiCreditCard,
  },
  processing: {
    label: "در حال پردازش",
    color: "text-[#A9791C]",
    bg: "bg-[#FBEFD7]",
    icon: HiCube,
  },
  shipped: {
    label: "ارسال شده",
    color: "text-[#A72F3B]",
    bg: "bg-[#F6EAEB]",
    icon: HiTruck,
  },
  delivered: {
    label: "تحویل داده شده",
    color: "text-[#00966D]",
    bg: "bg-[#E6F4EF]",
    icon: HiCheckCircle,
  },
  canceled: {
    label: "لغو شده",
    color: "text-[#C30000]",
    bg: "bg-[#FBEAEA]",
    icon: HiBan,
  },
  returned: {
    label: "مرجوعی",
    color: "text-[#A9791C]",
    bg: "bg-[#FBEFD7]",
    icon: HiRefresh,
  },
  failed: {
    label: "ناموفق",
    color: "text-[#C30000]",
    bg: "bg-[#FBEAEA]",
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
      <div className="flex items-center gap-3 p-4 bg-[#F8F8F8] rounded-xl">
        <div className="w-10 h-10 bg-[#EDEDED] rounded-full flex items-center justify-center">
          <HiBan className="w-5 h-5 text-[#898989]" />
        </div>
        <div>
          <p className="font-medium text-[#656565]">سفارش لغو شد</p>
          {timeline.cancelled_at && (
            <p className="text-xs text-[#AFAFAF]">
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
                    ? "bg-[#00966D] border-[#00966D]"
                    : "bg-white border-[#EDEDED]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isCompleted ? "text-white" : "text-[#CBCBCB]"
                  }`}
                />
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 h-8 my-1 ${
                    isCompleted ? "bg-[#00966D]/40" : "bg-[#EDEDED]"
                  }`}
                />
              )}
            </div>
            <div className="pb-6 flex-1">
              <p
                className={`font-medium text-sm ${
                  isCompleted ? "text-[#242424]" : "text-[#AFAFAF]"
                }`}
              >
                {step.label}
              </p>
              {date && (
                <p className="text-xs text-[#AFAFAF] mt-0.5">
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

// ── ReceiptSection ──
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

  if (order.payment_method !== "receipt" || order.status === "canceled")
    return null;

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
    <div className="bg-[#FBEFD7] rounded-2xl p-5 border border-[#F4B740]/40">
      <h2 className="font-semibold text-[#8A6310] mb-3">
        🏦 پرداخت کارت به کارت
      </h2>
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-4 ${
          order.receipt_status === "pending"
            ? "bg-[#FBEFD7] text-[#A9791C]"
            : order.receipt_status === "approved"
              ? "bg-[#E6F4EF] text-[#00966D]"
              : order.receipt_status === "rejected"
                ? "bg-[#FBEAEA] text-[#C30000]"
                : "bg-[#F5F5F5] text-[#898989]"
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

      {order.payment_receipt_url && (
        <div className="mb-4">
          <p className="text-xs text-[#A9791C] mb-2">فیش آپلود شده:</p>
          <a
            href={order.payment_receipt_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={order.payment_receipt_url}
              alt="فیش پرداخت"
              className="max-h-40 rounded-xl border border-[#F4B740]/40 cursor-zoom-in"
            />
          </a>
        </div>
      )}

      {order.receipt_status === "rejected" && order.receipt_note && (
        <div className="mb-4 p-3 bg-[#FBEAEA] border border-[#C30000]/20 rounded-xl">
          <p className="text-xs text-[#C30000] font-medium mb-1">دلیل رد:</p>
          <p className="text-sm text-[#C30000]">{order.receipt_note}</p>
        </div>
      )}

      {!order.payment_receipt_url && order.status === "pending" && (
        <div className="space-y-3">
          <p className="text-xs text-[#A9791C]">
            لطفاً فیش پرداخت را آپلود کنید:
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
                className="absolute -top-2 -left-2 w-6 h-6 bg-[#C30000] text-white rounded-full flex items-center justify-center"
              >
                <HiX className="w-3 h-3" />
              </button>
            </div>
          )}
          <label className="inline-flex items-center gap-2 px-4 py-2 border border-[#F4B740] rounded-xl text-sm text-[#A9791C] hover:border-[#A9791C] cursor-pointer bg-white transition-colors">
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
              className="block w-full py-2.5 bg-[#A9791C] text-white rounded-xl text-sm font-medium hover:bg-[#8A6310] disabled:opacity-50 transition-colors"
            >
              {uploading ? "در حال آپلود..." : "ارسال فیش"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── دکمه مرجوعی ──
function ReturnButton({ order }: { order: Order }) {
  if (order.status !== "delivered" && order.status !== "returned") return null;

  const rr = order.return_request;
  const deliveredAt = order.timeline?.delivered_at;
  const daysSince = deliveredAt
    ? Math.floor(
        (Date.now() - new Date(deliveredAt).getTime()) / (1000 * 60 * 60 * 24),
      )
    : null;
  const isExpired = daysSince !== null && daysSince > 7;

  if (rr?.status === "rejected")
    return (
      <span className="px-4 py-2 bg-[#FBEAEA] text-[#C30000] border border-[#C30000]/20 rounded-xl text-sm font-medium">
        ❌ مرجوعی رد شده
      </span>
    );

  if (rr?.status === "pending")
    return (
      <span className="px-4 py-2 bg-[#FBEFD7] text-[#A9791C] border border-[#F4B740]/40 rounded-xl text-sm font-medium">
        ⏳ مرجوعی در انتظار بررسی
      </span>
    );

  if (rr?.status === "approved") {
    if (rr.refund_status === "refunded")
      return (
        <span className="px-4 py-2 bg-[#E6F4EF] text-[#00966D] border border-[#00966D]/20 rounded-xl text-sm font-medium">
          ✅ مبلغ واریز شده
        </span>
      );
    return (
      <Link
        href={`/profile/orders/${order.id}/return`}
        className="px-4 py-2 bg-[#E6F4EF] text-[#00966D] border border-[#00966D]/20 rounded-xl text-sm font-medium hover:bg-[#D5EFE6] transition"
      >
        ✅ ثبت کد رهگیری مرجوعی
      </Link>
    );
  }

  if (!rr) {
    if (isExpired)
      return (
        <span className="px-4 py-2 bg-[#F8F8F8] text-[#AFAFAF] border border-[#EDEDED] rounded-xl text-sm">
          مهلت مرجوعی تمام شده
        </span>
      );
    return (
      <Link
        href={`/profile/orders/${order.id}/return`}
        className="px-4 py-2 border border-[#A72F3B] text-[#A72F3B] rounded-xl text-sm font-medium hover:bg-[#F6EAEB] transition"
      >
        درخواست مرجوعی
      </Link>
    );
  }

  return null;
}

// ── Page ──
export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
      } else toast.error("خطا در دریافت سفارش");
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

  const handleConfirmDelivery = async () => {
    if (!order || !confirm("آیا کالا را دریافت کرده‌اید؟")) return;
    setConfirming(true);
    try {
      await ordersAPI.confirmDelivery(order.id);
      toast.success("دریافت کالا تایید شد");
      loadOrder();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا");
    } finally {
      setConfirming(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!order) return;
    setDownloading(true);
    try {
      const res = await ordersAPI.downloadInvoice(order.id);
      // ساخت لینک دانلود از blob دریافتی
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${order.order_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      let msg = "خطا در دانلود فاکتور";
      try {
        const text = await err.response?.data?.text?.();
        if (text) msg = JSON.parse(text)?.message || msg;
      } catch {}
      toast.error(msg);
    } finally {
      setDownloading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-2 border-[#EDEDED] border-t-[#A72F3B] rounded-full animate-spin" />
      </div>
    );

  if (!order) return null;

  const statusConfig = STATUS[order.status] || STATUS.pending;
  const StatusIcon = statusConfig.icon;

  // فاکتور فقط برای سفارش‌هایی که پرداخت شده‌اند (و مراحل بعد) در دسترس است.
  const canDownloadInvoice = [
    "paid",
    "processing",
    "shipped",
    "delivered",
    "returned",
  ].includes(order.status);

  return (
    <div>
      {/* هدر */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/profile/orders"
          className="p-2 bg-white border border-[#F0F0F0] rounded-xl hover:bg-[#F8F8F8] transition"
        >
          <HiArrowRight className="w-5 h-5 text-[#656565]" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-bold text-[#242424]">
              سفارش {order.order_number}
            </h2>
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {STATUS[order.status]?.label || order.status_label}
            </span>
            {order.payment_method === "receipt" && (
              <span className="text-xs bg-[#FBEFD7] text-[#A9791C] px-2 py-1 rounded-full">
                🏦 کارت به کارت
              </span>
            )}
          </div>
        </div>

        {/* اکشن‌ها */}
        <div className="flex gap-2 flex-wrap">
          {order.status === "pending" && order.payment_method === "online" && (
            <>
              <button
                onClick={handleRepay}
                className="px-4 py-2 bg-[#A72F3B] text-white rounded-xl text-sm font-medium hover:bg-[#86262F] transition"
              >
                پرداخت
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-4 py-2 bg-[#FBEAEA] text-[#C30000] rounded-xl text-sm font-medium hover:bg-[#F6D5D5] transition disabled:opacity-50"
              >
                {cancelling ? "..." : "لغو"}
              </button>
            </>
          )}
          {order.status === "pending" && order.payment_method === "receipt" && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-4 py-2 bg-[#FBEAEA] text-[#C30000] rounded-xl text-sm font-medium hover:bg-[#F6D5D5] transition disabled:opacity-50"
            >
              {cancelling ? "..." : "لغو سفارش"}
            </button>
          )}
          {order.status === "shipped" && (
            <button
              onClick={handleConfirmDelivery}
              disabled={confirming}
              className="px-4 py-2 bg-[#00966D] text-white rounded-xl text-sm font-medium hover:bg-[#007A59] disabled:opacity-50 transition"
            >
              {confirming ? "..." : "✅ تایید دریافت کالا"}
            </button>
          )}

          {/* دانلود فاکتور — فقط برای سفارش‌های پرداخت‌شده */}
          {canDownloadInvoice && (
            <button
              onClick={handleDownloadInvoice}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#A72F3B] text-[#A72F3B] rounded-xl text-sm font-medium hover:bg-[#F6EAEB] disabled:opacity-50 transition-colors"
            >
              <HiDownload className="w-4 h-4" />
              {downloading ? "در حال دریافت..." : "دانلود فاکتور"}
            </button>
          )}

          <ReturnButton order={order} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <ReceiptSection order={order} onUploaded={loadOrder} />

          {/* آیتم‌ها */}
          <div className="bg-white rounded-2xl p-5 border border-[#F0F0F0]">
            <h2 className="font-semibold text-[#242424] mb-4">
              آیتم‌های سفارش ({order.items?.length || 0})
            </h2>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#F8F8F8] flex-shrink-0">
                    {item.product_thumbnail ? (
                      <Image
                        src={item.product_thumbnail}
                        alt={item.product_title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HiCube className="w-5 h-5 text-[#CBCBCB]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product_slug}`}
                      className="text-sm font-medium text-[#242424] hover:text-[#A72F3B] transition truncate block"
                    >
                      {item.product_title}
                    </Link>
                    <p className="text-xs text-[#898989] mt-0.5">
                      {item.quantity} عدد ×{" "}
                      {formatPrice(
                        item.paid_price > 0
                          ? item.paid_price
                          : (item.sale_price ?? item.price),
                      )}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#242424] flex-shrink-0">
                    {formatPrice(
                      (item.paid_price > 0
                        ? item.paid_price
                        : (item.sale_price ?? item.price)) * item.quantity,
                    )}
                  </span>
                </div>
              ))}
            </div>
            {order.latest_transaction?.ref_id && (
              <div className="mt-3 pt-3 border-t border-[#F0F0F0]">
                <p className="text-xs text-[#898989]">کد پیگیری پرداخت:</p>
                <p className="text-sm font-mono font-bold text-[#242424] mt-0.5">
                  {order.latest_transaction.ref_id}
                </p>
              </div>
            )}
          </div>

          {/* آدرس */}
          {order.shipping?.address && (
            <div className="bg-white rounded-2xl p-5 border border-[#F0F0F0]">
              <h2 className="font-semibold text-[#242424] flex items-center gap-2 mb-3">
                <HiLocationMarker className="w-5 h-5 text-[#A72F3B]" /> آدرس
                تحویل
              </h2>
              <p className="text-sm text-[#656565] mb-2">
                {order.shipping.address}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-[#898989]">
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
            <div className="bg-[#F6EAEB] rounded-2xl p-5 border border-[#EDD5D8]">
              <h2 className="font-semibold text-[#86262F] flex items-center gap-2 mb-2">
                <HiTruck className="w-5 h-5 text-[#A72F3B]" /> کد رهگیری مرسوله
              </h2>
              <p className="text-2xl font-bold text-[#A72F3B] font-mono tracking-wider">
                {order.tracking_code}
              </p>
              <div className="mt-2 flex items-center gap-3 flex-wrap">
                {order.shipping_carrier && CARRIERS[order.shipping_carrier] ? (
                  <>
                    <span className="text-xs text-[#86262F]">
                      ارسال از طریق {CARRIERS[order.shipping_carrier].label}
                    </span>
                    <a
                      href={CARRIERS[order.shipping_carrier].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#A72F3B] hover:text-[#86262F] underline"
                    >
                      رهگیری ←
                    </a>
                  </>
                ) : (
                  <a
                    href="https://tracking.post.ir"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#A72F3B] hover:text-[#86262F]"
                  >
                    رهگیری در سایت پست ملی ←
                  </a>
                )}
              </div>
            </div>
          )}

          {order.status_note && (
            <div className="bg-[#FBEFD7] rounded-2xl p-4 border border-[#F4B740]/40">
              <p className="text-sm text-[#8A6310]">
                <span className="font-medium">یادداشت: </span>
                {order.status_note}
              </p>
            </div>
          )}

          <div className="bg-[#F6EAEB] rounded-2xl p-4 border border-[#EDD5D8]">
            <p className="text-sm text-[#86262F] mb-2">
              سوالی درباره سفارش دارید؟
            </p>
            <Link
              href="/contact"
              className="text-sm font-medium text-[#A72F3B] hover:text-[#86262F]"
            >
              تماس با پشتیبانی ←
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#F0F0F0]">
            <h2 className="font-semibold text-[#242424] mb-4">پیگیری سفارش</h2>
            <OrderTimeline status={order.status} timeline={order.timeline} />
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#F0F0F0]">
            <h2 className="font-semibold text-[#242424] mb-4">خلاصه مالی</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-[#656565]">
                <span>جمع محصولات</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#00966D]">
                  <span>تخفیف</span>
                  <span>− {formatPrice(order.discount)}</span>
                </div>
              )}
              {order.coupon_discount > 0 && (
                <div className="flex justify-between text-[#00966D]">
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
              <div className="border-t border-[#F0F0F0] pt-2.5 flex justify-between font-bold text-[#242424]">
                <span>مبلغ پرداختی</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
