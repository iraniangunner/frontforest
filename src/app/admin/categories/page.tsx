"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Modal from "@/app/_components/admin/Modal";
import Input from "@/app/_components/admin/Input";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import { categoriesAPI } from "@/lib/api";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiSearch,
  HiUpload,
  HiX,
} from "react-icons/hi";
import toast from "react-hot-toast";

interface Category {
  id: number;
  name: string;
  name_en: string | null;
  slug: string;
  icon: string | null;
  icon_image: string | null;
  color: string;
  description: string | null;
  parent_id: number | null;
  is_active: boolean;
  is_featured: boolean;
  products_count: number;
  parent?: { id: number; name: string };
}

interface FormData {
  name: string;
  name_en: string;
  slug: string;
  icon: string;
  color: string;
  parent_id: string;
  description: string;
  is_active: boolean;
  is_featured: boolean;
}

const empty: FormData = {
  name: "",
  name_en: "",
  slug: "",
  icon: "",
  color: "#3B82F6",
  parent_id: "",
  description: "",
  is_active: true,
  is_featured: false,
};

const sel =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [form, setForm] = useState<FormData>(empty);

  // ── icon states ──
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [removeIconFlag, setRemoveIconFlag] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    load();
  }, [meta.current_page]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await categoriesAPI.getAll({
        page: meta.current_page,
        per_page: 20,
        search: search.trim() || undefined,
      });
      setCategories(res.data.data);
      setMeta(res.data.meta);
      setParentCategories(res.data.data.filter((c: Category) => !c.parent_id));
    } catch {
      toast.error("خطا در دریافت دسته‌بندی‌ها");
    } finally {
      setLoading(false);
    }
  };

  // ── reset icon states ──
  const resetIconStates = () => {
    setIconFile(null);
    setIconPreview(null);
    setRemoveIconFlag(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openModal = (cat: Category | null = null) => {
    resetIconStates();
    if (cat) {
      setEditing(cat);
      setForm({
        name: cat.name || "",
        name_en: cat.name_en || "",
        slug: cat.slug || "",
        icon: cat.icon || "",
        color: cat.color || "#3B82F6",
        parent_id: cat.parent_id?.toString() || "",
        description: cat.description || "",
        is_active: cat.is_active,
        is_featured: cat.is_featured,
      });
      // نمایش آیکون فعلی
      setIconPreview(cat.icon_image || null);
    } else {
      setEditing(null);
      setForm(empty);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    resetIconStates();
  };

  // ── انتخاب فایل آیکون ──
  const handleIconFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 512 * 1024) {
      toast.error("حجم فایل نباید بیشتر از ۵۱۲KB باشد");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
    setRemoveIconFlag(false); // آپلود جدید → دیگه remove نمیخواد
  };

  // ── حذف آیکون ──
  const handleRemoveIcon = () => {
    setIconFile(null);
    setIconPreview(null);
    setRemoveIconFlag(true); // به بک‌اند بگو حذف کن
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── auto-slug از نام انگلیسی ──
  const handleNameEn = (val: string) =>
    setForm((f) => ({
      ...f,
      name_en: val,
      slug:
        f.slug ||
        val
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();

      // فیلدهای متنی
      Object.entries(form).forEach(([k, v]) => {
        if (k === "is_active" || k === "is_featured")
          data.append(k, v ? "1" : "0");
        else data.append(k, String(v ?? ""));
      });

      // آیکون
      if (iconFile) {
        // آپلود جدید
        data.append("icon_image", iconFile);
      } else if (removeIconFlag) {
        // حذف آیکون قبلی
        data.append("remove_icon_image", "1");
      }

      if (editing) {
        data.append("_method", "PUT");
        await categoriesAPI.update(editing.id, data);
        toast.success("بروزرسانی شد");
      } else {
        await categoriesAPI.create(data);
        toast.success("دسته‌بندی ایجاد شد");
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
      await categoriesAPI.delete(id);
      toast.success("حذف شد");
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در حذف");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await categoriesAPI.toggle(id);
      load();
    } catch {
      toast.error("خطا در تغییر وضعیت");
    }
  };

  // ── نمایش آیکون در جدول ──
  const CatIcon = ({ row }: { row: Category }) => {
    if (row.icon_image) {
      return (
        <div className="w-9 h-9 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
          <img
            src={row.icon_image}
            alt=""
            className="w-full h-full object-contain p-1"
          />
        </div>
      );
    }
    return (
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
        style={{ backgroundColor: row.color || "#6B7280" }}
      >
        {row.icon || row.name?.charAt(0)}
      </div>
    );
  };

  const columns = [
    {
      header: "نام",
      render: (row: Category) => (
        <div className="flex items-center gap-3">
          <CatIcon row={row} />
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            {row.name_en && (
              <p className="text-xs text-gray-400">{row.name_en}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "نوع",
      render: (row: Category) => (
        <Badge variant={row.parent_id ? "default" : "primary"}>
          {row.parent_id ? "زیرمجموعه" : "اصلی"}
        </Badge>
      ),
    },
    {
      header: "والد",
      render: (row: Category) => (
        <span className="text-sm text-gray-600">{row.parent?.name || "—"}</span>
      ),
    },
    {
      header: "محصولات",
      render: (row: Category) => (
        <span className="text-sm font-medium text-gray-700">
          {(row.products_count || 0).toLocaleString("fa-IR")}
        </span>
      ),
    },
    {
      header: "وضعیت",
      render: (row: Category) => (
        <button onClick={() => handleToggle(row.id)}>
          <Badge variant={row.is_active ? "success" : "danger"}>
            {row.is_active ? "فعال" : "غیرفعال"}
          </Badge>
        </button>
      ),
    },
    {
      header: "عملیات",
      render: (row: Category) => (
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

  // ── نمایش preview آیکون در فرم ──
  // سه حالت:
  // ۱. فایل جدید انتخاب شده → iconPreview (blob URL)
  // ۲. آیکون قبلی موجود و حذف نشده → editing.icon_image
  // ۳. حذف شده یا وجود نداشته → فقط emoji یا placeholder
  const currentIconPreview = iconPreview; // هر دو حالت ۱ و ۲ در iconPreview هستن

  return (
    <div>
      <Header title="دسته‌بندی‌ها" />
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-wrap gap-3">
            <div>
              <h3 className="font-semibold text-gray-900">لیست دسته‌بندی‌ها</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {(meta.total || 0).toLocaleString("fa-IR")} دسته‌بندی
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
                  className="pr-9 pl-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-48"
                />
              </div>
              <Button onClick={() => openModal()}>
                <HiPlus className="w-4 h-4 ml-1" /> دسته‌بندی جدید
              </Button>
            </div>
          </div>

          <Table columns={columns} data={categories} loading={loading} />

          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={(page) =>
              setMeta((m) => ({ ...m, current_page: page }))
            }
          />
        </div>
      </div>

      {/* ── Modal ── */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="نام فارسی"
              value={form.name}
              required
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              label="نام انگلیسی"
              value={form.name_en}
              dir="ltr"
              onChange={(e) => handleNameEn(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="اسلاگ (URL)"
              value={form.slug}
              dir="ltr"
              required
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رنگ
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, color: e.target.value }))
                  }
                  className="w-10 h-10 rounded-lg cursor-pointer border border-gray-300"
                />
                <span className="text-sm text-gray-500 font-mono">
                  {form.color}
                </span>
              </div>
            </div>
          </div>

          {/* ── آیکون ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              آیکون دسته‌بندی
            </label>
            <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              {/* preview */}
              <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-white overflow-hidden flex-shrink-0">
                {currentIconPreview ? (
                  <img
                    src={currentIconPreview}
                    alt="آیکون"
                    className="w-full h-full object-contain p-1.5"
                  />
                ) : form.icon ? (
                  <span className="text-3xl">{form.icon}</span>
                ) : (
                  <span className="text-2xl text-gray-200">📦</span>
                )}
              </div>

              <div className="flex-1 space-y-2.5">
                {/* آپلود فایل */}
                <label className="inline-flex items-center gap-2 cursor-pointer px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 bg-white transition-colors">
                  <HiUpload className="w-4 h-4" />
                  آپلود تصویر
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpg,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleIconFile}
                    className="hidden"
                  />
                </label>

                <p className="text-xs text-gray-400">
                  PNG، JPG، WebP یا SVG — حداکثر ۵۱۲KB
                </p>

                {/* emoji */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">یا emoji:</span>
                  <input
                    value={form.icon}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, icon: e.target.value }))
                    }
                    placeholder="🏠"
                    className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-center bg-white"
                  />
                </div>

                {/* دکمه حذف — فقط وقتی آیکونی هست */}
                {currentIconPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveIcon}
                    className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    <HiX className="w-3 h-3" />
                    حذف تصویر آیکون
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              دسته‌بندی والد
            </label>
            <select
              value={form.parent_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, parent_id: e.target.value }))
              }
              className={sel}
            >
              <option value="">بدون والد (دسته‌بندی اصلی)</option>
              {parentCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              توضیحات
            </label>
            <textarea
              value={form.description}
              rows={3}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className={sel}
            />
          </div>

          <div className="flex items-center gap-4">
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_featured: e.target.checked }))
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">ویژه</span>
            </label>
          </div>

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
