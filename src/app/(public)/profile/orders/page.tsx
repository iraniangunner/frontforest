"use client";

// app/(public)/profile/orders/page.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HiShoppingBag, HiEye, HiCheckCircle, HiXCircle,
  HiClock, HiBan, HiCreditCard, HiCube, HiTruck, HiRefresh,
} from "react-icons/hi";
import { ordersAPI } from "@/lib/api";
import Pagination from "@/app/_components/ui/Pagination";
import toast from "react-hot-toast";

// ── Types ──
interface Order {
  id:             number;
  order_number:   string;
  total:          number;
  status:         string;
  status_label:   string;
  items_count:    number;
  tracking_code:  string | null;
  payment_method: string;
  receipt_status: string | null;
  created_at:     string;
}

interface Stats {
  total: number; pending: number; paid: number; processing: number;
  shipped: number; delivered: number; canceled: number; returned: number;
}

// ── وضعیت نمایشی ──
function getDisplay(order: Order) {
  if (order.payment_method === "receipt" && order.status === "pending") {
    return { label: "فیش در انتظار بررسی", cls: "bg-amber-100 text-amber-700", Icon: HiClock };
  }
  const map: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
    pending:    { label: "در انتظار پرداخت", cls: "bg-yellow-100 text-yellow-700", Icon: HiClock        },
    paid:       { label: "پرداخت شده",       cls: "bg-blue-100 text-blue-700",     Icon: HiCreditCard   },
    processing: { label: "در حال پردازش",    cls: "bg-purple-100 text-purple-700", Icon: HiCube         },
    shipped:    { label: "ارسال شده",        cls: "bg-indigo-100 text-indigo-700", Icon: HiTruck        },
    delivered:  { label: "تحویل داده شده",  cls: "bg-green-100 text-green-700",   Icon: HiCheckCircle  },
    canceled:   { label: "لغو شده",          cls: "bg-gray-100 text-gray-600",     Icon: HiBan          },
    returned:   { label: "مرجوعی",           cls: "bg-orange-100 text-orange-700", Icon: HiRefresh      },
    failed:     { label: "ناموفق",            cls: "bg-red-100 text-red-600",       Icon: HiXCircle      },
  };
  return map[order.status] ?? { label: order.status_label, cls: "bg-gray-100 text-gray-600", Icon: HiClock };
}

const fmtDate  = (d: string) => new Date(d).toLocaleDateString("fa-IR", { year: "numeric", month: "2-digit", day: "2-digit" });
const fmtPrice = (n: number) => Number(n).toLocaleString("fa-IR") + " ت";

const FILTER_ITEMS = [
  { key: "",           label: "همه"           },
  { key: "pending",    label: "در انتظار"      },
  { key: "paid",       label: "پرداخت شده"     },
  { key: "processing", label: "در حال پردازش"  },
  { key: "shipped",    label: "ارسال شده"      },
  { key: "delivered",  label: "تحویل شده"      },
  { key: "canceled",   label: "لغو شده"        },
  { key: "returned",   label: "مرجوعی"         },
];

export default function OrdersPage() {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("");
  const [page,    setPage]    = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [stats,   setStats]   = useState<Stats>({
    total: 0, pending: 0, paid: 0, processing: 0,
    shipped: 0, delivered: 0, canceled: 0, returned: 0,
  });

  // ── هر بار filter یا page عوض شد fetch کن ──
  useEffect(() => {
    load(filter, page);
  }, [filter, page]);

  const load = async (f: string, p: number) => {
    setLoading(true);
    try {
      const res = await ordersAPI.getAll({
        page:     p,
        per_page: 10,
        status:   f || undefined,
      });
      setOrders(res.data.data || []);
      setLastPage(res.data.meta?.last_page ?? 1);
      if (res.data.meta?.stats) {
        setStats(res.data.meta.stats);
      }
    } catch { toast.error("خطا در دریافت سفارشات"); }
    finally  { setLoading(false); }
  };

  const handleFilter = (key: string) => {
    setFilter(key);
    setPage(1);
  };

  const handlePage = (p: number) => {
    setPage(p);
  };

  const getCount = (key: string): number => {
    if (key === "") return stats.total;
    return stats[key as keyof Stats] ?? 0;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* هدر */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">سفارشات من</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {stats.total.toLocaleString("fa-IR")} سفارش
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* فیلترها */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap gap-2">
            {FILTER_ITEMS.map(f => {
              const count = getCount(f.key);
              return (
                <button key={f.key}
                  onClick={() => handleFilter(f.key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    filter === f.key
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {f.label}
                  {count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      filter === f.key
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {count.toLocaleString("fa-IR")}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* محتوا */}
          {loading ? (
            <div className="divide-y divide-gray-50">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex gap-4 px-4 py-4 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded flex-1" />
                  <div className="h-4 bg-gray-100 rounded w-20" />
                  <div className="h-4 bg-gray-100 rounded w-20" />
                  <div className="h-4 bg-gray-100 rounded w-28" />
                  <div className="h-4 bg-gray-100 rounded w-8" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center">
              <HiShoppingBag className="w-14 h-14 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                {filter ? "سفارشی با این وضعیت یافت نشد" : "هنوز سفارشی ثبت نشده"}
              </p>
              {!filter && (
                <Link href="/products"
                  className="inline-block mt-5 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors">
                  مشاهده محصولات
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["شماره سفارش", "تاریخ", "مبلغ", "وضعیت", ""].map(h => (
                      <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-gray-500 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(order => {
                    const { label, cls, Icon } = getDisplay(order);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-mono font-semibold text-gray-900 text-xs">{order.order_number}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{order.items_count} محصول</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                          {fmtDate(order.created_at)}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap text-xs">
                          {fmtPrice(order.total)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                          </span>
                          {order.tracking_code && (
                            <p className="text-xs text-indigo-500 font-mono mt-1 flex items-center gap-0.5">
                              <HiTruck className="w-3 h-3" />
                              {order.tracking_code}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/profile/orders/${order.id}`}
                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors inline-flex">
                            <HiEye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="px-4 py-4 border-t border-gray-100">
              <Pagination
                currentPage={page}
                lastPage={lastPage}
                onPageChange={handlePage}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
