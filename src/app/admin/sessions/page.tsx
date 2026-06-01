"use client";

// app/admin/sessions/page.tsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Header from "@/app/_components/admin/Header";
import Table from "@/app/_components/admin/Table";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import Button from "@/app/_components/admin/Button";
import {
  HiSearch,
  HiTrash,
  HiDesktopComputer,
  HiDeviceMobile,
  HiShieldExclamation,
  HiCheckCircle,
  HiX,
  HiRefresh,
} from "react-icons/hi";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface Session {
  id: number;
  user: { id: number; name: string; mobile: string };
  device_name: string;
  ip_address: string;
  last_used_at: string | null;
  expires_at: string | null;
  is_revoked: boolean;
  created_at: string;
}

const fmtDate = (d: string | null) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isMobile = (name: string) =>
  name.includes("iPhone") || name.includes("iPad") || name.includes("Android");

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

function ConfirmRevokeModal({
  session,
  onConfirm,
  onClose,
}: {
  session: Session;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <PortalModal>
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">لغو نشست</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
            <HiShieldExclamation className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">
              نشست <span className="font-bold">{session.device_name}</span>{" "}
              کاربر <span className="font-bold">{session.user.name}</span> لغو
              میشه.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            کاربر از این دستگاه logout میشه و باید دوباره لاگین کنه.
          </p>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            انصراف
          </button>
          <button
            onClick={handle}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "در حال لغو..." : "لغو نشست"}
          </button>
        </div>
      </div>
    </PortalModal>
  );
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "revoked">("all");
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [revoking, setRevoking] = useState<Session | null>(null);

  useEffect(() => {
    load();
  }, [meta.current_page, filter]);

  const load = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        page: meta.current_page,
        per_page: 15,
        status: filter === "all" ? undefined : filter,
        search: search.trim() || undefined, 
      };

      const res = await api.get("/admin/sessions", {
        params,
        requiresAuth: true,
      });
      setSessions(res.data.data);
      setMeta((p) => ({
        ...p,
        current_page: res.data.meta.current_page,
        last_page: res.data.meta.last_page,
        total: res.data.meta.total,
      }));
    } catch {
      toast.error("خطا در دریافت نشست‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (session: Session) => {
    try {
      await api.delete(`/admin/sessions/${session.id}`, { requiresAuth: true });
      toast.success("نشست لغو شد");
      setRevoking(null);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در لغو نشست");
    }
  };

  const FILTERS = [
    { key: "all", label: "همه" },
    { key: "active", label: "فعال" },
    { key: "revoked", label: "لغو شده" },
  ];

  const columns = [
    {
      header: "کاربر",
      render: (row: Session) => (
        <div>
          <p className="font-medium text-gray-900 text-sm">{row.user.name}</p>
          <p className="text-xs text-gray-400 font-mono" dir="ltr">
            {row.user.mobile}
          </p>
        </div>
      ),
    },
    {
      header: "دستگاه",
      render: (row: Session) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {isMobile(row.device_name) ? (
              <HiDeviceMobile className="w-4 h-4 text-gray-500" />
            ) : (
              <HiDesktopComputer className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {row.device_name}
            </p>
            <p className="text-xs text-gray-400" dir="ltr">
              {row.ip_address}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "آخرین فعالیت",
      render: (row: Session) => (
        <span className="text-xs text-gray-500">
          {fmtDate(row.last_used_at)}
        </span>
      ),
    },
    {
      header: "انقضا",
      render: (row: Session) => (
        <span className="text-xs text-gray-500">{fmtDate(row.expires_at)}</span>
      ),
    },
    {
      header: "وضعیت",
      render: (row: Session) => (
        <Badge variant={row.is_revoked ? "danger" : "success"}>
          {row.is_revoked ? "لغو شده" : "فعال"}
        </Badge>
      ),
    },
    {
      header: "عملیات",
      render: (row: Session) =>
        !row.is_revoked ? (
          <button
            onClick={() => setRevoking(row)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="لغو نشست"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        ),
    },
  ];

  return (
    <div>
      <Header title="مدیریت نشست‌ها" />
      <div className="p-6 space-y-5">
        {/* آمار */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              label: "کل نشست‌ها",
              value: meta.total,
              icon: HiDesktopComputer,
              bg: "bg-blue-100",
              ic: "text-blue-600",
            },
            {
              label: "نشست‌های فعال",
              value: sessions.filter((s) => !s.is_revoked).length,
              icon: HiCheckCircle,
              bg: "bg-teal-100",
              ic: "text-teal-600",
            },
            {
              label: "لغو شده",
              value: sessions.filter((s) => s.is_revoked).length,
              icon: HiShieldExclamation,
              bg: "bg-red-100",
              ic: "text-red-600",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}
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

        {/* جستجو + فیلتر */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100 flex gap-3">
            <div className="flex-1 relative">
              <HiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load()}
                placeholder="جستجو با نام یا موبایل کاربر..."
                className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>
            <Button onClick={load} variant="primary" size="sm">
              جستجو
            </Button>
            <button
              onClick={load}
              className="p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <HiRefresh className="w-4 h-4" />
            </button>
          </div>

          <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-gray-100">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setFilter(f.key as any);
                  setMeta((p) => ({ ...p, current_page: 1 }));
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  filter === f.key
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <Table columns={columns} data={sessions} loading={loading} />

          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={(page) =>
              setMeta((p) => ({ ...p, current_page: page }))
            }
          />
        </div>
      </div>

      {revoking && (
        <ConfirmRevokeModal
          session={revoking}
          onConfirm={() => handleRevoke(revoking)}
          onClose={() => setRevoking(null)}
        />
      )}
    </div>
  );
}
