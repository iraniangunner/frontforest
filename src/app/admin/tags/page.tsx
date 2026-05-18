"use client";

import { useState, useEffect } from "react";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Modal from "@/app/_components/admin/Modal";
import Input from "@/app/_components/admin/Input";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import { tagsAPI } from "@/lib/api";
import { HiPlus, HiPencil, HiTrash, HiSearch } from "react-icons/hi";
import toast from "react-hot-toast";

type TagType = "brand" | "feature";

interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  type: TagType;
  sort_order: number;
  is_active: boolean;
}

interface FormData {
  name: string;
  slug: string;
  color: string;
  type: TagType;
  sort_order: string;
  is_active: boolean;
}

const TYPE_LABELS: Record<TagType, string> = {
  brand: "برند",
  feature: "ویژگی",
};

const TYPE_COLORS: Record<TagType, "primary" | "success"> = {
  brand: "primary",
  feature: "success",
};

const empty: FormData = {
  name: "",
  slug: "",
  color: "#6B7280",
  type: "brand",
  sort_order: "0",
  is_active: true,
};

const sel =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm";

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormData>(empty);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  useEffect(() => {
    load();
  }, [meta.current_page]);

  const load = async () => {
    setLoading(true);
    try {
      // ← از adminGetAll استفاده میکنه که params قبول میکنه
      const res = await tagsAPI.adminGetAll({
        page: meta.current_page,
        per_page: 20,
        search: search.trim() || undefined,
        type: typeFilter || undefined,
      });
      setTags(res.data.data || []);
      setMeta(res.data.meta || { current_page: 1, last_page: 1, total: 0 });
    } catch {
      toast.error("خطا در دریافت تگ‌ها");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (tag: Tag | null = null) => {
    if (tag) {
      setEditing(tag);
      setForm({
        name: tag.name || "",
        slug: tag.slug || "",
        color: tag.color || "#6B7280",
        type: tag.type || "brand",
        sort_order: String(tag.sort_order ?? 0),
        is_active: tag.is_active,
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

  const handleName = (val: string) =>
    setForm((f) => ({
      ...f,
      name: val,
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
      const payload = {
        name: form.name,
        slug: form.slug,
        color: form.color,
        type: form.type,
        sort_order: parseInt(form.sort_order) || 0,
        is_active: form.is_active,
      };
      if (editing) {
        await tagsAPI.update(editing.id, payload);
        toast.success("تگ بروزرسانی شد");
      } else {
        await tagsAPI.create(payload);
        toast.success("تگ ایجاد شد");
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
      await tagsAPI.delete(id);
      toast.success("حذف شد");
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در حذف");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await tagsAPI.toggle(id);
      load();
    } catch {
      toast.error("خطا در تغییر وضعیت");
    }
  };

  const columns = [
    {
      header: "تگ",
      render: (row: Tag) => (
        <div className="flex items-center gap-3">
          <span
            className="w-4 h-4 rounded-full flex-shrink-0 ring-2 ring-white shadow-sm"
            style={{ backgroundColor: row.color }}
          />
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-400 font-mono">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "نوع",
      render: (row: Tag) => (
        <Badge variant={TYPE_COLORS[row.type] || "default"}>
          {TYPE_LABELS[row.type] || row.type}
        </Badge>
      ),
    },
    {
      header: "ترتیب",
      render: (row: Tag) => (
        <span className="text-sm text-gray-600">{row.sort_order}</span>
      ),
    },
    {
      header: "وضعیت",
      render: (row: Tag) => (
        <button onClick={() => handleToggle(row.id)}>
          <Badge variant={row.is_active ? "success" : "danger"}>
            {row.is_active ? "فعال" : "غیرفعال"}
          </Badge>
        </button>
      ),
    },
    {
      header: "عملیات",
      render: (row: Tag) => (
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
      <Header title="تگ‌ها" />

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-wrap gap-3">
            <div>
              <h3 className="font-semibold text-gray-900">لیست تگ‌ها</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {meta.total.toLocaleString("fa-IR")} تگ
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
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

              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setMeta((m) => ({ ...m, current_page: 1 }));
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">همه انواع</option>
                <option value="brand">برند</option>
                <option value="feature">ویژگی</option>
              </select>

              <Button onClick={() => openModal()}>
                <HiPlus className="w-4 h-4 ml-1" /> تگ جدید
              </Button>
            </div>
          </div>

          <Table columns={columns} data={tags} loading={loading} />

          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={(page) =>
              setMeta((m) => ({ ...m, current_page: page }))
            }
          />
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? "ویرایش تگ" : "تگ جدید"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="نام"
              value={form.name}
              required
              onChange={(e) => handleName(e.target.value)}
            />
            <Input
              label="اسلاگ"
              value={form.slug}
              dir="ltr"
              required
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
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
                <span className="text-xs text-gray-500 font-mono">
                  {form.color}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نوع
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value as TagType }))
                }
                className={sel}
              >
                <option value="brand">برند</option>
                <option value="feature">ویژگی</option>
              </select>
            </div>

            <Input
              label="ترتیب نمایش"
              value={form.sort_order}
              type="number"
              dir="ltr"
              onChange={(e) =>
                setForm((f) => ({ ...f, sort_order: e.target.value }))
              }
            />
          </div>

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
