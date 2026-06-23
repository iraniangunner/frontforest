"use client";

// app/(public)/profile/page.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HiShoppingBag,
  HiEye,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiBan,
  HiCreditCard,
  HiCube,
  HiTruck,
  HiRefresh,
} from "react-icons/hi";
import { HiExclamationCircle } from "react-icons/hi";
import { ordersAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Order {
  id: number;
  order_number: string;
  total: number;
  status: string;
  status_label: string;
  items_count: number;
  payment_method: string;
  created_at: string;
}

function getDisplay(order: Order) {
  if (order.payment_method === "receipt" && order.status === "pending") {
    return {
      label: "فیش در انتظار بررسی",
      cls: "bg-[#FBEFD7] text-[#A9791C]",
      Icon: HiClock,
    };
  }
  const map: Record<
    string,
    { label: string; cls: string; Icon: React.ElementType }
  > = {
    pending: {
      label: "در انتظار پرداخت",
      cls: "bg-[#FBEFD7] text-[#A9791C]",
      Icon: HiClock,
    },
    paid: {
      label: "پرداخت شده",
      cls: "bg-[#F6EAEB] text-[#A72F3B]",
      Icon: HiCreditCard,
    },
    processing: {
      label: "در حال پردازش",
      cls: "bg-[#FBEFD7] text-[#A9791C]",
      Icon: HiCube,
    },
    shipped: {
      label: "ارسال شده",
      cls: "bg-[#F6EAEB] text-[#A72F3B]",
      Icon: HiTruck,
    },
    delivered: {
      label: "تحویل داده شده",
      cls: "bg-[#E6F4EF] text-[#00966D]",
      Icon: HiCheckCircle,
    },
    canceled: {
      label: "لغو شده",
      cls: "bg-[#FBEAEA] text-[#C30000]",
      Icon: HiBan,
    },
    returned: {
      label: "مرجوعی",
      cls: "bg-[#FBEFD7] text-[#A9791C]",
      Icon: HiRefresh,
    },
    failed: {
      label: "ناموفق",
      cls: "bg-[#FBEAEA] text-[#C30000]",
      Icon: HiXCircle,
    },
  };
  return (
    map[order.status] ?? {
      label: order.status_label,
      cls: "bg-[#F5F5F5] text-[#656565]",
      Icon: HiClock,
    }
  );
}

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
const fmtPrice = (n: number) => Number(n).toLocaleString("fa-IR") + " تومان";

export default function ProfilePage() {
  const { user } = useAuth();

  const profileComplete = !!user?.mobile;
  const missingField = !user?.mobile ? "شماره موبایل" : null;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecent();
  }, []);

  // خلاصه‌ی سفارش‌های اخیر — ۵ تای آخر
  const loadRecent = async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.getAll({ per_page: 5 });
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* خوش‌آمد */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-6">
        <h2 className="text-lg font-bold text-[#242424]">
          سلام {user?.name || "کاربر"} 👋
        </h2>
        <p className="text-sm text-[#898989] mt-1 leading-[1.8]">
          به داشبورد حساب کاربری خوش آمدید. خلاصه‌ی آخرین سفارش‌هایتان را اینجا
          می‌بینید.
        </p>
      </div>

      {/* بنر تکمیل پروفایل */}
      {!profileComplete && (
        <div className="flex items-center gap-4 bg-[#FBEFD7] border border-[#F4B740]/40 rounded-2xl p-4">
          <HiExclamationCircle className="w-6 h-6 text-[#A9791C] flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-[#8A6310] text-sm">پروفایل ناقص</p>
            <p className="text-xs text-[#A9791C] mt-0.5">
              {missingField} خود را اضافه کنید
            </p>
          </div>
          <Link
            href="/profile/settings"
            className="px-4 py-2 bg-[#A9791C] hover:bg-[#8A6310] text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap flex-shrink-0"
          >
            تکمیل پروفایل
          </Link>
        </div>
      )}

      {/* سفارش‌های اخیر */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
          <h2 className="text-base font-bold text-[#242424]">سفارش‌های اخیر</h2>
          <Link
            href="/profile/orders"
            className="text-sm text-[#A72F3B] hover:text-[#86262F] font-medium transition-colors"
          >
            مشاهده همه
          </Link>
        </div>

        {loading ? (
          <div className="divide-y divide-[#F5F5F5]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 px-6 py-4 animate-pulse">
                <div className="h-4 bg-[#F5F5F5] rounded flex-1" />
                <div className="h-4 bg-[#F5F5F5] rounded w-24" />
                <div className="h-4 bg-[#F5F5F5] rounded w-24" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <HiShoppingBag className="w-14 h-14 text-[#EDD5D8] mx-auto mb-3" />
            <p className="text-[#898989] font-medium">هنوز سفارشی ثبت نشده</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F5F5F5]">
            {orders.map((order) => {
              const { label, cls, Icon } = getDisplay(order);
              return (
                <Link
                  key={order.id}
                  href={`/profile/orders/${order.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[#FAFAFA] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-mono font-semibold text-[#242424] text-sm">
                      {order.order_number}
                    </p>
                    <p className="text-xs text-[#898989] mt-0.5">
                      {fmtDate(order.created_at)} ·{" "}
                      {order.items_count.toLocaleString("fa-IR")} محصول
                    </p>
                  </div>
                  <span className="font-semibold text-[#242424] text-sm whitespace-nowrap">
                    {fmtPrice(order.total)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${cls}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </span>
                  <HiEye className="w-4 h-4 text-[#CBCBCB] flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
