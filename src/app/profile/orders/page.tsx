"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HiShoppingBag, HiArrowRight, HiCheck, HiX, HiClock, HiBan } from "react-icons/hi";
import { ordersAPI } from "@/lib/api";
import Pagination from "@/app/_components/ui/Pagination";
import toast from "react-hot-toast";

interface Order {
  id: number;
  order_number: string;
  total: number;
  status: string;
  status_label: string;
  items_count: number;
  created_at: string;
  paid_at: string | null;
  transaction?: {
    ref_id: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  useEffect(() => {
    loadOrders();
  }, [meta.current_page]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getAll({
        page: meta.current_page,
        per_page: 10,
      });
      setOrders(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString() + " تومان";
  };

 const getStatusIcon = (status: string) => {
  switch (status) {
    case "paid":
    case "success":
      return <HiCheck className="w-5 h-5 text-green-500" />;

    case "failed":
      return <HiX className="w-5 h-5 text-red-500" />;

    case "cancelled":
      return <HiBan className="w-5 h-5 text-gray-500" />;

    default:
      return <HiClock className="w-5 h-5 text-yellow-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
    case "success":
      return "bg-green-100 text-green-700";

    case "failed":
      return "bg-red-100 text-red-700";

    case "cancelled":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/profile"
            className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
          >
            <HiArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">سفارشات</h1>
            <p className="text-gray-500">{meta.total} سفارش</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <HiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              هنوز سفارشی ثبت نشده
            </h3>
            <p className="text-gray-500 mb-4">
              سفارشات شما اینجا نمایش داده می‌شوند
            </p>
            <Link
              href="/components"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              مشاهده کامپوننت‌ها
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/profile/orders/${order.id}`}
                className="block bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.order_number}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status_label}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {order.items_count} کامپوننت
                  </span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(order.total)}
                  </span>
                </div>

                {order.transaction?.ref_id && (
                  <p className="text-xs text-gray-400 mt-2">
                    کد پیگیری: {order.transaction.ref_id}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}

        {orders.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              // basePath="/profile/orders"
              onPageChange={(page) => setMeta({ ...meta, current_page: page })}
            />
          </div>
        )}
      </div>
    </div>
  );
}