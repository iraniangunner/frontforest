"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  HiArrowRight, HiLocationMarker, HiTag,
  HiCheck, HiX, HiShoppingCart, HiLockClosed,
} from "react-icons/hi";
import { cartAPI, addressAPI, couponAPI, checkoutAPI } from "@/lib/api";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface CartItem {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  price: number;
  sale_price: number | null;
  current_price: number;
  quantity: number;
  category: { name: string };
}

interface CartSummary {
  count: number;
  subtotal: number;
  discount: number;
  total: number;
}

interface Address {
  id: number;
  title: string | null;
  receiver_name: string;
  receiver_mobile: string;
  province: string;
  city: string;
  address: string;
  postal_code: string;
}

interface CouponData {
  code: string;
  type: string;
  value: number;
  discount: number;
  final_total: number;
}

const formatPrice = (n: number) => Number(n).toLocaleString("fa-IR") + " تومان";

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function CheckoutConfirmPage() {
  const router = useRouter();

  const [items, setItems]       = useState<CartItem[]>([]);
  const [summary, setSummary]   = useState<CartSummary>({ count: 0, subtotal: 0, discount: 0, total: 0 });
  const [address, setAddress]   = useState<Address | null>(null);
  const [loading, setLoading]   = useState(true);
  const [paying, setPaying]     = useState(false);

  // کوپن
  const [couponCode, setCouponCode]       = useState("");
  const [couponData, setCouponData]       = useState<CouponData | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError]     = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // آدرس از sessionStorage
      const addressId = sessionStorage.getItem("checkout_address_id");
      if (!addressId) {
        toast.error("لطفاً ابتدا آدرس را انتخاب کنید");
        router.replace("/checkout/address");
        return;
      }

      const [cartRes, addressRes] = await Promise.all([
        cartAPI.get(),
        addressAPI.getAll(),
      ]);

      const cartData = cartRes.data.data || [];
      if (cartData.length === 0) {
        toast.error("سبد خرید خالی است");
        router.replace("/cart");
        return;
      }

      setItems(cartData);
      setSummary(cartRes.data.summary || { count: 0, subtotal: 0, discount: 0, total: 0 });

      const allAddresses = addressRes.data.data || [];
      const selected = allAddresses.find((a: Address) => a.id === Number(addressId));
      if (!selected) {
        toast.error("آدرس انتخابی یافت نشد");
        router.replace("/checkout/address");
        return;
      }
      setAddress(selected);

    } catch {
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  // ── اعمال کوپن ──
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const finalTotal = couponData ? couponData.final_total : summary.total;
      const res = await couponAPI.validate(couponCode.trim(), finalTotal);
      setCouponData(res.data.data);
      toast.success("کد تخفیف اعمال شد");
    } catch (error: any) {
      const msg = error.response?.data?.message || "کد تخفیف نامعتبر است";
      setCouponError(msg);
      setCouponData(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponData(null);
    setCouponCode("");
    setCouponError("");
  };

  // ── پرداخت ──
  const handlePay = async () => {
    const addressId = sessionStorage.getItem("checkout_address_id");
    if (!addressId) {
      toast.error("آدرس انتخاب نشده");
      router.replace("/checkout/address");
      return;
    }

    setPaying(true);
    try {
      const res = await checkoutAPI.checkout({
        address_id:  Number(addressId),
        coupon_code: couponData?.code,
      });

      if (res.data.success && res.data.payment_url) {
        sessionStorage.removeItem("checkout_address_id");
        toast.success("در حال انتقال به درگاه پرداخت...");
        window.location.href = res.data.payment_url;
        return;
      }

      toast.error(res.data.message || "خطا در اتصال به درگاه");
      router.replace("/profile/orders");

    } catch (error: any) {
      const status = error.response?.status;
      if (status === 409) {
        toast.error("یک سفارش در انتظار پرداخت دارید");
        router.replace("/profile/orders");
      } else {
        toast.error(error.response?.data?.message || "خطا در پرداخت");
      }
    } finally {
      setPaying(false);
    }
  };

  // ── مجموع نهایی ──
  const finalTotal = couponData ? couponData.final_total : summary.total;
  const couponDiscount = couponData ? couponData.discount : 0;

  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ── هدر ── */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/checkout/address"
            className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition">
            <HiArrowRight className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">تایید و پرداخت</h1>
            <p className="text-sm text-gray-500">مرحله ۲ از ۲</p>
          </div>
        </div>

        {/* ── Progress ── */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
              <HiCheck className="w-4 h-4" />
            </div>
            <span className="text-sm text-green-600 font-medium">آدرس تحویل</span>
          </div>
          <div className="flex-1 h-0.5 bg-blue-200 mx-2" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">۲</div>
            <span className="text-sm font-medium text-blue-600">تایید و پرداخت</span>
          </div>
        </div>

        <div className="space-y-4">

          {/* ── آدرس ارسال ── */}
          {address && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <HiLocationMarker className="w-5 h-5 text-blue-500" />
                  آدرس تحویل
                </h2>
                <Link href="/checkout/address"
                  className="text-xs text-blue-600 hover:text-blue-700">
                  تغییر
                </Link>
              </div>
              <p className="text-sm text-gray-700 mb-1">{address.address}</p>
              <div className="flex gap-3 text-xs text-gray-500">
                <span>{address.receiver_name}</span>
                <span dir="ltr">{address.receiver_mobile}</span>
              </div>
            </div>
          )}

          {/* ── آیتم‌های سفارش ── */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <HiShoppingCart className="w-5 h-5 text-blue-500" />
              آیتم‌های سفارش ({summary.count} عدد)
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    {item.thumbnail
                      ? <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <HiShoppingCart className="w-5 h-5 text-gray-300" />
                        </div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.category?.name} · {item.quantity} عدد</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                    {formatPrice(item.current_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── کد تخفیف ── */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <HiTag className="w-5 h-5 text-blue-500" />
              کد تخفیف
            </h2>

            {couponData ? (
              // کوپن اعمال شده
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                    <HiCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-800 font-mono">{couponData.code}</p>
                    <p className="text-xs text-green-600">
                      {couponData.type === "percent"
                        ? `${couponData.value}٪ تخفیف`
                        : `${formatPrice(couponData.value)} تخفیف`}
                    </p>
                  </div>
                </div>
                <button onClick={handleRemoveCoupon}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                  <HiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              // فرم کوپن
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    placeholder="کد تخفیف را وارد کنید"
                    dir="ltr"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || couponLoading}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
                    {couponLoading ? "..." : "اعمال"}
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <HiX className="w-3.5 h-3.5" /> {couponError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── خلاصه قیمت ── */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">خلاصه سفارش</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>جمع محصولات</span>
                <span>{formatPrice(summary.subtotal)}</span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>تخفیف محصولات</span>
                  <span>− {formatPrice(summary.discount)}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>تخفیف کوپن ({couponData?.code})</span>
                  <span>− {formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>مبلغ قابل پرداخت</span>
                <span className="text-blue-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

          {/* ── دکمه پرداخت ── */}
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full flex items-center justify-center gap-3 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 disabled:opacity-50 transition text-base shadow-lg shadow-green-200">
            {paying ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <HiLockClosed className="w-5 h-5" />
            )}
            {paying ? "در حال انتقال..." : `پرداخت ${formatPrice(finalTotal)}`}
          </button>

          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <HiLockClosed className="w-3 h-3" />
            پرداخت امن از طریق درگاه زرین‌پال
          </p>

        </div>
      </div>
    </div>
  );
}
