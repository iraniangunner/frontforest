"use client";

// app/(public)/profile/orders/page.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  HiSearch,
  HiX,
} from "react-icons/hi";
import { ordersAPI } from "@/lib/api";
import Pagination from "@/app/_components/ui/Pagination";
import toast from "react-hot-toast";

interface OrderItemThumb {
  id: number;
  product_thumbnail: string | null;
}

interface Order {
  id: number;
  order_number: string;
  total: number;
  status: string;
  status_label: string;
  items_count: number;
  tracking_code: string | null;
  payment_method: string;
  receipt_status: string | null;
  created_at: string;
  items?: OrderItemThumb[];
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
}

// ── نگاشت وضعیت → برچسب/رنگ (همه‌ی حالت‌های خودت، با پالت فیگما) ──
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

// همه‌ی حالت‌های اصلی خودت به‌صورت تب
const FILTER_ITEMS = [
  { key: "", label: "همه" },
  { key: "pending", label: "در انتظار" },
  { key: "paid", label: "پرداخت شده" },
  { key: "processing", label: "در حال پردازش" },
  { key: "shipped", label: "ارسال شده" },
  { key: "delivered", label: "تحویل شده" },
  { key: "canceled", label: "لغو شده" },
  { key: "returned", label: "مرجوعی" },
  { key: "failed", label: "ناموفق" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    paid: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    canceled: 0,
    returned: 0,
  });

  useEffect(() => {
    load(filter, page, search);
  }, [filter, page]);

  const load = async (f: string, p: number, s: string) => {
    setLoading(true);
    try {
      const res = await ordersAPI.getAll({
        page: p,
        per_page: 10,
        status: f || undefined,
        search: s.trim() || undefined,
      });
      setOrders(res.data.data || []);
      setLastPage(res.data.meta?.last_page ?? 1);
      if (res.data.meta?.stats) setStats(res.data.meta.stats);
    } catch {
      toast.error("خطا در دریافت سفارشات");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (key: string) => {
    setFilter(key);
    setPage(1);
  };
  const handleSearch = () => {
    setPage(1);
    load(filter, 1, search);
  };
  const handleClear = () => {
    setSearch("");
    setPage(1);
    load(filter, 1, "");
  };

  const getCount = (key: string): number => {
    if (key === "") return stats.total;
    return stats[key as keyof Stats] ?? 0;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      {/* عنوان */}
      <div className="px-6 pt-6">
        <h2 className="text-lg font-bold text-[#242424] text-right">
          تاریخچه سفارشات
        </h2>
      </div>

      {/* تب‌ها — همه‌ی حالت‌های خودت */}
      <div className="px-6 mt-4 border-b border-[#F0F0F0] flex items-center gap-5 overflow-x-auto overflow-y-hidden">
        {FILTER_ITEMS.map((t) => {
          const active = filter === t.key;
          const count = getCount(t.key);
          return (
            <button
              key={t.key}
              onClick={() => handleFilter(t.key)}
              className={`relative -mb-px py-3 text-sm whitespace-nowrap transition-colors ${
                active
                  ? "text-[#A72F3B] font-semibold"
                  : "text-[#898989] hover:text-[#656565]"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                {t.label}
                {count > 0 && (
                  <span
                    className={`text-xs ${
                      active ? "text-[#A72F3B]" : "text-[#AFAFAF]"
                    }`}
                  >
                    {count.toLocaleString("fa-IR")}
                  </span>
                )}
              </span>
              {active && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#A72F3B] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* سرچ */}
      <div className="p-4 border-b border-[#F0F0F0]">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="جستجو با شماره سفارش..."
            className="w-full pr-3 pl-9 py-2.5 border border-[#EDEDED] rounded-xl text-sm focus:ring-4 focus:ring-[#A72F3B]/10 focus:border-[#A72F3B] outline-none transition"
          />
          {search ? (
            <button
              onClick={handleClear}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AFAFAF] hover:text-[#656565]"
            >
              <HiX className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AFAFAF] hover:text-[#A72F3B] transition"
            >
              <HiSearch className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* محتوا */}
      {loading ? (
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-[#F0F0F0] rounded-2xl p-4 animate-pulse"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-[#F5F5F5] rounded-full w-24" />
                <div className="h-4 bg-[#F5F5F5] rounded w-20" />
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="w-14 h-14 bg-[#F5F5F5] rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-16 text-center">
          <HiShoppingBag className="w-14 h-14 text-[#EDD5D8] mx-auto mb-3" />
          <p className="text-[#898989] font-medium">
            {filter || search ? "سفارشی یافت نشد" : "هنوز سفارشی ثبت نشده"}
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {orders.map((order) => {
            const { label, cls, Icon } = getDisplay(order);
            return (
              <div
                key={order.id}
                className="border border-[#F0F0F0] rounded-2xl p-5 hover:border-[#EDEDED] transition"
              >
                {/* ردیف بالا: وضعیت (راست) — مبلغ (چپ) */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cls}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </span>
                  <span className="font-bold text-[#242424] text-sm">
                    {fmtPrice(order.total)}
                  </span>
                </div>

                {/* ردیف اطلاعات: کد سفارش (راست) — تاریخ (چپ) */}
                <div className="flex items-center justify-between gap-3 text-xs text-[#898989] pb-3 border-b border-[#F5F5F5]">
                  <span>
                    کد سفارش{" "}
                    <span className="font-mono text-[#656565]">
                      {order.order_number}
                    </span>
                  </span>
                  <span>{fmtDate(order.created_at)}</span>
                </div>

                {/* تصاویر محصولات */}
                {order.items && order.items.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap mt-4">
                    {order.items.slice(0, 7).map((it) => (
                      <div
                        key={it.id}
                        className="w-14 h-14 rounded-xl overflow-hidden bg-[#F8F8F8] border border-[#F0F0F0] flex-shrink-0 relative"
                      >
                        {it.product_thumbnail ? (
                          <Image
                            src={it.product_thumbnail}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <HiCube className="w-5 h-5 text-[#CBCBCB]" />
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 7 && (
                      <div className="w-14 h-14 rounded-xl bg-[#F6EAEB] text-[#A72F3B] text-xs font-bold flex items-center justify-center flex-shrink-0">
                        +{(order.items.length - 7).toLocaleString("fa-IR")}
                      </div>
                    )}
                  </div>
                )}

                {/* کد رهگیری */}
                {order.tracking_code && (
                  <p className="text-xs text-[#A72F3B] font-mono mt-3 flex items-center gap-1">
                    <HiTruck className="w-3.5 h-3.5" />
                    کد رهگیری: {order.tracking_code}
                  </p>
                )}

                {/* پایین: تعداد محصول (راست) — دکمه مشاهده (چپ) */}
                <div className="mt-4 pt-3 border-t border-[#F5F5F5] flex items-center justify-between">
                  <span className="text-xs text-[#898989]">
                    {order.items_count.toLocaleString("fa-IR")} محصول
                  </span>
                  <Link
                    href={`/profile/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 text-sm text-[#A72F3B] hover:text-[#86262F] font-medium transition-colors"
                  >
                    <HiEye className="w-4 h-4" />
                    مشاهده سفارش
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {lastPage > 1 && (
        <div className="px-4 py-4 border-t border-[#F0F0F0]">
          <Pagination
            currentPage={page}
            lastPage={lastPage}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
