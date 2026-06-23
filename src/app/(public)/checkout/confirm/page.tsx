"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  HiArrowRight,
  HiLocationMarker,
  HiCheck,
  HiX,
  HiShoppingCart,
  HiLockClosed,
  HiCreditCard,
  HiUpload,
  HiTag,
} from "react-icons/hi";
import { cartAPI, addressAPI, checkoutAPI, couponAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

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

const fmt = (n: number) => Number(n).toLocaleString("fa-IR") + " تومان";
const CARD_NUMBER = "6063-7312-8960-3962";
const CARD_OWNER = "فهیمه صادیقی";

export default function CheckoutConfirmPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const { user, loading: authLoading } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary>({
    count: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
  });
  const [address, setAddress] = useState<Address | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const [payMethod, setPayMethod] = useState<"online" | "receipt">("receipt");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState<CouponData | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?redirect=/checkout/address");
      return;
    }
    loadData();
  }, [user, authLoading]);

  const loadData = async () => {
    setPageLoading(true);
    try {
      const addressId = sessionStorage.getItem("checkout_address_id");
      if (!addressId) {
        toast.error("لطفاً ابتدا آدرس را انتخاب کنید");
        router.replace("/checkout/address");
        return;
      }

      const [cartRes, addrRes] = await Promise.all([
        cartAPI.get(),
        addressAPI.getAll(),
      ]);

      const cartData = cartRes.data.data || [];
      if (!cartData.length) {
        toast.error("سبد خرید خالی است");
        router.replace("/cart");
        return;
      }

      setItems(cartData);
      setSummary(
        cartRes.data.summary || {
          count: 0,
          subtotal: 0,
          discount: 0,
          total: 0,
        }
      );

      const allAddresses = addrRes.data.data || [];
      const selected = allAddresses.find(
        (a: Address) => a.id === Number(addressId)
      );
      if (!selected) {
        toast.error("آدرس انتخابی یافت نشد");
        router.replace("/checkout/address");
        return;
      }
      setAddress(selected);
    } catch {
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setPageLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const netTotal = summary.subtotal - summary.discount;
      const res = await couponAPI.validate(couponCode.trim(), netTotal);
      setCouponData(res.data.data);
      toast.success("کد تخفیف اعمال شد");
    } catch (err: any) {
      setCouponError(err.response?.data?.message || "کد تخفیف نامعتبر است");
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

  const handleReceiptFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      toast.error("حجم فایل نباید بیشتر از ۲MB باشد");
      return;
    }
    setReceiptFile(f);
    setReceiptPreview(URL.createObjectURL(f));
  };

  const handlePay = async () => {
    const addressId = sessionStorage.getItem("checkout_address_id");
    if (!addressId) {
      toast.error("آدرس انتخاب نشده");
      router.replace("/checkout/address");
      return;
    }

    setPaying(true);
    try {
      if (payMethod === "online") {
        const res = await checkoutAPI.checkout({
          address_id: Number(addressId),
          coupon_code: couponData?.code,
        });
        if (res.data.success && res.data.payment_url) {
          sessionStorage.removeItem("checkout_address_id");
          window.location.href = res.data.payment_url;
          return;
        }
        toast.error(res.data.message || "خطا در اتصال به درگاه");
      } else {
        if (!receiptFile) {
          toast.error("لطفاً فیش پرداخت را آپلود کنید");
          setPaying(false);
          return;
        }
        const fd = new FormData();
        fd.append("address_id", addressId);
        fd.append("receipt", receiptFile);
        if (couponData?.code) fd.append("coupon_code", couponData.code);
        await checkoutAPI.submitWithReceipt(fd);
        sessionStorage.removeItem("checkout_address_id");
        toast.success("سفارش ثبت شد. پس از تایید فیش پردازش میشه");
        router.push("/profile/orders");
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error("یک سفارش در انتظار پرداخت دارید");
        router.replace("/profile/orders");
      } else {
        toast.error(err.response?.data?.message || "خطا در پرداخت");
      }
    } finally {
      setPaying(false);
    }
  };

  const finalTotal = couponData ? couponData.final_total : summary.total;
  const couponDiscount = couponData ? couponData.discount : 0;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* هدر */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/checkout/address"
            className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition"
          >
            <HiArrowRight className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">تایید و پرداخت</h1>
            <p className="text-sm text-gray-500">مرحله ۲ از ۲</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
              <HiCheck className="w-4 h-4" />
            </div>
            <span className="text-sm text-green-600 font-medium">
              آدرس تحویل
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-teal-200 mx-2" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              ۲
            </div>
            <span className="text-sm font-medium text-teal-600">
              تایید و پرداخت
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {/* آدرس */}
          {address && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <HiLocationMarker className="w-5 h-5 text-teal-500" /> آدرس
                  تحویل
                </h2>
                <Link
                  href="/checkout/address"
                  className="text-xs text-teal-600 hover:text-teal-700"
                >
                  تغییر
                </Link>
              </div>
              <p className="text-sm text-gray-700 mb-1">{address.address}</p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span>
                  {address.province}، {address.city}
                </span>
                <span>{address.receiver_name}</span>
                <span dir="ltr">{address.receiver_mobile}</span>
              </div>
            </div>
          )}

          {/* آیتم‌ها */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <HiShoppingCart className="w-5 h-5 text-teal-500" /> آیتم‌های
              سفارش ({summary.count} عدد)
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HiShoppingCart className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.category?.name} · {item.quantity} عدد
                    </p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                    {fmt(item.current_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* روش پرداخت */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <HiCreditCard className="w-5 h-5 text-teal-500" /> روش پرداخت
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled
                onClick={() => setPayMethod("online")}
                className={`flex items-center justify-center gap-2 p-3.5 border-2 rounded-xl text-sm font-medium transition-all opacity-50 cursor-not-allowed ${
                  payMethod === "online"
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-gray-200 text-gray-400"
                }`}
              >
                <HiCreditCard className="w-5 h-5" /> پرداخت آنلاین
              </button>
              <button
                type="button"
                onClick={() => setPayMethod("receipt")}
                className={`flex items-center justify-center gap-2 p-3.5 border-2 rounded-xl text-sm font-medium transition-all ${
                  payMethod === "receipt"
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                🏦 کارت به کارت
              </button>
            </div>

            {payMethod === "receipt" && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">مبلغ قابل پرداخت</p>
                  <p className="text-xl font-bold text-gray-900">
                    {fmt(finalTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">شماره کارت</p>
                  <p
                    className="font-mono text-base font-bold tracking-widest text-gray-900"
                    dir="ltr"
                  >
                    {CARD_NUMBER}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    به نام: {CARD_OWNER}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-2">
                    آپلود فیش پرداخت
                  </p>
                  {receiptPreview && (
                    <div className="relative w-32 h-32 mb-3">
                      <Image
                        src={receiptPreview}
                        alt="فیش"
                        fill
                        className="object-cover rounded-xl"
                        sizes="128px"
                      />
                      <button
                        onClick={() => {
                          setReceiptFile(null);
                          setReceiptPreview(null);
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                        className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow"
                      >
                        <HiX className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-600 hover:border-teal-400 cursor-pointer bg-white transition-colors">
                    <HiUpload className="w-4 h-4" />
                    {receiptFile ? "تغییر فیش" : "انتخاب تصویر"}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleReceiptFile}
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG، PNG یا WebP — حداکثر ۲MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* کد تخفیف */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <HiTag className="w-5 h-5 text-teal-500" /> کد تخفیف
            </h2>
            {couponData ? (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <HiCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-800 font-mono">
                      {couponData.code}
                    </p>
                    <p className="text-xs text-green-600">
                      {couponData.type === "percent"
                        ? `${couponData.value}٪ تخفیف`
                        : `${fmt(couponData.value)} تخفیف`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <HiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    placeholder="کد تخفیف را وارد کنید"
                    dir="ltr"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none font-mono"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || couponLoading}
                    className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition"
                  >
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

          {/* خلاصه سفارش */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">خلاصه سفارش</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>جمع محصولات</span>
                <span>{fmt(summary.subtotal)}</span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>تخفیف محصولات</span>
                  <span>− {fmt(summary.discount)}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>تخفیف کوپن ({couponData?.code})</span>
                  <span>− {fmt(couponDiscount)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>مبلغ قابل پرداخت</span>
                <span className="text-teal-600">{fmt(finalTotal)}</span>
              </div>
            </div>
          </div>

          {/* دکمه پرداخت */}
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full flex items-center justify-center gap-3 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 disabled:opacity-50 transition text-base shadow-lg shadow-teal-200"
          >
            {paying ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <HiLockClosed className="w-5 h-5" />
            )}
            {paying
              ? "در حال پردازش..."
              : payMethod === "online"
              ? `پرداخت ${fmt(finalTotal)}`
              : "ثبت سفارش و ارسال فیش"}
          </button>

          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <HiLockClosed className="w-3 h-3" />
            {payMethod === "online"
              ? "پرداخت امن از طریق درگاه زرین‌پال"
              : "پس از تایید فیش، سفارش پردازش میشه"}
          </p>
        </div>
      </div>
    </div>
  );
}
