"use client";

import { useState, useEffect } from "react";
import Header from "../_components/admin/Header";
import { componentsAPI, categoriesAPI, tagsAPI, reviewsAPI } from "../../lib/api";
import {
  HiOutlineCube,
  HiOutlineFolder,
  HiOutlineTag,
  HiOutlineStar,
  HiOutlineEye,
  HiOutlineDownload,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";

interface Stats {
  components: {
    total: number;
    active: number;
    total_views: number;
    total_downloads: number;
    total_sales: number;
  };
  categories: number;
  tags: number;
  reviews: number;
  pendingReviews: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [componentsRes, categoriesRes, tagsRes, reviewsRes] =
        await Promise.all([
          componentsAPI.getStatistics(),
          categoriesAPI.getAll({ per_page: 1 }),
          tagsAPI.adminGetAll({ per_page: 1 }),
          reviewsAPI.getAll({ per_page: 1 }),
        ]);

      setStats({
        components: componentsRes.data.data,
        categories: categoriesRes.data.meta?.total || 0,
        tags: tagsRes.data.meta?.total || 0,
        reviews: reviewsRes.data.meta?.total || 0,
        pendingReviews: reviewsRes.data.meta?.pending_count || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    subValue,
  }: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
    subValue?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subValue && <p className="text-sm text-gray-400 mt-1">{subValue}</p>}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Header title="داشبورد" />

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="کل کامپوننت‌ها"
            value={stats?.components?.total || 0}
            icon={HiOutlineCube}
            color="bg-blue-500"
            subValue={`${stats?.components?.active || 0} فعال`}
          />
          <StatCard
            title="دسته‌بندی‌ها"
            value={stats?.categories || 0}
            icon={HiOutlineFolder}
            color="bg-green-500"
          />
          <StatCard
            title="تگ‌ها"
            value={stats?.tags || 0}
            icon={HiOutlineTag}
            color="bg-purple-500"
          />
          <StatCard
            title="نظرات"
            value={stats?.reviews || 0}
            icon={HiOutlineStar}
            color="bg-yellow-500"
            subValue={`${stats?.pendingReviews || 0} در انتظار تایید`}
          />
        </div>

        {/* Component Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="بازدیدها"
            value={stats?.components?.total_views?.toLocaleString() || 0}
            icon={HiOutlineEye}
            color="bg-indigo-500"
          />
          <StatCard
            title="دانلودها"
            value={stats?.components?.total_downloads?.toLocaleString() || 0}
            icon={HiOutlineDownload}
            color="bg-pink-500"
          />
          <StatCard
            title="فروش‌ها"
            value={stats?.components?.total_sales?.toLocaleString() || 0}
            icon={HiOutlineCurrencyDollar}
            color="bg-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}