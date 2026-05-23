"use client";

// app/admin/return-requests/page.tsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import { returnRequestsAPI } from "@/lib/api";
import {
  HiX,
  HiCheck,
  HiCheckCircle,
  HiClock,
  HiRefresh,
  HiEye,
  HiCreditCard,
  HiTruck,
} from "react-icons/hi";
import toast from "react-hot-toast";

interface ReturnItem {
  id: number;
  quantity: number;
  order_item: { product_title: string; paid_price: number; quantity: number };
}

interface ReturnRequest {
  id: number;
  status: "pending" | "approved" | "rejected";
  reason: string;
  description: string | null;
  admin_note: string | null;

  return_tracking_code: string | null;
  return_carrier: string | null;
  created_at: string;
  order: {
    id: number;
    order_number: string;
    total: number;
    discount: number;
    coupon_discount: number;
    subtotal: number;
  };
  user: {
    id: number;
    name: string;
    mobile: string;
    bank_card_number: string | null;
    bank_card_owner: string | null;
  };
  items: ReturnItem[];
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const REASON_LABELS: Record<string, string> = {
  damaged: "محصول آسیب دیده",
  wrong_item: "اشتباه ارسال شده",
  not_as_described: "مطابق توضیحات نیست",
  changed_mind: "پشیمان شده",
  other: "سایر",
};

const CARRIER_LABELS: Record<string, string> = {
  post: "پست ملی",
  snapbox: "اسنپ‌باکس",
  tipax: "تیپاکس",
};

const fmt = (n: number) => Number(n).toLocaleString("fa-IR");
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function calcRefundAmount(request: ReturnRequest): number {
  const returnedSubtotal = request.items.reduce(
    (sum, item) => sum + item.order_item.paid_price * item.quantity,
    0
  );
  const totalDiscount = request.order.coupon_discount || 0;
  if (totalDiscount > 0 && request.order.subtotal > 0) {
    const ratio = totalDiscount / request.order.subtotal;
    return Math.round(returnedSubtotal * (1 - ratio));
  }
  return returnedSubtotal;
}

function PortalModal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  if (!mounted) return null;
  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
    >
      {children}
    </div>,
    document.body
  );
}

