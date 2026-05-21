"use client";

import { useState, useEffect } from "react";
import Header from "../_components/admin/Header";
import { adminOrdersAPI, adminUsersAPI, adminCouponsAPI } from "../../lib/api";
import {
  HiShoppingBag,
  HiUsers,
  HiCurrencyDollar,
  HiClock,
  HiCheckCircle,
  HiTruck,
  HiTag,
  HiCube,
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
    total_revenue: number;
  };
  users: {
    total: number;
    active: number;
    new_this_month: number;
  };
  coupons: number;
}

const fmt = (n: number) => Number(n).toLocaleString("fa-IR");

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [ordersRes, usersRes] = await Promise.all([
        adminOrdersAPI.getAll({ per_page: 1 }),
        adminUsersAPI.getAll({ per_page: 1 }),
      ]);

      const os = ordersRes.data.meta?.stats || {};
      const us = usersRes.data.meta?.stats || {};

      setStats({
        orders: {
          total: os.total ?? 0,
          pending: os.pending ?? 0,
          paid: os.paid ?? 0,
          processing: os.processing ?? 0,
          shipped: os.shipped ?? 0,
          delivered: os.delivered ?? 0,
          canceled: os.canceled ?? 0,
          total_revenue: os.total_revenue ?? 0,
        },
        users: {
          total: us.total ?? 0,
          active: us.active ?? 0,
          new_this_month: us.new_this_month ?? 0,
        },
        coupons: 0,
      });
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
        {/* ── آمار سفارشات ── */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">سفارشات</h2>
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
                title: "لغو شده",
                value: fmt(stats?.orders.canceled ?? 0),
                icon: HiShoppingBag,
                color: "bg-gray-400",
              },
              {
                title: "پرداخت شده",
                value: fmt(stats?.orders.paid ?? 0),
                icon: HiCheckCircle,
                color: "bg-teal-500",
              },
              {
                title: "درآمد کل",
                value: `${fmt(stats?.orders.total_revenue ?? 0)} ت`,
                icon: HiCurrencyDollar,
                color: "bg-emerald-500",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}
                >
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{s.title}</p>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── آمار کاربران ── */}
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
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}
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
