"use client";

import { useState, useEffect } from "react";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Modal from "@/app/_components/admin/Modal";
import Input from "@/app/_components/admin/Input";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import { categoriesAPI } from "../../../lib/api";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import toast from "react-hot-toast";

interface Category {
  id: number;
  name: string;
  name_en: string | null;
  slug: string;
  icon: string | null;
  color: string;
  description: string | null;
  parent_id: number | null;
  is_active: boolean;
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
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    name_en: "",
    slug: "",
    icon: "",
    color: "#3B82F6",
    parent_id: "",
    description: "",
    is_active: true,
  });

  useEffect(() => {
    loadCategories();
  }, [meta.current_page]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await categoriesAPI.getAll({
        page: meta.current_page,
        per_page: 20,
      });
      setCategories(response.data.data);
      setMeta(response.data.meta);
      setParentCategories(
        response.data.data.filter((c: Category) => !c.parent_id)
      );
    } catch (error) {
      toast.error("خطا در دریافت دسته‌بندی‌ها");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category: Category | null = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || "",
        name_en: category.name_en || "",
        slug: category.slug || "",
        icon: category.icon || "",
        color: category.color || "#3B82F6",
        parent_id: category.parent_id?.toString() || "",
        description: category.description || "",
        is_active: category.is_active,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        name_en: "",
        slug: "",
        icon: "",
        color: "#3B82F6",
        parent_id: "",
        description: "",
        is_active: true,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
  
    try {
      const data = new FormData();
  
      data.append("name", formData.name);
      data.append("name_en", formData.name_en || "");
      data.append("slug", formData.slug);
      data.append("icon", formData.icon || "");
      data.append("color", formData.color);
      data.append("parent_id", formData.parent_id || "");
      data.append("description", formData.description || "");
      data.append("is_active", formData.is_active ? "1" : "0");
  
      if (editingCategory) {
        data.append("_method", "PUT");
        await categoriesAPI.update(editingCategory.id, data);
        toast.success("دسته‌بندی بروزرسانی شد");
      } else {
        await categoriesAPI.create(data);
        toast.success("دسته‌بندی ایجاد شد");
      }
  
      closeModal();
      loadCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };
  

  const handleDelete = async (id: number) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;

    try {
      await categoriesAPI.delete(id);
      toast.success("حذف شد");
      loadCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در حذف");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await categoriesAPI.toggle(id);
      loadCategories();
    } catch (error) {
      toast.error("خطا در تغییر وضعیت");
    }
  };

  const columns = [
    {
      header: "نام",
      render: (row: Category) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs"
            style={{ backgroundColor: row.color }}
          >
            {row.icon || row.name?.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{row.name}</p>
            {row.name_en && (
              <p className="text-xs text-gray-500">{row.name_en}</p>
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
      render: (row: Category) => row.parent?.name || "-",
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
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <HiPencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header title="دسته‌بندی‌ها" />

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">لیست دسته‌بندی‌ها</h3>
            <Button onClick={() => openModal()}>
              <HiPlus className="w-4 h-4 ml-2" />
              دسته‌بندی جدید
            </Button>
          </div>

          <Table columns={columns} data={categories} loading={loading} />

          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={(page) => setMeta({ ...meta, current_page: page })}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingCategory ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="نام فارسی"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              label="نام انگلیسی"
              value={formData.name_en}
              onChange={(e) =>
                setFormData({ ...formData, name_en: e.target.value })
              }
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="اسلاگ (URL)"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              dir="ltr"
              required
            />
            <Input
              label="آیکون"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
              placeholder="FileEdit"
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رنگ
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                دسته‌بندی والد
              </label>
              <select
                value={formData.parent_id}
                onChange={(e) =>
                  setFormData({ ...formData, parent_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">بدون والد (دسته‌بندی اصلی)</option>
                {parentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              توضیحات
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              فعال
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={closeModal}>
              انصراف
            </Button>
            <Button type="submit" loading={saving}>
              {editingCategory ? "بروزرسانی" : "ایجاد"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}