"use client";

// app/(public)/checkout/confirm/page.tsx
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
  HiPhone,
  HiUser,
  HiPencil,
  HiMail,
  HiOfficeBuilding,
  HiGlobeAlt,
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

// ── نوار مراحل ──
function Stepper() {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[
        { label: "سبد خرید", done: true },
        { label: "اطلاعات آدرس", done: true },
        { label: "پرداخت", active: true },
      ].map((s, i, arr) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                s.active
                  ? "bg-[#A72F3B] text-white"
                  : "bg-[#F6EAEB] text-[#A72F3B]"
              }`}
            >
              {s.done && !s.active ? <HiCheck className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={`text-xs ${
                s.active ? "text-[#A72F3B] font-medium" : "text-[#898989]"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < arr.length - 1 && (
            <div className="w-16 sm:w-24 mb-5 border-t border-dashed border-[#DCACB1]" />
          )}
        </div>
      ))}
    </div>
  );
}

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
        },
      );

      const allAddresses = addrRes.data.data || [];
      const selected = allAddresses.find(
        (a: Address) => a.id === Number(addressId),
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

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#EDEDED] border-t-[#A72F3B] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Stepper />

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          {/* ستون اصلی */}
          <div className="space-y-4 lg:order-1">
            {/* آدرس */}
            {address && (
              <div className="bg-white rounded-2xl p-5 border border-[#F0F0F0]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[#242424] flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-[#F6EAEB] flex items-center justify-center">
                      <HiLocationMarker className="w-5 h-5 text-[#A72F3B]" />
                    </span>
                    آدرس تحویل
                  </h2>
                  <Link
                    href="/checkout/address"
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#EDEDED] text-[#A72F3B] rounded-lg text-xs font-medium hover:bg-[#F6EAEB] hover:border-[#DCACB1] transition"
                  >
                    <HiPencil className="w-3.5 h-3.5" /> تغییر
                  </Link>
                </div>

                {/* نشانی کامل */}
                <p className="text-sm font-medium text-[#242424] leading-relaxed mb-4">
                  {address.address}
                </p>

                {/* فیلدها در باکس ملایم، دو ردیف منظم */}
                <div className="bg-[#FAFAFA] rounded-xl p-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-[#656565]">
                      <HiGlobeAlt className="w-3.5 h-3.5 text-[#A72F3B] flex-shrink-0" />
                      {address.province}، {address.city}
                    </span>
                    <span className="flex items-center gap-1.5 text-[#656565]">
                      <HiPhone className="w-3.5 h-3.5 text-[#A72F3B] flex-shrink-0" />
                      موبایل: {address.receiver_mobile}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-[#656565]">
                      <HiUser className="w-3.5 h-3.5 text-[#A72F3B] flex-shrink-0" />
                      {address.receiver_name}
                    </span>
                    {address.postal_code && (
                      <span className="flex items-center gap-1.5 text-[#656565]">
                        <HiMail className="w-3.5 h-3.5 text-[#A72F3B] flex-shrink-0" />
                        کد پستی: {address.postal_code}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* آیتم‌ها */}
            <div className="bg-white rounded-2xl p-5 border border-[#F0F0F0]">
              <h2 className="font-semibold text-[#242424] flex items-center gap-2 mb-4">
                <HiShoppingCart className="w-5 h-5 text-[#A72F3B]" /> آیتم‌های
                سفارش ({summary.count.toLocaleString("fa-IR")})
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#F8F8F8] flex-shrink-0">
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
                          <HiShoppingCart className="w-5 h-5 text-[#CBCBCB]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#242424] truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#898989]">
                        {item.category?.name} ·{" "}
                        {item.quantity.toLocaleString("fa-IR")} عدد
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#242424] flex-shrink-0">
                      {fmt(item.current_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* روش پرداخت */}
            <div className="bg-white rounded-2xl p-5 border border-[#F0F0F0]">
              <h2 className="font-semibold text-[#242424] flex items-center gap-2 mb-4">
                <HiCreditCard className="w-5 h-5 text-[#A72F3B]" /> روش پرداخت
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled
                  onClick={() => setPayMethod("online")}
                  className={`flex items-center justify-center gap-2 p-3.5 border-2 rounded-xl text-sm font-medium transition-all opacity-50 cursor-not-allowed ${
                    payMethod === "online"
                      ? "border-[#A72F3B] bg-[#F6EAEB] text-[#A72F3B]"
                      : "border-[#EDEDED] text-[#AFAFAF]"
                  }`}
                >
                  <HiCreditCard className="w-5 h-5" /> پرداخت آنلاین
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod("receipt")}
                  className={`flex items-center justify-center gap-2 p-3.5 border-2 rounded-xl text-sm font-medium transition-all ${
                    payMethod === "receipt"
                      ? "border-[#A72F3B] bg-[#F6EAEB] text-[#A72F3B]"
                      : "border-[#EDEDED] text-[#656565] hover:border-[#DCACB1]"
                  }`}
                >
                  🏦 کارت به کارت
                </button>
              </div>

              {payMethod === "receipt" && (
                <div className="mt-4 p-4 bg-[#FBEFD7] border border-[#F4B740]/40 rounded-xl space-y-4">
                  <div>
                    <p className="text-xs text-[#A9791C] mb-1">
                      مبلغ قابل پرداخت
                    </p>
                    <p className="text-xl font-bold text-[#242424]">
                      {fmt(finalTotal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#A9791C] mb-1">شماره کارت</p>
                    <p
                      className="font-mono text-base font-bold tracking-widest text-[#242424]"
                      dir="ltr"
                    >
                      {CARD_NUMBER}
                    </p>
                    <p className="text-xs text-[#A9791C] mt-0.5">
                      به نام: {CARD_OWNER}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#8A6310] mb-2">
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
                          className="absolute -top-2 -left-2 w-6 h-6 bg-[#C30000] text-white rounded-full flex items-center justify-center shadow"
                        >
                          <HiX className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <label className="inline-flex items-center gap-2 px-4 py-2 border border-[#F4B740] rounded-xl text-sm text-[#A9791C] hover:border-[#A9791C] cursor-pointer bg-white transition-colors">
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
                    <p className="text-xs text-[#A9791C] mt-1">
                      JPG، PNG یا WebP — حداکثر ۲MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* کد تخفیف */}
            <div className="bg-white rounded-2xl p-5 border border-[#F0F0F0]">
              <h2 className="font-semibold text-[#242424] flex items-center gap-2 mb-4">
                <HiTag className="w-5 h-5 text-[#A72F3B]" /> کد تخفیف
              </h2>
              {couponData ? (
                <div className="flex items-center justify-between p-3 bg-[#E6F4EF] border border-[#00966D]/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#00966D] rounded-full flex items-center justify-center flex-shrink-0">
                      <HiCheck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#00714F] font-mono">
                        {couponData.code}
                      </p>
                      <p className="text-xs text-[#00966D]">
                        {couponData.type === "percent"
                          ? `${couponData.value}٪ تخفیف`
                          : `${fmt(couponData.value)} تخفیف`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1.5 text-[#C30000] hover:bg-[#FBEAEA] rounded-lg transition"
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
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleApplyCoupon()
                      }
                      placeholder="کد تخفیف را وارد کنید"
                      dir="ltr"
                      className="flex-1 px-4 py-2.5 border border-[#EDEDED] rounded-xl text-sm focus:ring-4 focus:ring-[#A72F3B]/10 focus:border-[#A72F3B] outline-none font-mono"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || couponLoading}
                      className="px-5 py-2.5 bg-[#A72F3B] text-white rounded-xl text-sm font-medium hover:bg-[#86262F] disabled:opacity-50 transition"
                    >
                      {couponLoading ? "..." : "ثبت"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-[#C30000] mt-2 flex items-center gap-1">
                      <HiX className="w-3.5 h-3.5" /> {couponError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* خلاصه + دکمه (ستون چپ، sticky) */}
          <div className="lg:order-2">
            <div className="bg-white rounded-2xl p-5 border border-[#F0F0F0] sticky top-6">
              <h2 className="font-bold text-[#242424] mb-4">خلاصه سفارش</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#656565]">
                  <span>قیمت کالاها</span>
                  <span className="text-[#242424]">
                    {fmt(summary.subtotal)}
                  </span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-[#00966D]">
                    <span>مجموع تخفیف روی کالاها</span>
                    <span>− {fmt(summary.discount)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#00966D]">
                    <span>تخفیف کوپن ({couponData?.code})</span>
                    <span>− {fmt(couponDiscount)}</span>
                  </div>
                )}
                <div className="border-t border-[#F0F0F0] pt-3 flex justify-between font-bold">
                  <span className="text-[#242424]">جمع مبلغ قابل پرداخت</span>
                  <span className="text-[#A72F3B]">{fmt(finalTotal)}</span>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={paying}
                className="w-full flex items-center justify-center gap-2 py-3.5 mt-5 bg-[#A72F3B] text-white rounded-xl font-bold hover:bg-[#86262F] disabled:opacity-50 transition"
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

              <p className="text-center text-xs text-[#AFAFAF] mt-3 flex items-center justify-center gap-1">
                <HiLockClosed className="w-3 h-3" />
                {payMethod === "online"
                  ? "پرداخت امن از طریق درگاه"
                  : "پس از تایید فیش، سفارش پردازش می‌شود"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
