"use client";

// app/admin/users/page.tsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import { adminUsersAPI } from "@/lib/api";
import {
  HiSearch,
  HiPencil,
  HiTrash,
  HiEye,
  HiUsers,
  HiUserAdd,
  HiCheckCircle,
  HiShieldCheck,
  HiX,
} from "react-icons/hi";
import toast from "react-hot-toast";

interface User {
  id: number;
  name: string;
  mobile: string;
  email: string | null;
  avatar: string | null;
  is_admin: boolean;
  is_active: boolean;
  orders_count: number;
  total_spent: number;
  created_at: string;
  last_order_at: string | null;
}

interface Stats {
  total: number;
  active: number;
  admins: number;
  new_this_month: number;
}

// فقط نام و ایمیل قابل ویرایش — موبایل read-only
interface FormData {
  name: string;
  is_admin: boolean;
  is_active: boolean;
}

const fmtPrice = (n: number) => Number(n).toLocaleString("fa-IR") + " ت";
const fmtDate = (d: string | null) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

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

// ── جزئیات کاربر ──
function UserDetailModal({
  userId,
  onClose,
}: {
  userId: number;
  onClose: () => void;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminUsersAPI
      .getOne(userId)
      .then((r) => setUser(r.data.data))
      .catch(() => toast.error("خطا در دریافت اطلاعات"))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <PortalModal>
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">جزئیات کاربر</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : user ? (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xl font-bold flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user.name?.charAt(0)
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{user.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={user.is_active ? "success" : "danger"}>
                      {user.is_active ? "فعال" : "غیرفعال"}
                    </Badge>
                    {user.is_admin && <Badge variant="primary">ادمین</Badge>}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "موبایل", value: user.mobile, dir: "ltr" },
                  { label: "ایمیل", value: user.email || "—", dir: "ltr" },
                  {
                    label: "تعداد سفارشات",
                    value: user.orders_count + " سفارش",
                  },
                  { label: "مجموع خرید", value: fmtPrice(user.total_spent) },
                  { label: "تاریخ عضویت", value: fmtDate(user.created_at) },
                  { label: "آخرین سفارش", value: fmtDate(user.last_order_at) },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p
                      className="font-medium text-gray-900"
                      dir={item.dir as any}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              {user.recent_orders?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    آخرین سفارشات
                  </p>
                  <div className="space-y-2">
                    {user.recent_orders.map((o: any) => (
                      <div
                        key={o.id}
                        className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl"
                      >
                        <span className="font-mono text-xs text-gray-600">
                          {o.order_number}
                        </span>
                        <span className="text-xs text-gray-500">
                          {fmtPrice(o.total)}
                        </span>
                        <Badge
                          variant={
                            o.status === "delivered" ? "success" : "default"
                          }
                        >
                          {o.status_label}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </PortalModal>
  );
}

// ── فرم ویرایش — فقط برای کاربر موجود، بدون ساخت جدید ──
function UserEditModal({
  user,
  onClose,
  onSuccess,
}: {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<FormData>({
    name: user.name,
    is_admin: user.is_admin,
    is_active: user.is_active,
  });
  const [saving, setSaving] = useState(false);

  const inp =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUsersAPI.update(user.id, form);
      toast.success("کاربر بروزرسانی شد");
      onSuccess();
      onClose();
    } catch (err: any) {
      const errs = err.response?.data?.errors;
      if (errs) {
        Object.values(errs)
          .flat()
          .forEach((e: any) => toast.error(e));
      } else {
        toast.error(err.response?.data?.message || "خطا در ذخیره");
      }
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({
    value,
    onChange,
    label,
    color = "teal",
  }: {
    value: boolean;
    onChange: () => void;
    label: string;
    color?: string;
  }) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={onChange}
        className={`w-10 h-5 rounded-full transition-colors relative ${
          value ? `bg-${color}-500` : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );

  return (
    <PortalModal>
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">ویرایش کاربر</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* موبایل — read-only */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                موبایل
              </label>
              <div
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 font-mono"
                dir="ltr"
              >
                {user.mobile}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                موبایل قابل تغییر نیست
              </p>
            </div>

            {/* نام */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                نام <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="نام کاربر"
                className={inp}
                required
              />
            </div>

            {/* ایمیل */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                ایمیل
              </label>
              <div
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500"
                dir="ltr"
              >
                {user.email || "—"}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                ایمیل قابل تغییر نیست
              </p>
            </div>
            {/* toggle ها */}
            <div className="flex items-center gap-6 pt-1">
              <Toggle
                value={form.is_active}
                onChange={() =>
                  setForm((f) => ({ ...f, is_active: !f.is_active }))
                }
                label="فعال"
                color="teal"
              />
              <Toggle
                value={form.is_admin}
                onChange={() =>
                  setForm((f) => ({ ...f, is_admin: !f.is_admin }))
                }
                label="ادمین"
                color="blue"
              />
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "در حال ذخیره..." : "بروزرسانی"}
            </button>
          </div>
        </form>
      </div>
    </PortalModal>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "admin">(
    "all"
  );
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    stats: { total: 0, active: 0, admins: 0, new_this_month: 0 } as Stats,
  });
  const [detailId, setDetailId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    load();
  }, [meta.current_page, filter]);

  const load = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        page: meta.current_page,
        per_page: 20,
        search: search.trim() || undefined,
      };
      if (filter === "active") params.is_active = 1;
      if (filter === "inactive") params.is_active = 0;
      if (filter === "admin") params.is_admin = 1;

      const res = await adminUsersAPI.getAll(params);
      setUsers(res.data.data);
      setMeta((p) => ({
        ...p,
        current_page: res.data.meta.current_page,
        last_page: res.data.meta.last_page,
        total: res.data.meta.total,
        stats: res.data.meta.stats || p.stats,
      }));
    } catch {
      toast.error("خطا در دریافت کاربران");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;
    try {
      await adminUsersAPI.delete(id);
      toast.success("حذف شد");
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در حذف");
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await adminUsersAPI.toggleActive(id);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا");
    }
  };

  const handleToggleAdmin = async (id: number) => {
    try {
      await adminUsersAPI.toggleAdmin(id);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا");
    }
  };

  const FILTERS = [
    { key: "all", label: "همه", count: meta.stats.total },
    { key: "active", label: "فعال", count: meta.stats.active },
    {
      key: "inactive",
      label: "غیرفعال",
      count: meta.stats.total - meta.stats.active,
    },
    { key: "admin", label: "ادمین‌ها", count: meta.stats.admins },
  ];

  const columns = [
    {
      header: "کاربر",
      render: (row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm flex-shrink-0">
            {row.avatar ? (
              <img
                src={row.avatar}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              row.name?.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-medium text-gray-900 text-sm">{row.name}</p>
              {row.is_admin && (
                <HiShieldCheck
                  className="w-3.5 h-3.5 text-blue-500"
                  title="ادمین"
                />
              )}
            </div>
            <p className="text-xs text-gray-400 font-mono" dir="ltr">
              {row.mobile}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "ایمیل",
      render: (row: User) => (
        <span className="text-xs text-gray-500" dir="ltr">
          {row.email || "—"}
        </span>
      ),
    },
    {
      header: "سفارشات",
      render: (row: User) => (
        <div className="text-center">
          <p className="font-semibold text-gray-900">{row.orders_count}</p>
          <p className="text-xs text-gray-400">{fmtPrice(row.total_spent)}</p>
        </div>
      ),
    },
    {
      header: "عضویت",
      render: (row: User) => (
        <span className="text-xs text-gray-500">{fmtDate(row.created_at)}</span>
      ),
    },
    {
      header: "وضعیت",
      render: (row: User) => (
        <button onClick={() => handleToggleActive(row.id)}>
          <Badge variant={row.is_active ? "success" : "danger"}>
            {row.is_active ? "فعال" : "غیرفعال"}
          </Badge>
        </button>
      ),
    },
    {
      header: "عملیات",
      render: (row: User) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDetailId(row.id)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            title="جزئیات"
          >
            <HiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setEditingUser(row)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="ویرایش"
          >
            <HiPencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggleAdmin(row.id)}
            className={`p-2 rounded-lg transition-colors ${
              row.is_admin
                ? "text-blue-600 hover:bg-blue-50"
                : "text-gray-400 hover:bg-gray-100"
            }`}
            title={row.is_admin ? "حذف دسترسی ادمین" : "دادن دسترسی ادمین"}
          >
            <HiShieldCheck className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="حذف"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header title="مدیریت کاربران" />
      <div className="p-6 space-y-5">
        {/* آمار */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "کل کاربران",
              value: meta.stats.total,
              icon: HiUsers,
              bg: "bg-blue-100",
              ic: "text-blue-600",
            },
            {
              label: "کاربران فعال",
              value: meta.stats.active,
              icon: HiCheckCircle,
              bg: "bg-teal-100",
              ic: "text-teal-600",
            },
            {
              label: "ادمین‌ها",
              value: meta.stats.admins,
              icon: HiShieldCheck,
              bg: "bg-purple-100",
              ic: "text-purple-600",
            },
            {
              label: "این ماه عضو",
              value: meta.stats.new_this_month,
              icon: HiUserAdd,
              bg: "bg-amber-100",
              ic: "text-amber-600",
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
                placeholder="جستجو با نام، موبایل یا ایمیل..."
                className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>
            <Button onClick={load} variant="primary" size="sm">
              جستجو
            </Button>
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
                {f.count > 0 && (
                  <span
                    className={`mr-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                      filter === f.key ? "bg-white/20" : "bg-gray-200"
                    }`}
                  >
                    {f.count.toLocaleString("fa-IR")}
                  </span>
                )}
              </button>
            ))}
          </div>

          <Table columns={columns} data={users} loading={loading} />

          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={(page) =>
              setMeta((p) => ({ ...p, current_page: page }))
            }
          />
        </div>
      </div>

      {detailId !== null && (
        <UserDetailModal userId={detailId} onClose={() => setDetailId(null)} />
      )}

      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={load}
        />
      )}
    </div>
  );
}
