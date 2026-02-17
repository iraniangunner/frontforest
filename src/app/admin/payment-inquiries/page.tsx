"use client";

import { useState, useEffect } from "react";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import {
  HiRefresh,
  HiCheckCircle,
  HiClock,
  HiExclamationCircle,
  HiXCircle,
  HiCash,
} from "react-icons/hi";
import toast from "react-hot-toast";
import { adminOrdersAPI } from "@/lib/api"; // ✅ Import API helper

interface Transaction {
  id: number;
  authority: string;
  amount: number;
  status: string;
}

interface Order {
  id: number;
  order_number: string;
  total: number;
  status: string;
  user: { id: number; name: string };
  transactions: Transaction[];
  created_at: string;
  zarinpal_status?: string;
  can_verify?: boolean;
  checking?: boolean;
}

export default function PaymentInquiriesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [checkingAll, setCheckingAll] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [meta.current_page]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // ✅ Use adminOrdersAPI
      const response = await adminOrdersAPI.getPending({
        page: meta.current_page,
        per_page: 15,
      });

      setOrders(response.data.data);
      setMeta({
        current_page: response.data.meta.current_page,
        last_page: response.data.meta.last_page,
        total: response.data.meta.total,
      });
    } catch (error: any) {
      console.error("Load orders error:", error);
      toast.error("خطا در دریافت سفارشات");
    } finally {
      setLoading(false);
    }
  };

  const checkOrderStatus = async (order: Order) => {
    // Update UI to show checking
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, checking: true } : o))
    );

    try {
      // ✅ Use adminOrdersAPI
      const response = await adminOrdersAPI.checkStatus(order.id);
      const data = response.data.data;

      // Update order with status
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
                ...o,
                zarinpal_status: data.zarinpal_status,
                can_verify: data.can_verify,
                checking: false,
              }
            : o
        )
      );

      if (data.zarinpal_status === "PAID") {
        toast.success(`سفارش ${order.order_number} پرداخت شده است`);
      } else if (data.zarinpal_status === "FAILED") {
        toast.error(`سفارش ${order.order_number} ناموفق است`);
      } else {
        toast(`وضعیت: ${getStatusLabel(data.zarinpal_status)}`, {
          icon: "ℹ️",
          style: {
            background: "#3b82f6",
            color: "#fff",
          },
        });
      }
    } catch (error: any) {
      console.error("Check status error:", error);
      toast.error("خطا در چک وضعیت");

      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, checking: false } : o))
      );
    }
  };

  const checkAllStatuses = async () => {
    setCheckingAll(true);
    try {
      // Check each order sequentially with delay
      for (const order of orders) {
        await checkOrderStatus(order);
        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      toast.success("همه سفارشات چک شدند");
    } catch (error) {
      toast.error("خطا در چک وضعیت‌ها");
    } finally {
      setCheckingAll(false);
    }
  };

  const handleManualVerify = async (order: Order) => {
    if (
      !window.confirm(
        `آیا از تایید دستی سفارش ${order.order_number} اطمینان دارید؟`
      )
    ) {
      return;
    }

    try {
      // ✅ Use adminOrdersAPI
      const response = await adminOrdersAPI.manualVerify(order.id);

      toast.success(`سفارش تایید شد. کد پیگیری: ${response.data.data.ref_id}`);
      // Remove from list or reload
      loadOrders();
    } catch (error: any) {
      console.error("Manual verify error:", error);
      toast.error(error.response?.data?.message || "خطا در تایید سفارش");
    }
  };

  const getStatusLabel = (status?: string) => {
    const labels: Record<string, string> = {
      PAID: "پرداخت شده",
      VERIFIED: "تایید شده",
      IN_BANK: "در حال پرداخت",
      FAILED: "ناموفق",
      REVERSED: "برگشت خورده",
    };
    return labels[status || ""] || "نامشخص";
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "PAID":
        return <Badge variant="success">پرداخت شده ✓</Badge>;
      case "VERIFIED":
        return <Badge variant="info">تایید شده</Badge>;
      case "IN_BANK":
        return <Badge variant="warning">در حال پرداخت</Badge>;
      case "FAILED":
        return <Badge variant="danger">ناموفق</Badge>;
      case "REVERSED":
        return <Badge variant="secondary">برگشت خورده</Badge>;
      default:
        return <Badge variant="secondary">چک نشده</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString() + " تومان";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    {
      header: "شماره سفارش",
      render: (row: Order) => (
        <div>
          <p className="font-medium font-mono text-sm">{row.order_number}</p>
          <p className="text-xs text-gray-500">{formatDate(row.created_at)}</p>
        </div>
      ),
    },
    {
      header: "کاربر",
      render: (row: Order) => (
        <p className="text-sm">{row.user?.name || "نامشخص"}</p>
      ),
    },
    {
      header: "مبلغ",
      render: (row: Order) => (
        <div className="flex items-center gap-1">
          <HiCash className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{formatPrice(row.total)}</span>
        </div>
      ),
    },
    {
      header: "Authority",
      render: (row: Order) => (
        <p className="font-mono text-xs text-gray-500">
          {row.transactions?.[0]?.authority?.substring(0, 20) || "-"}...
        </p>
      ),
    },
    {
      header: "وضعیت Zarinpal",
      render: (row: Order) => (
        <div>
          {row.checking ? (
            <Badge variant="secondary">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                در حال چک...
              </div>
            </Badge>
          ) : (
            getStatusBadge(row.zarinpal_status)
          )}
        </div>
      ),
    },
    {
      header: "عملیات",
      render: (row: Order) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => checkOrderStatus(row)}
            disabled={row.checking || checkingAll}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
            title="چک وضعیت"
          >
            <HiRefresh
              className={`w-4 h-4 ${row.checking ? "animate-spin" : ""}`}
            />
          </button>

          {row.can_verify && (
            <button
              onClick={() => handleManualVerify(row)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
              title="تایید دستی"
            >
              <HiCheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header title="استعلام وضعیت پرداخت‌ها" />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <HiClock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">کل pending</p>
                <p className="text-xl font-bold">{meta.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <HiCheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">پرداخت شده</p>
                <p className="text-xl font-bold">
                  {orders.filter((o) => o.zarinpal_status === "PAID").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <HiXCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">ناموفق</p>
                <p className="text-xl font-bold">
                  {orders.filter((o) => o.zarinpal_status === "FAILED").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <HiExclamationCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">چک نشده</p>
                <p className="text-xl font-bold">
                  {orders.filter((o) => !o.zarinpal_status).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">سفارشات در انتظار ({meta.total})</h3>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={loadOrders}
                disabled={loading}
              >
                <HiRefresh className="w-4 h-4" />
                بروزرسانی
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={checkAllStatuses}
                disabled={checkingAll || loading || orders.length === 0}
              >
                {checkingAll ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    در حال چک...
                  </>
                ) : (
                  <>
                    <HiRefresh className="w-4 h-4" />
                    چک همه
                  </>
                )}
              </Button>
            </div>
          </div>

          <Table columns={columns} data={orders} loading={loading} />

          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={(page) => setMeta({ ...meta, current_page: page })}
          />
        </div>
        {/* Help Box */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <HiExclamationCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">راهنما:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  سفارشاتی که وضعیت «پرداخت شده» دارند اما verify نشدن اینجا
                  نمایش داده می‌شوند
                </li>
                <li>
                  با کلیک روی دکمه «چک وضعیت» می‌تونید وضعیت واقعی رو از
                  زرین‌پال دریافت کنید
                </li>
                <li>
                  اگر وضعیت «پرداخت شده ✓» بود، می‌تونید با دکمه تایید دستی
                  سفارش رو کامل کنید
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
