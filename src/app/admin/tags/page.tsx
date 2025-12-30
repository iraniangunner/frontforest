"use client";

import { useState, useEffect } from "react";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Modal from "@/app/_components/admin/Modal";
import Input from "@/app/_components/admin/Input";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import { tagsAPI } from "../../../lib/api";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import toast from "react-hot-toast";

interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  type: "framework" | "styling" | "feature";
  is_active: boolean;
}

interface FormData {
  name: string;
  slug: string;
  color: string;
  type: "framework" | "styling" | "feature";
  is_active: boolean;
}

const typeLabels = {
  framework: "فریم‌ورک",
  styling: "استایل",
  feature: "ویژگی",
};

const typeColors = {
  framework: "primary" as const,
  styling: "warning" as const,
  feature: "success" as const,
};

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
    color: "#6B7280",
    type: "framework",
    is_active: true,
  });

  useEffect(() => {
    loadTags();
  }, [meta.current_page]);

  const loadTags = async () => {
    setLoading(true);
    try {
      const response = await tagsAPI.adminGetAll({
        page: meta.current_page,
        per_page: 20,
      });
      setTags(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      toast.error("خطا در دریافت تگ‌ها");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (tag: Tag | null = null) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({
        name: tag.name || "",
        slug: tag.slug || "",
        color: tag.color || "#6B7280",
        type: tag.type || "framework",
        is_active: tag.is_active,
      });
    } else {
      setEditingTag(null);
      setFormData({
        name: "",
        slug: "",
        color: "#6B7280",
        type: "framework",
        is_active: true,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTag(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingTag) {
        await tagsAPI.update(editingTag.id, formData);
        toast.success("تگ بروزرسانی شد");
      } else {
        await tagsAPI.create(formData);
        toast.success("تگ ایجاد شد");
      }
      closeModal();
      loadTags();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;

    try {
      await tagsAPI.delete(id);
      toast.success("حذف شد");
      loadTags();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در حذف");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await tagsAPI.toggle(id);
      loadTags();
    } catch (error) {
      toast.error("خطا در تغییر وضعیت");
    }
  };

  const columns = [
    {
      header: "نام",
      render: (row: Tag) => (
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: row.color }}
          />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      header: "اسلاگ",
      accessor: "slug" as keyof Tag,
    },
    {
      header: "نوع",
      render: (row: Tag) => (
        <Badge variant={typeColors[row.type]}>{typeLabels[row.type]}</Badge>
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
      <Header title="تگ‌ها" />

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">لیست تگ‌ها</h3>
            <Button onClick={() => openModal()}>
              <HiPlus className="w-4 h-4 ml-2" />
              تگ جدید
            </Button>
          </div>

          <Table columns={columns} data={tags} loading={loading} />

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
        title={editingTag ? "ویرایش تگ" : "تگ جدید"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="نام"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
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
                نوع
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "framework" | "styling" | "feature",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="framework">فریم‌ورک</option>
                <option value="styling">استایل</option>
                <option value="feature">ویژگی</option>
              </select>
            </div>
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
              {editingTag ? "بروزرسانی" : "ایجاد"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}