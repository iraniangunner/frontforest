"use client";

import { useState, useEffect } from "react";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import {
  HiSearch,
  HiEye,
  HiCash,
  HiShoppingBag,
  HiTrendingUp,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiBan,
  HiX,
  HiUser,
  HiCreditCard,
} from "react-icons/hi";
import toast from "react-hot-toast";
import { adminOrdersAPI } from "@/lib/api";

interface Transaction {
  id: number;
  ref_id: string | null;
  status: string;
  authority: string;
  amount: number;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  mobile: string;
  email?: string;
}

interface OrderItem {
  id: number;
  component_title: string;
  price: number;
  sale_price: number | null;
  paid_price: number;
}

interface Order {
  id: number;
  order_number: string;
  total: number;
  subtotal: number;
  discount: number;
  status: string;
  status_label: string;
  items_count: number;
  items?: OrderItem[];
  user: User;
  latest_transaction?: Transaction;
  transactions?: Transaction[];
  created_at: string;
  paid_at: string | null;
}

interface Stats {
  total: number;
  pending: number;
  paid: number;
  failed: number;
  cancelled: number;
  total_revenue: number;
}

type FilterType = "all" | "pending" | "paid" | "failed" | "cancelled";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    stats: {
      total: 0,
      pending: 0,
      paid: 0,
      failed: 0,
      cancelled: 0,
      total_revenue: 0,
    } as Stats,
  });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [meta.current_page, filter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await adminOrdersAPI.getAll({
        page: meta.current_page,
        per_page: 15,
        status: filter,
        search: search || undefined,
      });

      setOrders(response.data.data);
      setMeta({
        current_page: response.data.meta.current_page,
        last_page: response.data.meta.last_page,
        total: response.data.meta.total,
        stats: response.data.meta.stats,
      });
    } catch (error) {
      console.error("Load orders error:", error);
      toast.error("خطا در دریافت سفارشات");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setMeta({ ...meta, current_page: 1 });
    loadOrders();
  };

  const handleViewOrder = async (order: Order) => {
    setModalOpen(true);
    setSelectedOrder(order);
    setLoadingOrder(true);

    try {
      const response = await adminOrdersAPI.getOne(order.id);
      setSelectedOrder(response.data.data);
    } catch (error) {
      console.error("Load order error:", error);
      toast.error("خطا در دریافت جزئیات سفارش");
    } finally {
      setLoadingOrder(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString() + " تومان";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="success">پرداخت شده</Badge>;
      case "pending":
        return <Badge variant="warning">در انتظار</Badge>;
      case "failed":
        return <Badge variant="danger">ناموفق</Badge>;
      case "cancelled":
        return <Badge variant="secondary">لغو شده</Badge>;
      case "refunded":
        return <Badge variant="info">مسترد شده</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <HiCheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <HiClock className="w-5 h-5 text-yellow-500" />;
      case "failed":
        return <HiXCircle className="w-5 h-5 text-red-500" />;
      case "cancelled":
        return <HiBan className="w-5 h-5 text-gray-500" />;
      default:
        return <HiShoppingBag className="w-5 h-5 text-gray-400" />;
    }
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
        <div>
          <p className="font-medium text-sm">{row.user?.name || "نامشخص"}</p>
          <p className="text-xs text-gray-500">{row.user?.mobile || "-"}</p>
        </div>
      ),
    },
    {
      header: "تعداد آیتم",
      render: (row: Order) => <p className="text-center">{row.items_count}</p>,
    },
    {
      header: "مبلغ",
      render: (row: Order) => <p className="font-medium">{formatPrice(row.total)}</p>,
    },
    {
      header: "وضعیت",
      render: (row: Order) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(row.status)}
          {getStatusBadge(row.status)}
        </div>
      ),
    },
    {
      header: "کد پیگیری",
      render: (row: Order) => (
        <p className="text-xs text-gray-500 font-mono">
          {row.latest_transaction?.ref_id || "-"}
        </p>
      ),
    },
    {
      header: "عملیات",
      render: (row: Order) => (
        <button
          onClick={() => handleViewOrder(row)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          title="مشاهده جزئیات"
        >
          <HiEye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <Header title="مدیریت سفارشات" />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <HiShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">کل سفارشات</p>
                <p className="text-2xl font-bold">{meta.stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <HiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">پرداخت شده</p>
                <p className="text-2xl font-bold">{meta.stats.paid}</p>
              </div>
            </div>
          </div>
<div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <HiClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">در انتظار</p>
                <p className="text-2xl font-bold">{meta.stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <HiTrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">درآمد کل</p>
                <p className="text-lg font-bold">
                  {formatPrice(meta.stats.total_revenue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm mb-4">
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full">
                <div className="relative">
                  <HiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="جستجو با شماره سفارش یا نام کاربر..."
                    className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <Button variant="primary" size="sm" onClick={handleSearch}>
                جستجو
              </Button>
            </div>
          </div>

          {/* Status Filters */}
          <div className="p-4 flex flex-wrap items-center gap-2">
            <Button
              variant={filter === "all" ? "primary" : "secondary"}
              size="sm"
              onClick={() => {
                setFilter("all");
                setMeta({ ...meta, current_page: 1 });
              }}
            >
              همه ({meta.stats.total})
            </Button>
            <Button
              variant={filter === "pending" ? "primary" : "secondary"}
              size="sm"
              onClick={() => {
                setFilter("pending");
                setMeta({ ...meta, current_page: 1 });
              }}
            >
              در انتظار ({meta.stats.pending})
            </Button>
            <Button
              variant={filter === "paid" ? "primary" : "secondary"}
              size="sm"
              onClick={() => {
                setFilter("paid");
                setMeta({ ...meta, current_page: 1 });
              }}
            >
              پرداخت شده ({meta.stats.paid})
            </Button>
            <Button
              variant={filter === "failed" ? "primary" : "secondary"}
              size="sm"
              onClick={() => {
                setFilter("failed");
                setMeta({ ...meta, current_page: 1 });
              }}
            >
              ناموفق ({meta.stats.failed})
            </Button>
            <Button
              variant={filter === "cancelled" ? "primary" : "secondary"}
              size="sm"
              onClick={() => {
                setFilter("cancelled");
                setMeta({ ...meta, current_page: 1 });
              }}
            >
              لغو شده ({meta.stats.cancelled})
            </Button>
          </div>
        </div>
{/* Table */}
        <div className="bg-white rounded-xl shadow-sm">
          <Table columns={columns} data={orders} loading={loading} />

          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={(page) => setMeta({ ...meta, current_page: page })}
          />
        </div>
      </div>

      {/* Order Detail Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">
                  سفارش #{selectedOrder?.order_number}
                </h2>
                {selectedOrder && getStatusBadge(selectedOrder.status)}
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiX className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingOrder ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : selectedOrder ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold mb-3">
                        آیتم‌های سفارش ({selectedOrder.items?.length || 0})
                      </h3>
                      <div className="space-y-2">
                        {selectedOrder.items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-sm">
                                {item.component_title}
                              </p>
                              {item.sale_price && item.sale_price < item.price && (
                                <p className="text-xs text-gray-500 line-through">
                                  {formatPrice(item.price)}
                                </p>
                              )}
                            </div>
                            <p className="font-bold">
                              {formatPrice(item.paid_price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Transactions */}
                    {selectedOrder.transactions &&
                      selectedOrder.transactions.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3">
                            تراکنش‌ها ({selectedOrder.transactions.length})
                          </h3>
                          <div className="space-y-2">
                            {selectedOrder.transactions.map((transaction) => (
                              <div
                                key={transaction.id}
className="p-3 border border-gray-200 rounded-lg"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <Badge
                                    variant={
                                      transaction.status === "success"
                                        ? "success"
                                        : transaction.status === "pending"
                                        ? "warning"
                                        : "danger"
                                    }
                                  >
                                    {transaction.status}
                                  </Badge>
                                  <p className="text-xs text-gray-500">
                                    {formatDate(transaction.created_at)}
                                  </p>
                                </div>
                                <div className="space-y-1 text-sm">
                                  <p className="text-gray-600">
                                    Authority:{" "}
                                    <span className="font-mono text-xs">
                                      {transaction.authority}
                                    </span>
                                  </p>
                                  {transaction.ref_id && (
                                    <p className="text-gray-600">
                                      کد پیگیری:{" "}
                                      <span className="font-mono">
                                        {transaction.ref_id}
                                      </span>
                                    </p>
                                  )}
                                  <p className="text-gray-600">
                                    مبلغ: {formatPrice(transaction.amount)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Price Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-3">خلاصه سفارش</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">جمع کل</span>
                          <span>{formatPrice(selectedOrder.subtotal)}</span>
                        </div>
                        {selectedOrder.discount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>تخفیف</span>
                            <span>-{formatPrice(selectedOrder.discount)}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                          <span>مبلغ نهایی</span>
                          <span>{formatPrice(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-3">اطلاعات کاربر</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <HiUser className="w-4 h-4 text-gray-400" />
<div className="text-sm">
                            <p className="text-gray-500">نام</p>
                            <p className="font-medium">
                              {selectedOrder.user.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <HiCreditCard className="w-4 h-4 text-gray-400" />
                          <div className="text-sm">
                            <p className="text-gray-500">موبایل</p>
                            <p className="font-medium">
                              {selectedOrder.user.mobile}
                            </p>
                          </div>
                        </div>
                        {selectedOrder.user.email && (
                          <div className="flex items-center gap-2">
                            <HiCreditCard className="w-4 h-4 text-gray-400" />
                            <div className="text-sm">
                              <p className="text-gray-500">ایمیل</p>
                              <p className="font-medium">
                                {selectedOrder.user.email}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-3">جزئیات</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-gray-500">تاریخ ثبت</p>
                          <p className="font-medium">
                            {formatDate(selectedOrder.created_at)}
                          </p>
                        </div>
                        {selectedOrder.paid_at && (
                          <div>
                            <p className="text-gray-500">تاریخ پرداخت</p>
                            <p className="font-medium">
                              {formatDate(selectedOrder.paid_at)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  خطا در دریافت اطلاعات
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button variant="secondary" onClick={closeModal}>
                بستن
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}