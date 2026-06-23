// "use client";

// // app/(public)/profile/orders/page.tsx
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import {
//   HiShoppingBag,
//   HiEye,
//   HiCheckCircle,
//   HiXCircle,
//   HiClock,
//   HiBan,
//   HiCreditCard,
//   HiCube,
//   HiTruck,
//   HiRefresh,
//   HiSearch,
//   HiX,
// } from "react-icons/hi";
// import { ordersAPI } from "@/lib/api";
// import Pagination from "@/app/_components/ui/Pagination";
// import toast from "react-hot-toast";

// interface Order {
//   id: number;
//   order_number: string;
//   total: number;
//   status: string;
//   status_label: string;
//   items_count: number;
//   tracking_code: string | null;
//   payment_method: string;
//   receipt_status: string | null;
//   created_at: string;
// }

// interface Stats {
//   total: number;
//   pending: number;
//   paid: number;
//   processing: number;
//   shipped: number;
//   delivered: number;
//   canceled: number;
//   returned: number;
// }

// function getDisplay(order: Order) {
//   if (order.payment_method === "receipt" && order.status === "pending") {
//     return {
//       label: "فیش در انتظار بررسی",
//       cls: "bg-amber-100 text-amber-700",
//       Icon: HiClock,
//     };
//   }
//   const map: Record<
//     string,
//     { label: string; cls: string; Icon: React.ElementType }
//   > = {
//     pending: {
//       label: "در انتظار پرداخت",
//       cls: "bg-yellow-100 text-yellow-700",
//       Icon: HiClock,
//     },
//     paid: {
//       label: "پرداخت شده",
//       cls: "bg-blue-100 text-blue-700",
//       Icon: HiCreditCard,
//     },
//     processing: {
//       label: "در حال پردازش",
//       cls: "bg-purple-100 text-purple-700",
//       Icon: HiCube,
//     },
//     shipped: {
//       label: "ارسال شده",
//       cls: "bg-indigo-100 text-indigo-700",
//       Icon: HiTruck,
//     },
//     delivered: {
//       label: "تحویل داده شده",
//       cls: "bg-green-100 text-green-700",
//       Icon: HiCheckCircle,
//     },
//     canceled: {
//       label: "لغو شده",
//       cls: "bg-gray-100 text-gray-600",
//       Icon: HiBan,
//     },
//     returned: {
//       label: "مرجوعی",
//       cls: "bg-orange-100 text-orange-700",
//       Icon: HiRefresh,
//     },
//     failed: {
//       label: "ناموفق",
//       cls: "bg-red-100 text-red-600",
//       Icon: HiXCircle,
//     },
//   };
//   return (
//     map[order.status] ?? {
//       label: order.status_label,
//       cls: "bg-gray-100 text-gray-600",
//       Icon: HiClock,
//     }
//   );
// }

// const fmtDate = (d: string) =>
//   new Date(d).toLocaleDateString("fa-IR", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//   });
// const fmtPrice = (n: number) => Number(n).toLocaleString("fa-IR") + " ت";

// const FILTER_ITEMS = [
//   { key: "", label: "همه" },
//   { key: "pending", label: "در انتظار" },
//   { key: "paid", label: "پرداخت شده" },
//   { key: "processing", label: "در حال پردازش" },
//   { key: "shipped", label: "ارسال شده" },
//   { key: "delivered", label: "تحویل شده" },
//   { key: "canceled", label: "لغو شده" },
//   { key: "returned", label: "مرجوعی" },
//   { key: "failed", label: "ناموفق" },
// ];

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const [stats, setStats] = useState<Stats>({
//     total: 0,
//     pending: 0,
//     paid: 0,
//     processing: 0,
//     shipped: 0,
//     delivered: 0,
//     canceled: 0,
//     returned: 0,
//   });

//   useEffect(() => {
//     load(filter, page, search);
//   }, [filter, page]);

//   const load = async (f: string, p: number, s: string) => {
//     setLoading(true);
//     try {
//       const res = await ordersAPI.getAll({
//         page: p,
//         per_page: 10,
//         status: f || undefined,
//         search: s.trim() || undefined,
//       });
//       setOrders(res.data.data || []);
//       setLastPage(res.data.meta?.last_page ?? 1);
//       if (res.data.meta?.stats) setStats(res.data.meta.stats);
//     } catch {
//       toast.error("خطا در دریافت سفارشات");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilter = (key: string) => {
//     setFilter(key);
//     setPage(1);
//   };
//   const handleSearch = () => {
//     setPage(1);
//     load(filter, 1, search);
//   };
//   const handleClear = () => {
//     setSearch("");
//     setPage(1);
//     load(filter, 1, "");
//   };

//   const getCount = (key: string): number => {
//     if (key === "") return stats.total;
//     return stats[key as keyof Stats] ?? 0;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50" dir="rtl">
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         {/* هدر */}
//         <div className="mb-6">
//           <h1 className="text-xl font-bold text-gray-900">سفارشات من</h1>
//           <p className="text-sm text-gray-500 mt-0.5">
//             {stats.total.toLocaleString("fa-IR")} سفارش
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
//           {/* سرچ */}
//           <div className="p-4 border-b border-gray-100">
//             <div className="relative">
//               <HiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//                 placeholder="جستجو با شماره سفارش..."
//                 className="w-full pr-9 pl-9 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none"
//               />
//               {search ? (
//                 <button
//                   onClick={handleClear}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <HiX className="w-4 h-4" />
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleSearch}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition"
//                 >
//                   <HiSearch className="w-4 h-4" />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* فیلترها */}
//           <div className="p-4 border-b border-gray-100 flex flex-wrap gap-2">
//             {FILTER_ITEMS.map((f) => {
//               const count = getCount(f.key);
//               return (
//                 <button
//                   key={f.key}
//                   onClick={() => handleFilter(f.key)}
//                   className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
//                     filter === f.key
//                       ? "bg-teal-600 text-white"
//                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                   }`}
//                 >
//                   {f.label}
//                   {count > 0 && (
//                     <span
//                       className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
//                         filter === f.key
//                           ? "bg-white/20 text-white"
//                           : "bg-gray-200 text-gray-600"
//                       }`}
//                     >
//                       {count.toLocaleString("fa-IR")}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </div>

//           {/* محتوا */}
//           {loading ? (
//             <div className="divide-y divide-gray-50">
//               {[1, 2, 3, 4].map((i) => (
//                 <div key={i} className="flex gap-4 px-4 py-4 animate-pulse">
//                   <div className="h-4 bg-gray-100 rounded flex-1" />
//                   <div className="h-4 bg-gray-100 rounded w-20" />
//                   <div className="h-4 bg-gray-100 rounded w-20" />
//                   <div className="h-4 bg-gray-100 rounded w-28" />
//                   <div className="h-4 bg-gray-100 rounded w-8" />
//                 </div>
//               ))}
//             </div>
//           ) : orders.length === 0 ? (
//             <div className="p-16 text-center">
//               <HiShoppingBag className="w-14 h-14 text-gray-200 mx-auto mb-3" />
//               <p className="text-gray-500 font-medium">
//                 {filter || search ? "سفارشی یافت نشد" : "هنوز سفارشی ثبت نشده"}
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50 border-b border-gray-100">
//                   <tr>
//                     {["شماره سفارش", "تاریخ", "مبلغ", "وضعیت", ""].map((h) => (
//                       <th
//                         key={h}
//                         className="px-4 py-3 text-right text-xs font-semibold text-gray-500 whitespace-nowrap"
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {orders.map((order) => {
//                     const { label, cls, Icon } = getDisplay(order);
//                     return (
//                       <tr
//                         key={order.id}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-4 py-3">
//                           <p className="font-mono font-semibold text-gray-900 text-xs">
//                             {order.order_number}
//                           </p>
//                           <p className="text-xs text-gray-400 mt-0.5">
//                             {order.items_count} محصول
//                           </p>
//                         </td>
//                         <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
//                           {fmtDate(order.created_at)}
//                         </td>
//                         <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap text-xs">
//                           {fmtPrice(order.total)}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap">
//                           <span
//                             className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}
//                           >
//                             <Icon className="w-3.5 h-3.5" />
//                             {label}
//                           </span>
//                           {order.tracking_code && (
//                             <p className="text-xs text-indigo-500 font-mono mt-1 flex items-center gap-0.5">
//                               <HiTruck className="w-3 h-3" />
//                               {order.tracking_code}
//                             </p>
//                           )}
//                         </td>
//                         <td className="px-4 py-3">
//                           <Link
//                             href={`/profile/orders/${order.id}`}
//                             className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors inline-flex"
//                           >
//                             <HiEye className="w-4 h-4" />
//                           </Link>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {lastPage > 1 && (
//             <div className="px-4 py-4 border-t border-gray-100">
//               <Pagination
//                 currentPage={page}
//                 lastPage={lastPage}
//                 onPageChange={setPage}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

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
      <div className="px-6 mt-4 border-b border-[#F0F0F0] flex items-center gap-5 overflow-x-auto">
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
          <HiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AFAFAF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="جستجو با شماره سفارش..."
            className="w-full pr-9 pl-9 py-2.5 border border-[#EDEDED] rounded-xl text-sm focus:ring-4 focus:ring-[#A72F3B]/10 focus:border-[#A72F3B] outline-none transition"
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
              <div className="h-4 bg-[#F5F5F5] rounded w-1/3 mb-4" />
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
                <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cls}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </span>
                  <div className="flex items-center gap-4 text-xs text-[#898989] flex-wrap">
                    <span>{fmtDate(order.created_at)}</span>
                    <span>
                      کد سفارش{" "}
                      <span className="font-mono text-[#656565]">
                        {order.order_number}
                      </span>
                    </span>
                    <span className="font-semibold text-[#242424]">
                      مبلغ {fmtPrice(order.total)}
                    </span>
                  </div>
                </div>

                {order.items && order.items.length > 0 ? (
                  <div className="flex items-center gap-2 flex-wrap">
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
                ) : (
                  <p className="text-xs text-[#898989]">
                    {order.items_count.toLocaleString("fa-IR")} محصول
                  </p>
                )}

                {order.tracking_code && (
                  <p className="text-xs text-[#A72F3B] font-mono mt-3 flex items-center gap-1">
                    <HiTruck className="w-3.5 h-3.5" />
                    کد رهگیری: {order.tracking_code}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-[#F5F5F5]">
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
