"use client";

// app/(public)/profile/orders/[id]/return/page.tsx
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiArrowRight,
  HiCheckCircle,
  HiX,
  HiCreditCard,
  HiTruck,
  HiPencil,
} from "react-icons/hi";
import { ordersAPI, returnRequestsAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface OrderItem {
  id: number;
  product_title: string;
  quantity: number;
  paid_price: number;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  items: OrderItem[];
}

interface ReturnRequest {
  id: number;
  status: "pending" | "approved" | "rejected";
  reason: string;
  bank_card_number: string | null;
  bank_card_owner: string | null;
  return_tracking_code: string | null;
  return_carrier: string | null;
  admin_note: string | null;
}

const REASONS = [
  { key: "damaged", label: "محصول آسیب دیده" },
  { key: "wrong_item", label: "محصول اشتباه ارسال شده" },
  { key: "not_as_described", label: "مطابق توضیحات نیست" },
  { key: "changed_mind", label: "پشیمان شدم" },
  { key: "other", label: "سایر" },
];

const CARRIERS = [
  { key: "post", label: "پست ملی" },
  { key: "snapbox", label: "اسنپ‌باکس" },
  { key: "tipax", label: "تیپاکس" },
];

const fmt = (n: number) => Number(n).toLocaleString("fa-IR");
const inp =
  "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none transition";

// ── فرم ثبت/ویرایش کد رهگیری ──
function TrackingForm({
  returnRequest,
  onSuccess,
}: {
  returnRequest: ReturnRequest;
  onSuccess: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [trackingCode, setTrackingCode] = useState(
    returnRequest.return_tracking_code || "",
  );
  const [carrier, setCarrier] = useState(returnRequest.return_carrier || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      toast.error("کد رهگیری الزامی است");
      return;
    }
    if (!carrier) {
      toast.error("شرکت پستی را انتخاب کنید");
      return;
    }
    setSaving(true);
    try {
      await returnRequestsAPI.submitTracking(returnRequest.id, {
        return_tracking_code: trackingCode.trim(),
        return_carrier: carrier,
      });
      toast.success("کد رهگیری ثبت شد");
      setEditing(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در ثبت کد رهگیری");
    } finally {
      setSaving(false);
    }
  };

  // کد رهگیری ثبت شده — نمایش
  if (returnRequest.return_tracking_code && !editing) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <HiTruck className="w-5 h-5 text-indigo-500" /> کد رهگیری مرجوعی
        </h2>
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <p className="text-xs text-indigo-600 mb-1">
            {CARRIERS.find((c) => c.key === returnRequest.return_carrier)
              ?.label || returnRequest.return_carrier}
          </p>
          <p
            className="text-xl font-bold text-indigo-700 font-mono tracking-wider"
            dir="ltr"
          >
            {returnRequest.return_tracking_code}
          </p>
          <p className="text-xs text-indigo-500 mt-2">✅ کد رهگیری ثبت شده</p>
        </div>
        <button
          onClick={() => {
            setTrackingCode(returnRequest.return_tracking_code!);
            setCarrier(returnRequest.return_carrier!);
            setEditing(true);
          }}
          className="mt-3 flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 transition"
        >
          <HiPencil className="w-3.5 h-3.5" /> ویرایش کد رهگیری
        </button>
      </div>
    );
  }

  // فرم ثبت/ویرایش
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <HiTruck className="w-5 h-5 text-indigo-500" />
        {editing ? "ویرایش کد رهگیری" : "ارسال کالا به انبار"}
      </h2>

      {!editing && (
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 mb-4">
          <p className="text-sm text-indigo-800 font-medium mb-1">
            آدرس انبار:
          </p>
          <p className="text-sm text-indigo-700">
            تهران — [آدرس انبار را وارد کنید]
          </p>
          <p className="text-xs text-indigo-500 mt-2">
            پس از ارسال کالا، کد رهگیری را در زیر وارد کنید
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            شرکت پستی <span className="text-red-500">*</span>
          </label>
          <select
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className={inp}
          >
            <option value="">انتخاب کنید</option>
            {CARRIERS.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            کد رهگیری <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="کد رهگیری پستی"
            dir="ltr"
            className={inp}
          />
        </div>
        <div className="flex gap-2">
          {editing && (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
            >
              انصراف
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {saving
              ? "در حال ثبت..."
              : editing
                ? "ذخیره تغییرات"
                : "ثبت کد رهگیری"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Page ──
export default function ReturnRequestPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [returnRequest, setReturnRequest] = useState<ReturnRequest | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState<
    Record<number, { selected: boolean; quantity: number }>
  >({});
  const [bankCard, setBankCard] = useState(user?.bank_card_number || "");
  const [bankCardOwner, setBankCardOwner] = useState(
    user?.bank_card_owner || "",
  );

  useEffect(() => {
    loadData();
  }, [orderId]);

  useEffect(() => {
    if (user?.bank_card_number) setBankCard(user.bank_card_number);
    if (user?.bank_card_owner) setBankCardOwner(user.bank_card_owner);
  }, [user]);

  const loadData = async () => {
    try {
      const orderRes = await ordersAPI.getOne(orderId);
      const o: Order = orderRes.data.data;

      if (o.status !== "delivered" && o.status !== "returned") {
        toast.error("فقط سفارشات تحویل داده شده قابل مرجوعی هستند");
        router.replace(`/profile/orders/${orderId}`);
        return;
      }

      setOrder(o);
      const rr = (o as any).return_request;
      if (rr) setReturnRequest(rr);

      const init: Record<number, { selected: boolean; quantity: number }> = {};
      o.items.forEach((item) => {
        init[item.id] = { selected: false, quantity: 1 };
      });
      setSelectedItems(init);
    } catch (err: any) {
      console.error("loadData error:", err);
      toast.error("خطا در دریافت اطلاعات");
      router.replace("/profile/orders");
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id: number) => {
    setSelectedItems((p) => ({
      ...p,
      [id]: { ...p[id], selected: !p[id].selected },
    }));
  };

  const setQty = (id: number, qty: number, max: number) => {
    setSelectedItems((p) => ({
      ...p,
      [id]: { ...p[id], quantity: Math.min(Math.max(1, qty), max) },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.error("دلیل مرجوعی را انتخاب کنید");
      return;
    }
    if (bankCard.length !== 16) {
      toast.error("شماره کارت ۱۶ رقمی الزامی است");
      return;
    }
    if (!bankCardOwner.trim()) {
      toast.error("نام صاحب کارت الزامی است");
      return;
    }

    const items = Object.entries(selectedItems)
      .filter(([, v]) => v.selected)
      .map(([k, v]) => ({ order_item_id: Number(k), quantity: v.quantity }));

    if (!items.length) {
      toast.error("حداقل یک محصول انتخاب کنید");
      return;
    }

    setSubmitting(true);
    try {
      const res = await returnRequestsAPI.create(orderId, {
        reason,
        description,
        bank_card_number: bankCard,
        bank_card_owner: bankCardOwner,
        items,
      });
      setReturnRequest(
        res.data.data || {
          id: 0,
          status: "pending",
          reason,
          bank_card_number: bankCard,
          bank_card_owner: bankCardOwner,
          return_tracking_code: null,
          return_carrier: null,
          admin_note: null,
        },
      );
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در ثبت درخواست");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );

  // ── حالت تایید شده ──
  if (returnRequest?.status === "approved")
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href={`/profile/orders/${orderId}`}
              className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition"
            >
              <HiArrowRight className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">
              مرجوعی سفارش #{order?.order_number}
            </h1>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 rounded-2xl p-5 border border-green-200 flex items-start gap-3">
              <HiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-800">
                  درخواست مرجوعی تایید شد
                </p>
                <p className="text-sm text-green-700 mt-1">
                  لطفاً کالا را به آدرس انبار ارسال کنید و کد رهگیری را ثبت
                  نمایید
                </p>
                {returnRequest.admin_note && (
                  <p className="text-sm text-green-600 mt-2 bg-green-100 rounded-lg px-3 py-2">
                    یادداشت: {returnRequest.admin_note}
                  </p>
                )}
              </div>
            </div>

            <TrackingForm returnRequest={returnRequest} onSuccess={loadData} />
          </div>
        </div>
      </div>
    );

  // ── حالت در انتظار ──
  if (submitted || returnRequest?.status === "pending")
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiCheckCircle className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            درخواست در انتظار بررسی
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            درخواست مرجوعی شما ثبت شد و پس از بررسی توسط تیم ما اطلاع‌رسانی
            خواهد شد.
          </p>
          <Link
            href="/profile/orders"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition"
          >
            بازگشت به سفارشات
          </Link>
        </div>
      </div>
    );

  // ── فرم ثبت درخواست ──
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href={`/profile/orders/${orderId}`}
            className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition"
          >
            <HiArrowRight className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">درخواست مرجوعی</h1>
            <p className="text-sm text-gray-500">
              سفارش #{order?.order_number}
            </p>
          </div>
        </div>

        {/* درخواست رد شده */}
        {returnRequest?.status === "rejected" && (
          <div className="bg-red-50 rounded-2xl p-4 border border-red-200 mb-4 flex items-start gap-3">
            <HiX className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 text-sm">
                درخواست قبلی رد شد
              </p>
              {returnRequest.admin_note && (
                <p className="text-xs text-red-600 mt-1">
                  دلیل: {returnRequest.admin_note}
                </p>
              )}
              <p className="text-xs text-red-500 mt-1">
                میتوانید درخواست جدید ثبت کنید
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* انتخاب محصولات */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">محصولات مرجوعی</h2>
            <div className="space-y-3">
              {order?.items.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-xl p-4 transition-colors cursor-pointer ${
                    selectedItems[item.id]?.selected
                      ? "border-teal-400 bg-teal-50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedItems[item.id]?.selected
                          ? "border-teal-500 bg-teal-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedItems[item.id]?.selected && (
                        <HiCheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 line-clamp-1">
                        {item.product_title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.quantity} عدد · {fmt(item.paid_price)} تومان
                      </p>
                    </div>
                  </div>

                  {selectedItems[item.id]?.selected && (
                    <div
                      className="mt-3 flex items-center gap-2 mr-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-xs text-gray-500">
                        تعداد مرجوعی:
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setQty(
                              item.id,
                              selectedItems[item.id].quantity - 1,
                              item.quantity,
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {selectedItems[item.id].quantity.toLocaleString(
                            "fa-IR",
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQty(
                              item.id,
                              selectedItems[item.id].quantity + 1,
                              item.quantity,
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition"
                        >
                          +
                        </button>
                        <span className="text-xs text-gray-400">
                          از {item.quantity.toLocaleString("fa-IR")} عدد
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* دلیل */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">دلیل مرجوعی</h2>
            <div className="space-y-2">
              {REASONS.map((r) => (
                <label
                  key={r.key}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    reason === r.key
                      ? "border-teal-400 bg-teal-50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.key}
                    checked={reason === r.key}
                    onChange={(e) => setReason(e.target.value)}
                    className="accent-teal-600"
                  />
                  <span className="text-sm text-gray-700">{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* توضیحات */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">
              توضیحات{" "}
              <span className="text-gray-400 font-normal text-sm">
                (اختیاری)
              </span>
            </h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات بیشتر..."
              rows={3}
              maxLength={1000}
              className={inp + " resize-none"}
            />
            <p className="text-xs text-gray-400 mt-1 text-left">
              {description.length}/1000
            </p>
          </div>

          {/* اطلاعات بانکی */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <HiCreditCard className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">اطلاعات بانکی</h2>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              در صورت تایید مرجوعی، مبلغ به این کارت واریز میشه
            </p>

            {user?.bank_card_number && (
              <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-100 rounded-xl mb-4">
                <HiCheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <p className="text-xs text-teal-700">
                  اطلاعات بانکی از پروفایل شما بارگذاری شد
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  شماره کارت <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bankCard}
                  onChange={(e) =>
                    setBankCard(e.target.value.replace(/\D/g, "").slice(0, 16))
                  }
                  placeholder="1234567890123456"
                  dir="ltr"
                  maxLength={16}
                  className={inp + " font-mono tracking-widest"}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {bankCard.length}/16
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  نام صاحب کارت <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bankCardOwner}
                  onChange={(e) => setBankCardOwner(e.target.value)}
                  placeholder="نام و نام خانوادگی"
                  className={inp}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 disabled:opacity-50 transition shadow-lg shadow-teal-200"
          >
            {submitting ? "در حال ثبت..." : "ثبت درخواست مرجوعی"}
          </button>

          <p className="text-center text-xs text-gray-400">
            پس از تایید، آدرس انبار و جزئیات ارسال به شما اطلاع داده میشه
          </p>
        </form>
      </div>
    </div>
  );
}