function DetailModal({
  request,
  onClose,
  onAction,
}: {
  request: ReturnRequest;
  onClose: () => void;
  onAction: () => void;
}) {
  const [adminNote, setAdminNote] = useState(request.admin_note || "");
  const [saving, setSaving] = useState(false);
  const refundAmount = calcRefundAmount(request);

  const handleApprove = async () => {
    setSaving(true);
    try {
      await returnRequestsAPI.approve(request.id, adminNote);
      toast.success("درخواست تایید شد — موجودی انبار آپدیت شد");
      onAction();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا");
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    if (!adminNote.trim()) {
      toast.error("لطفاً دلیل رد را وارد کنید");
      return;
    }
    setSaving(true);
    try {
      await returnRequestsAPI.reject(request.id, adminNote);
      toast.success("درخواست رد شد");
      onAction();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalModal>
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <div>
            <h3 className="font-bold text-gray-900">جزئیات درخواست مرجوعی</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              سفارش #{request.order.order_number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* کاربر */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold flex-shrink-0">
              {request.user.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900">
                {request.user.name}
              </p>
              <p className="text-xs text-gray-500 font-mono" dir="ltr">
                {request.user.mobile}
              </p>
            </div>
            <div className="mr-auto">
              <Badge
                variant={
                  request.status === "approved"
                    ? "success"
                    : request.status === "rejected"
                    ? "danger"
                    : "warning"
                }
              >
                {request.status === "approved"
                  ? "تایید شده"
                  : request.status === "rejected"
                  ? "رد شده"
                  : "در انتظار"}
              </Badge>
            </div>
          </div>

          {/* دلیل */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">
              دلیل مرجوعی
            </p>
            <p className="text-sm text-gray-900 bg-gray-50 rounded-xl px-4 py-3">
              {REASON_LABELS[request.reason] || request.reason}
            </p>
          </div>

          {request.description && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">
                توضیحات کاربر
              </p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">
                {request.description}
              </p>
            </div>
          )}

          {/* محصولات */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">
              محصولات مرجوعی
            </p>
            <div className="space-y-2">
              {request.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <p className="text-sm text-gray-900 flex-1 min-w-0 truncate pr-2">
                    {item.order_item.product_title}
                  </p>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-500">
                      {item.quantity.toLocaleString("fa-IR")} عدد
                    </span>
                    <span className="text-xs font-medium text-gray-700">
                      {fmt(item.order_item.paid_price * item.quantity)} ت
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600 font-medium">
                  مبلغ قابل بازگشت
                </p>
                {request.order.coupon_discount > 0 && (
                  <p className="text-xs text-emerald-500 mt-0.5">
                    با احتساب تخفیف کوپن ({fmt(request.order.coupon_discount)}{" "}
                    ت)
                  </p>
                )}
              </div>
              <p className="text-lg font-extrabold text-emerald-700">
                {fmt(refundAmount)} تومان
              </p>
            </div>
          </div>

          {/* کارت بانکی */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
              <HiCreditCard className="w-3.5 h-3.5" /> اطلاعات بانکی
            </p>
            {request.user.bank_card_number ? (
              <div className="bg-blue-50 rounded-xl px-4 py-3 border border-blue-100 space-y-1">
                <p
                  className="text-base font-mono font-bold text-blue-900 tracking-widest"
                  dir="ltr"
                >
                  {request.user.bank_card_number.replace(/(\d{4})(?=\d)/g, "$1-")}
                </p>
                {request.user.bank_card_owner && (
                  <p className="text-xs text-blue-700">
                    {request.user.bank_card_owner}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
                ثبت نشده
              </p>
            )}
          </div>

          {/* کد رهگیری مرجوعی */}
          {request.return_tracking_code && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                <HiTruck className="w-3.5 h-3.5" /> کد رهگیری کالای مرجوعی
              </p>
              <div className="bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100 space-y-1">
                <p
                  className="text-base font-mono font-bold text-indigo-900"
                  dir="ltr"
                >
                  {request.return_tracking_code}
                </p>
                {request.return_carrier && (
                  <p className="text-xs text-indigo-600">
                    {CARRIER_LABELS[request.return_carrier]}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* یادداشت ادمین */}
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">
              {request.status === "pending"
                ? "یادداشت ادمین"
                : "یادداشت ادمین (ثبت شده)"}
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              disabled={request.status !== "pending"}
              placeholder="دلیل تایید یا رد را بنویسید..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </div>

        {request.status === "pending" && (
          <div className="flex gap-3 px-6 py-4 border-t flex-shrink-0">
            <button
              onClick={handleReject}
              disabled={saving}
              className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              <HiX className="w-4 h-4" /> رد درخواست
            </button>
            <button
              onClick={handleApprove}
              disabled={saving}
              className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              <HiCheck className="w-4 h-4" />{" "}
              {saving ? "در حال ثبت..." : "تایید مرجوعی"}
            </button>
          </div>
        )}
      </div>
    </PortalModal>
  );
}

export default function AdminReturnRequestsPage() {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const [selected, setSelected] = useState<ReturnRequest | null>(null);

  useEffect(() => {
    load();
  }, [meta.current_page, filter]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await returnRequestsAPI.adminGetAll({
        page: meta.current_page,
        per_page: 15,
        status: filter !== "all" ? filter : undefined,
      });
      setRequests(res.data.data);
      setMeta((p) => ({ ...p, last_page: res.data.meta.last_page }));
      if (res.data.meta.stats) setStats(res.data.meta.stats);
    } catch {
      toast.error("خطا در دریافت درخواست‌ها");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "کاربر",
      render: (row: ReturnRequest) => (
        <div>
          <p className="font-medium text-sm">{row.user.name}</p>
          <p className="text-xs text-gray-400 font-mono" dir="ltr">
            {row.user.mobile}
          </p>
        </div>
      ),
    },
    {
      header: "سفارش",
      render: (row: ReturnRequest) => (
        <span className="text-sm text-gray-700 font-mono">
          #{row.order.order_number}
        </span>
      ),
    },
    {
      header: "مبلغ بازگشتی",
      render: (row: ReturnRequest) => (
        <span className="text-sm font-bold text-emerald-700">
          {fmt(calcRefundAmount(row))} ت
        </span>
      ),
    },
    {
      header: "کارت بانکی",
      render: (row: ReturnRequest) =>
        row.user.bank_card_number ? (
          <span className="text-xs font-mono text-gray-700" dir="ltr">
            {row.user.bank_card_number.replace(/(\d{4})(?=\d)/g, "$1-")}
          </span>
        ) : (
          <span className="text-xs text-red-400">ثبت نشده</span>
        ),
    },
    {
      header: "کد رهگیری",
      render: (row: ReturnRequest) =>
        row.return_tracking_code ? (
          <div>
            <span className="text-xs font-mono text-indigo-700" dir="ltr">
              {row.return_tracking_code}
            </span>
            {row.return_carrier && (
              <p className="text-xs text-gray-400">
                {CARRIER_LABELS[row.return_carrier]}
              </p>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        ),
    },
    {
      header: "وضعیت",
      render: (row: ReturnRequest) => (
        <Badge
          variant={
            row.status === "approved"
              ? "success"
              : row.status === "rejected"
              ? "danger"
              : "warning"
          }
        >
          {row.status === "approved"
            ? "تایید شده"
            : row.status === "rejected"
            ? "رد شده"
            : "در انتظار"}
        </Badge>
      ),
    },
    {
      header: "عملیات",
      render: (row: ReturnRequest) => (
        <button
          onClick={() => setSelected(row)}
          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
          title="مشاهده"
        >
          <HiEye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <Header title="درخواست‌های مرجوعی" />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "کل",
              value: stats.total,
              icon: HiRefresh,
              bg: "bg-blue-100",
              ic: "text-blue-600",
            },
            {
              label: "در انتظار",
              value: stats.pending,
              icon: HiClock,
              bg: "bg-amber-100",
              ic: "text-amber-600",
            },
            {
              label: "تایید شده",
              value: stats.approved,
              icon: HiCheckCircle,
              bg: "bg-green-100",
              ic: "text-green-600",
            },
            {
              label: "رد شده",
              value: stats.rejected,
              icon: HiX,
              bg: "bg-red-100",
              ic: "text-red-500",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}
              >
                <s.icon className={`w-5 h-5 ${s.ic}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-900">
                  {s.value.toLocaleString("fa-IR")}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">لیست درخواست‌ها</h3>
            <div className="flex items-center gap-2">
              {[
                { key: "all", label: "همه" },
                { key: "pending", label: "در انتظار" },
                { key: "approved", label: "تایید شده" },
                { key: "rejected", label: "رد شده" },
              ].map((f) => (
                <Button
                  key={f.key}
                  variant={filter === f.key ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => {
                    setFilter(f.key);
                    setMeta((p) => ({ ...p, current_page: 1 }));
                  }}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
          <Table columns={columns} data={requests} loading={loading} />
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={(page) =>
              setMeta((p) => ({ ...p, current_page: page }))
            }
          />
        </div>
      </div>

      {selected && (
        <DetailModal
          request={selected}
          onClose={() => setSelected(null)}
          onAction={load}
        />
      )}
    </div>
  );
}
