"use client";

// app/admin/coupons/page.tsx
import { useState, useEffect } from "react";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Modal from "@/app/_components/admin/Modal";
import Input from "@/app/_components/admin/Input";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import { adminCouponsAPI } from "@/lib/api";
import { HiPlus, HiPencil, HiTrash, HiSearch, HiRefresh } from "react-icons/hi";
import toast from "react-hot-toast";

interface Coupon {
  id: number;
  code: string;
  type: "percent" | "fixed";
  value: number;
  min_order: number;
  max_discount: number | null;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  description: string | null;
  created_at: string;
}

interface FormData {
  code: string;
  type: "percent" | "fixed";
  value: string;
  min_order: string;
  max_discount: string;
  max_uses: string;
  is_active: boolean;
  expires_at: string;
  description: string;
}

const empty: FormData = {
  code: "",
  type: "percent",
  value: "",
  min_order: "",
  max_discount: "",
  max_uses: "",
  is_active: true,
  expires_at: "",
  description: "",
};

const fmt = (n: number) => Number(n).toLocaleString("fa-IR");
const sel =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormData>(empty);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  useEffect(() => {
    load();
  }, [meta.current_page]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminCouponsAPI.getAll({
        page: meta.current_page,
        per_page: 15,
        search: search.trim() || undefined,
      });
      setCoupons(res.data.data || []);
      setMeta(res.data.meta || { current_page: 1, last_page: 1, total: 0 });
    } catch {
      toast.error("خطا در دریافت کدهای تخفیف");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (coupon: Coupon | null = null) => {
    if (coupon) {
      setEditing(coupon);
      setForm({
        code: coupon.code,
        type: coupon.type,
        value: String(coupon.value),
        min_order: coupon.min_order ? String(coupon.min_order) : "",
        max_discount: coupon.max_discount ? String(coupon.max_discount) : "",
        max_uses: coupon.max_uses ? String(coupon.max_uses) : "",
        is_active: coupon.is_active,
        expires_at: coupon.expires_at ? coupon.expires_at.split("T")[0] : "",
        description: coupon.description || "",
      });
    } else {
      setEditing(null);
      setForm(empty);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  // auto-generate code
  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const code = Array.from(
      { length: 8 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
    setForm((f) => ({ ...f, code }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        code: form.code.toUpperCase() || undefined,
        type: form.type,
        value: parseInt(form.value),
        min_order: form.min_order ? parseInt(form.min_order) : 0,
        max_discount: form.max_discount ? parseInt(form.max_discount) : null,
        max_uses: form.max_uses ? parseInt(form.max_uses) : null,
        is_active: form.is_active,
        expires_at: form.expires_at || null,
        description: form.description || null,
      };

      if (editing) {
        await adminCouponsAPI.update(editing.id, payload);
        toast.success("بروزرسانی شد");
      } else {
        await adminCouponsAPI.create(payload);
        toast.success("کد تخفیف ایجاد شد");
      }
      closeModal();
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;
    try {
      await adminCouponsAPI.delete(id);
      toast.success("حذف شد");
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در حذف");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await adminCouponsAPI.toggle(id);
      load();
    } catch {
      toast.error("خطا در تغییر وضعیت");
    }
  };

  // کپی کد
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("کپی شد");
  };

  const columns = [
    {
      header: "کد تخفیف",
      render: (row: Coupon) => (
        <button
          onClick={() => copyCode(row.code)}
          className="font-mono font-bold text-gray-900 text-sm bg-gray-100 px-2.5 py-1 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {row.code}
        </button>
      ),
    },
    {
      header: "نوع و مقدار",
      render: (row: Coupon) => (
        <div>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              row.type === "percent"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {row.type === "percent" ? `${row.value}٪` : `${fmt(row.value)} ت`}
          </span>
          {row.max_discount && (
            <p className="text-xs text-gray-400 mt-0.5">
              سقف: {fmt(row.max_discount)} ت
            </p>
          )}
        </div>
      ),
    },
    {
      header: "حداقل خرید",
      render: (row: Coupon) => (
        <span className="text-sm text-gray-600">
          {row.min_order ? fmt(row.min_order) + " ت" : "—"}
        </span>
      ),
    },
    {
      header: "استفاده",
      render: (row: Coupon) => (
        <span className="text-sm text-gray-700 font-medium">
          {row.used_count.toLocaleString("fa-IR")}
          {row.max_uses && (
            <span className="text-gray-400 font-normal">
              {" "}
              / {row.max_uses.toLocaleString("fa-IR")}
            </span>
          )}
        </span>
      ),
    },
    {
      header: "انقضا",
      render: (row: Coupon) => (
        <span className="text-xs text-gray-500">
          {row.expires_at
            ? new Date(row.expires_at).toLocaleDateString("fa-IR")
            : "بدون انقضا"}
        </span>
      ),
    },
    {
      header: "وضعیت",
      render: (row: Coupon) => (
        <button onClick={() => handleToggle(row.id)}>
          <Badge variant={row.is_active ? "success" : "danger"}>
            {row.is_active ? "فعال" : "غیرفعال"}
          </Badge>
        </button>
      ),
    },
    {
      header: "عملیات",
      render: (row: Coupon) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <HiPencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header title="کدهای تخفیف" />
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm">
          {/* toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-wrap gap-3">
            <div>
              <h3 className="font-semibold text-gray-900">لیست کدهای تخفیف</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {meta.total.toLocaleString("fa-IR")} کد
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <HiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && load()}
                  placeholder="جستجو..."
                  className="pr-9 pl-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-40"
                />
              </div>
              <Button onClick={() => openModal()}>
                <HiPlus className="w-4 h-4 ml-1" /> کد جدید
              </Button>
            </div>
          </div>

          <Table columns={columns} data={coupons} loading={loading} />

          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={(page) =>
              setMeta((m) => ({ ...m, current_page: page }))
            }
          />
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? "ویرایش کد تخفیف" : "کد تخفیف جدید"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* کد */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کد تخفیف
            </label>
            <div className="flex gap-2">
              <input
                value={form.code}
                dir="ltr"
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                }
                placeholder="مثلاً SUMMER20 — خالی بذار برای auto"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono uppercase"
              />
              <button
                type="button"
                onClick={generateCode}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-1 transition-colors"
              >
                <HiRefresh className="w-4 h-4" /> تولید
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              خالی بذار تا به صورت خودکار تولید بشه
            </p>
          </div>

          {/* نوع + مقدار */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نوع تخفیف
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    type: e.target.value as "percent" | "fixed",
                  }))
                }
                className={sel}
              >
                <option value="percent">درصدی (٪)</option>
                <option value="fixed">مبلغ ثابت (تومان)</option>
              </select>
            </div>
            <Input
              label={form.type === "percent" ? "مقدار (درصد)" : "مقدار (تومان)"}
              value={form.value}
              type="number"
              dir="ltr"
              required
              onChange={(e) =>
                setForm((f) => ({ ...f, value: e.target.value }))
              }
            />
          </div>

          {/* حداقل خرید + سقف تخفیف */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="حداقل مبلغ سفارش (تومان)"
              value={form.min_order}
              type="number"
              dir="ltr"
              placeholder="اختیاری"
              onChange={(e) =>
                setForm((f) => ({ ...f, min_order: e.target.value }))
              }
            />
            {form.type === "percent" && (
              <Input
                label="سقف تخفیف (تومان)"
                value={form.max_discount}
                type="number"
                dir="ltr"
                placeholder="اختیاری"
                onChange={(e) =>
                  setForm((f) => ({ ...f, max_discount: e.target.value }))
                }
              />
            )}
          </div>

          {/* حداکثر استفاده + تاریخ انقضا */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="حداکثر تعداد استفاده"
              value={form.max_uses}
              type="number"
              dir="ltr"
              placeholder="اختیاری — بی‌نهایت"
              onChange={(e) =>
                setForm((f) => ({ ...f, max_uses: e.target.value }))
              }
            />
            <Input
              label="تاریخ انقضا"
              value={form.expires_at}
              type="date"
              dir="ltr"
              placeholder="اختیاری"
              onChange={(e) =>
                setForm((f) => ({ ...f, expires_at: e.target.value }))
              }
            />
          </div>

          {/* توضیح */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              توضیح (اختیاری)
            </label>
            <textarea
              value={form.description}
              rows={2}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="مثلاً: تخفیف تابستانه برای مشتریان ویژه"
              className={sel}
            />
          </div>

          {/* وضعیت */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_active: e.target.checked }))
              }
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">فعال</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={closeModal}>
              انصراف
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? "بروزرسانی" : "ایجاد"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
