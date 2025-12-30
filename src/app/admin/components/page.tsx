"use client";

import { useState, useEffect } from "react";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Modal from "@/app/_components/admin/Modal";
import Input from "@/app/_components/admin/Input";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import { componentsAPI, categoriesAPI, tagsAPI } from "../../../lib/api";
import { HiPlus, HiPencil, HiTrash, HiStar, HiEye } from "react-icons/hi";
import toast from "react-hot-toast";

interface ComponentItem {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  category: { id: number; name: string; parent?: { name: string } };
  price: number;
  sale_price: number | null;
  current_price: number;
  thumbnail: string | null;
  preview_url: string | null;
  demo_url: string | null;
  is_free: boolean;
  is_featured: boolean;
  is_active: boolean;
  views_count: number;
  rating: number;
  tags: { id: number; name: string; color: string }[];
}

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  parent?: { name: string };
}

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface FormData {
  category_id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  price: number;
  sale_price: string;
  preview_url: string;
  demo_url: string;
  tags: number[];
  is_free: boolean;
  is_featured: boolean;
  is_active: boolean;
  thumbnail: File | null;
  file: File | null;
}

export default function ComponentsPage() {
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<ComponentItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  const [formData, setFormData] = useState<FormData>({
    category_id: "",
    title: "",
    slug: "",
    short_description: "",
    description: "",
    price: 0,
    sale_price: "",
    preview_url: "",
    demo_url: "",
    tags: [],
    is_free: false,
    is_featured: false,
    is_active: true,
    thumbnail: null,
    file: null,
  });

  useEffect(() => {
    loadData();
  }, [meta.current_page]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [componentsRes, categoriesRes, tagsRes] = await Promise.all([
        componentsAPI.getAll({ page: meta.current_page, per_page: 10 }),
        categoriesAPI.getAll({ per_page: 100 }),
        tagsAPI.adminGetAll({ per_page: 100 }),
      ]);

      setComponents(componentsRes.data.data);
      setMeta(componentsRes.data.meta);
      setCategories(
        categoriesRes.data.data.filter((c: Category) => c.parent_id)
      );
      setTags(tagsRes.data.data);
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (component: ComponentItem | null = null) => {
    if (component) {
      setEditingComponent(component);
      setFormData({
        category_id: component.category?.id?.toString() || "",
        title: component.title || "",
        slug: component.slug || "",
        short_description: component.short_description || "",
        description: component.description || "",
        price: component.price || 0,
        sale_price: component.sale_price?.toString() || "",
        preview_url: component.preview_url || "",
        demo_url: component.demo_url || "",
        tags: component.tags?.map((t) => t.id) || [],
        is_free: component.is_free,
        is_featured: component.is_featured,
        is_active: component.is_active,
        thumbnail: null,
        file: null,
      });
    } else {
      setEditingComponent(null);
      setFormData({
        category_id: "",
        title: "",
        slug: "",
        short_description: "",
        description: "",
        price: 0,
        sale_price: "",
        preview_url: "",
        demo_url: "",
        tags: [],
        is_free: false,
        is_featured: false,
        is_active: true,
        thumbnail: null,
        file: null,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingComponent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      data.append("category_id", formData.category_id);
      data.append("title", formData.title);
      data.append("slug", formData.slug);
      data.append("short_description", formData.short_description);
      data.append("description", formData.description);
      data.append("price", formData.price.toString());
      if (formData.sale_price) data.append("sale_price", formData.sale_price);
      if (formData.preview_url) data.append("preview_url", formData.preview_url);
      if (formData.demo_url) data.append("demo_url", formData.demo_url);
      formData.tags.forEach((tag) => data.append("tags[]", tag.toString()));
      data.append("is_free", formData.is_free ? "1" : "0");
      data.append("is_featured", formData.is_featured ? "1" : "0");
      data.append("is_active", formData.is_active ? "1" : "0");
      if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);
      if (formData.file) data.append("file", formData.file);

      if (editingComponent) {
        await componentsAPI.update(editingComponent.id, data);
        toast.success("کامپوننت بروزرسانی شد");
      } else {
        await componentsAPI.create(data);
        toast.success("کامپوننت ایجاد شد");
      }
      closeModal();
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;

    try {
      await componentsAPI.delete(id);
      toast.success("حذف شد");
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در حذف");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await componentsAPI.toggle(id);
      loadData();
    } catch (error) {
      toast.error("خطا در تغییر وضعیت");
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      await componentsAPI.toggleFeatured(id);
      loadData();
    } catch (error) {
      toast.error("خطا در تغییر وضعیت");
    }
  };

  const handleTagToggle = (tagId: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "رایگان";
    return price.toLocaleString() + " تومان";
  };

  const columns = [
    {
      header: "کامپوننت",
      render: (row: ComponentItem) => (
        <div className="flex items-center gap-3">
          {row.thumbnail ? (
            <img
              src={row.thumbnail}
              alt={row.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-xs">بدون تصویر</span>
            </div>
          )}
          <div>
            <p className="font-medium">{row.title}</p>
            <p className="text-xs text-gray-500">{row.category?.name}</p>
          </div>
        </div>
      ),
    },
    {
      header: "قیمت",
      render: (row: ComponentItem) => (
        <div>
          {row.is_free ? (
            <Badge variant="success">رایگان</Badge>
          ) : (
            <span className="font-medium">{formatPrice(row.current_price)}</span>
          )}
        </div>
      ),
    },
    {
      header: "آمار",
      render: (row: ComponentItem) => (
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <HiEye className="w-4 h-4" />
            {row.views_count}
          </span>
          <span className="flex items-center gap-1">
            <HiStar className="w-4 h-4 text-yellow-500" />
            {row.rating}
          </span>
        </div>
      ),
    },
    {
      header: "وضعیت",
      render: (row: ComponentItem) => (
        <div className="flex flex-col gap-1">
          <button onClick={() => handleToggle(row.id)}>
            <Badge variant={row.is_active ? "success" : "danger"} size="sm">
              {row.is_active ? "فعال" : "غیرفعال"}
            </Badge>
          </button>
          <button onClick={() => handleToggleFeatured(row.id)}>
            <Badge variant={row.is_featured ? "warning" : "default"} size="sm">
              {row.is_featured ? "ویژه" : "معمولی"}
            </Badge>
          </button>
        </div>
      ),
    },
    {
      header: "عملیات",
      render: (row: ComponentItem) => (
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
      <Header title="کامپوننت‌ها" />

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">لیست کامپوننت‌ها ({meta.total})</h3>
            <Button onClick={() => openModal()}>
              <HiPlus className="w-4 h-4 ml-2" />
              کامپوننت جدید
            </Button>
          </div>

          <Table columns={columns} data={components} loading={loading} />

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
        title={editingComponent ? "ویرایش کامپوننت" : "کامپوننت جدید"}
        size="xl"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="عنوان"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <Input
              label="اسلاگ"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              dir="ltr"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              دسته‌بندی
            </label>
            <select
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">انتخاب دسته‌بندی</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.parent?.name} / {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              توضیح کوتاه
            </label>
            <textarea
              value={formData.short_description}
              onChange={(e) =>
                setFormData({ ...formData, short_description: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              توضیحات کامل
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="قیمت (تومان)"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseInt(e.target.value) || 0,
                })
              }
              min={0}
            />
            <Input
              label="قیمت تخفیف‌خورده"
              type="number"
              value={formData.sale_price}
              onChange={(e) =>
                setFormData({ ...formData, sale_price: e.target.value })
              }
              min={0}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="لینک پیش‌نمایش"
              type="url"
              value={formData.preview_url}
              onChange={(e) =>
                setFormData({ ...formData, preview_url: e.target.value })
              }
              dir="ltr"
            />
            <Input
              label="لینک دمو"
              type="url"
              value={formData.demo_url}
              onChange={(e) =>
                setFormData({ ...formData, demo_url: e.target.value })
              }
              dir="ltr"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تگ‌ها
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.tags.includes(tag.id)
                      ? "text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={
                    formData.tags.includes(tag.id)
                      ? { backgroundColor: tag.color }
                      : {}
                  }
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Files */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تصویر
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    thumbnail: e.target.files?.[0] || null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                فایل ZIP
              </label>
              <input
                type="file"
                accept=".zip,.rar"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    file: e.target.files?.[0] || null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_free}
                onChange={(e) =>
                  setFormData({ ...formData, is_free: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">رایگان</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) =>
                  setFormData({ ...formData, is_featured: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">ویژه</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">فعال</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={closeModal}>
              انصراف
            </Button>
            <Button type="submit" loading={saving}>
              {editingComponent ? "بروزرسانی" : "ایجاد"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}