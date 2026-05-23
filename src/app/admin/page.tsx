"use client";

import { useState, useEffect } from "react";
import Header from "../_components/admin/Header";
import { adminDashboardAPI } from "../../lib/api";
import {
  HiShoppingBag,
  HiUsers,
  HiCurrencyDollar,
  HiClock,
  HiCheckCircle,
  HiTruck,
  HiCube,
  HiX,
  HiCreditCard,
  HiReceiptTax,
  HiCalendar,
  HiRefresh,
} from "react-icons/hi";

interface Stats {
  orders: {
    total: number;
    pending: number;
    paid: number;
    processing: number;
    shipped: number;
    delivered: number;
    canceled: number;
    returned: number;
    this_month: number;
    total_revenue: number;
    revenue_online: number;
    revenue_card: number;
    revenue_this_month: number;
    revenue_returned: number;
  };
  users: {
    total: number;
    active: number;
    new_this_month: number;
  };
}

const fmt = (n: number) => Number(n).toLocaleString("fa-IR");
const fmtRev = (n: number) => `${Number(n).toLocaleString("fa-IR")} ت`;

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await adminDashboardAPI.getStats();
      setStats(res.data.data);
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );

  return (
    <div>
      <Header title="داشبورد" />
      <div className="p-6 space-y-6">
        {/* ── درآمد ── */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">درآمد</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                title: "درآمد کل",
                value: fmtRev(stats?.orders.total_revenue ?? 0),
                icon: HiCurrencyDollar,
                color: "bg-emerald-500",
              },
              {
                title: "پرداخت آنلاین",
                value: fmtRev(stats?.orders.revenue_online ?? 0),
                icon: HiCreditCard,
                color: "bg-blue-500",
              },
              {
                title: "کارت به کارت",
                value: fmtRev(stats?.orders.revenue_card ?? 0),
                icon: HiReceiptTax,
                color: "bg-purple-500",
              },
              {
                title: "مرجوعی",
                value: fmtRev(stats?.orders.revenue_returned ?? 0),
                icon: HiRefresh,
                color: "bg-red-400",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}
                >
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{s.title}</p>
                  <p className="font-bold text-gray-900 text-lg mt-0.5">
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── این ماه ── */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">این ماه</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "سفارشات این ماه",
                value: fmt(stats?.orders.this_month ?? 0),
                icon: HiCalendar,
                color: "bg-teal-500",
              },
              {
                title: "درآمد این ماه",
                value: fmtRev(stats?.orders.revenue_this_month ?? 0),
                icon: HiCurrencyDollar,
                color: "bg-teal-600",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}
                >
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{s.title}</p>
                  <p className="font-bold text-gray-900 text-lg mt-0.5">
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── وضعیت سفارشات ── */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            وضعیت سفارشات
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: "کل سفارشات",
                value: fmt(stats?.orders.total ?? 0),
                icon: HiShoppingBag,
                color: "bg-blue-500",
              },
              {
                title: "در انتظار",
                value: fmt(stats?.orders.pending ?? 0),
                icon: HiClock,
                color: "bg-yellow-500",
              },
              {
                title: "در پردازش",
                value: fmt(stats?.orders.processing ?? 0),
                icon: HiCube,
                color: "bg-purple-500",
              },
              {
                title: "ارسال شده",
                value: fmt(stats?.orders.shipped ?? 0),
                icon: HiTruck,
                color: "bg-indigo-500",
              },
              {
                title: "تحویل شده",
                value: fmt(stats?.orders.delivered ?? 0),
                icon: HiCheckCircle,
                color: "bg-green-500",
              },
              {
                title: "پرداخت شده",
                value: fmt(stats?.orders.paid ?? 0),
                icon: HiCheckCircle,
                color: "bg-teal-500",
              },
              {
                title: "مرجوع شده",
                value: fmt(stats?.orders.returned ?? 0),
                icon: HiRefresh,
                color: "bg-orange-400",
              },
              {
                title: "لغو شده",
                value: fmt(stats?.orders.canceled ?? 0),
                icon: HiX,
                color: "bg-red-400",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}
                >
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{s.title}</p>
                  <p className="font-bold text-gray-900 text-base mt-0.5">
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── کاربران ── */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">کاربران</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                title: "کل کاربران",
                value: fmt(stats?.users.total ?? 0),
                icon: HiUsers,
                color: "bg-blue-500",
              },
              {
                title: "کاربران فعال",
                value: fmt(stats?.users.active ?? 0),
                icon: HiUsers,
                color: "bg-green-500",
              },
              {
                title: "عضو این ماه",
                value: fmt(stats?.users.new_this_month ?? 0),
                icon: HiUsers,
                color: "bg-pink-500",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}
                >
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{s.title}</p>
                  <p className="font-bold text-gray-900 text-xl mt-0.5">
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
