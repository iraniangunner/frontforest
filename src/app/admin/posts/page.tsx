"use client";

// app/admin/posts/page.tsx
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import { adminPostsAPI } from "@/lib/api";
import {
  HiSearch,
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiX,
  HiPhotograph,
  HiDocumentText,
  HiCheckCircle,
  HiClock,
} from "react-icons/hi";
import toast from "react-hot-toast";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body?: string;
  thumbnail: string | null;
  category: string;
  category_label: string;
  status: "draft" | "published";
  views: number;
  published_at: string | null;
  created_at: string;
  author: { id: number; name: string };
}

const CATEGORIES = [
  { key: "news", label: "اخبار" },
  { key: "article", label: "مقاله" },
  { key: "product", label: "معرفی محصول" },
  { key: "tutorial", label: "آموزش" },
];

const CAT_COLORS: Record<string, string> = {
  news: "bg-blue-100 text-blue-700",
  article: "bg-teal-100 text-teal-700",
  product: "bg-purple-100 text-purple-700",
  tutorial: "bg-amber-100 text-amber-700",
};

const fmtDate = (d: string | null) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ── Portal ──
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
    document.body,
  );
}

// ── Form Modal ──
function PostFormModal({
  editing,
  onClose,
  onSuccess,
}: {
  editing: Post | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    title: editing?.title || "",
    slug: editing?.slug || "",
    category: editing?.category || "article",
    excerpt: editing?.excerpt || "",
    body: editing?.body || "",
    status: (editing?.status || "draft") as "draft" | "published",
    published_at: editing?.published_at
      ? new Date(editing.published_at).toISOString().slice(0, 16)
      : "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    editing?.thumbnail || null,
  );
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const inp =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition bg-white";

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setThumbnail(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.body.trim()) {
      toast.error("محتوا الزامی است");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("category", form.category);
      fd.append("body", form.body);
      fd.append("status", form.status);
      if (form.slug) fd.append("slug", form.slug);
      if (form.excerpt) fd.append("excerpt", form.excerpt);
      if (form.published_at) fd.append("published_at", form.published_at);
      if (thumbnail) fd.append("thumbnail", thumbnail);

      if (editing) {
        await adminPostsAPI.update(editing.id, fd);
        toast.success("مقاله بروزرسانی شد");
      } else {
        await adminPostsAPI.create(fd);
        toast.success("مقاله ایجاد شد");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      const errs = err.response?.data?.errors;
      if (errs)
        Object.values(errs)
          .flat()
          .forEach((e: any) => toast.error(e));
      else toast.error(err.response?.data?.message || "خطا در ذخیره");
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
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900">
              {editing ? "ویرایش مقاله" : "مقاله جدید"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {editing
                ? "اطلاعات مقاله را ویرایش کنید"
                : "مقاله جدید ایجاد کنید"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* تصویر */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                تصویر شاخص
              </label>
              <div className="flex items-start gap-4">
                {preview ? (
                  <div className="relative w-32 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={preview}
                      className="w-full h-full object-cover"
                      alt="preview"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnail(null);
                        setPreview(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <HiX className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-24 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center flex-shrink-0">
                    <HiPhotograph className="w-8 h-8 text-gray-300" />
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300 cursor-pointer bg-white transition mt-1">
                  <HiPhotograph className="w-4 h-4" />
                  {preview ? "تغییر تصویر" : "انتخاب تصویر"}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFile}
                  />
                </label>
              </div>
            </div>

            {/* عنوان */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                عنوان <span className="text-red-500">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="عنوان مقاله"
                className={inp}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  دسته‌بندی <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className={inp}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  وضعیت <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value as any }))
                  }
                  className={inp}
                >
                  <option value="draft">پیش‌نویس</option>
                  <option value="published">منتشر شده</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="my-post-slug"
                className={inp}
                dir="ltr"
              />
              <p className="text-xs text-gray-400 mt-1">
                اگه خالی بذاری از عنوان ساخته میشه
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                خلاصه
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, excerpt: e.target.value }))
                }
                placeholder="خلاصه کوتاه مقاله..."
                rows={2}
                className={inp}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                محتوا <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.body}
                onChange={(e) =>
                  setForm((f) => ({ ...f, body: e.target.value }))
                }
                placeholder="محتوای مقاله را بنویسید..."
                rows={10}
                className={inp}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                تاریخ انتشار
              </label>
              <input
                type="datetime-local"
                value={form.published_at}
                onChange={(e) =>
                  setForm((f) => ({ ...f, published_at: e.target.value }))
                }
                className={inp}
                dir="ltr"
              />
            </div>
          </div>

          <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition"
            >
              {saving ? "در حال ذخیره..." : editing ? "بروزرسانی" : "ایجاد"}
            </button>
          </div>
        </form>
      </div>
    </PortalModal>
  );
}

// ── Page ──
export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPost, setLoadingPost] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [editing, setEditing] = useState<Post | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    load();
  }, [meta.current_page, filter, catFilter]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminPostsAPI.getAll({
        page: meta.current_page,
        per_page: 15,
        search: search.trim() || undefined,
        status: filter !== "all" ? filter : undefined,
        category: catFilter !== "all" ? catFilter : undefined,
      });
      setPosts(res.data.data);
      setMeta((p) => ({
        ...p,
        current_page: res.data.meta.current_page,
        last_page: res.data.meta.last_page,
        total: res.data.meta.total,
      }));
    } catch {
      toast.error("خطا در دریافت مقالات");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (row: Post) => {
    setLoadingPost(true);
    try {
      const res = await adminPostsAPI.getOne(row.id);
      setEditing(res.data.data);
      setFormOpen(true);
    } catch {
      toast.error("خطا در دریافت مقاله");
    } finally {
      setLoadingPost(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا مطمئن هستید؟\nنظرات مرتبط هم حذف میشن.")) return;
    try {
      await adminPostsAPI.delete(id);
      toast.success("مقاله حذف شد");
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await adminPostsAPI.toggle(id);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا");
    }
  };

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  const columns = [
    {
      header: "مقاله",
      render: (row: Post) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {row.thumbnail ? (
              <img
                src={row.thumbnail}
                className="w-full h-full object-cover"
                alt={row.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <HiDocumentText className="w-5 h-5 text-gray-300" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 text-sm truncate max-w-[200px]">
              {row.title}
            </p>
            <p
              className="text-xs text-gray-400 font-mono truncate max-w-[200px]"
              dir="ltr"
            >
              {row.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "دسته‌بندی",
      render: (row: Post) => (
        <span
          className={`px-2.5 py-1 rounded-lg text-xs font-medium ${CAT_COLORS[row.category] || "bg-gray-100 text-gray-600"}`}
        >
          {row.category_label}
        </span>
      ),
    },
    {
      header: "نویسنده",
      render: (row: Post) => (
        <span className="text-sm text-gray-600">{row.author.name}</span>
      ),
    },
    {
      header: "بازدید",
      render: (row: Post) => (
        <span className="flex items-center gap-1 text-sm text-gray-600">
          <HiEye className="w-4 h-4 text-gray-400" />
          {row.views.toLocaleString("fa-IR")}
        </span>
      ),
    },
    {
      header: "تاریخ",
      render: (row: Post) => (
        <span className="text-xs text-gray-500">
          {fmtDate(row.published_at || row.created_at)}
        </span>
      ),
    },
    {
      header: "وضعیت",
      render: (row: Post) => (
        <button
          onClick={() => handleToggle(row.id)}
          title="کلیک برای تغییر وضعیت"
        >
          <Badge variant={row.status === "published" ? "success" : "warning"}>
            {row.status === "published" ? "منتشر" : "پیش‌نویس"}
          </Badge>
        </button>
      ),
    },
    {
      header: "عملیات",
      render: (row: Post) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleEdit(row)}
            disabled={loadingPost}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
            title="ویرایش"
          >
            <HiPencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
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
      <Header title="مدیریت مقالات" />
      <div className="p-6 space-y-5">
        {/* آمار */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "کل مقالات",
              value: meta.total,
              icon: HiDocumentText,
              bg: "bg-blue-100",
              ic: "text-blue-600",
            },
            {
              label: "منتشر شده",
              value: publishedCount,
              icon: HiCheckCircle,
              bg: "bg-green-100",
              ic: "text-green-600",
            },
            {
              label: "پیش‌نویس",
              value: draftCount,
              icon: HiClock,
              bg: "bg-amber-100",
              ic: "text-amber-600",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}
              >
                <s.icon className={`w-6 h-6 ${s.ic}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">
                  {s.value.toLocaleString("fa-IR")}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          {/* جستجو و دکمه جدید */}
          <div className="p-4 border-b border-gray-100 flex gap-3">
            <div className="flex-1 relative">
              <HiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load()}
                placeholder="جستجو در مقالات..."
                className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>
            <Button onClick={load} variant="primary" size="sm">
              جستجو
            </Button>
            <Button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              size="sm"
            >
              <HiPlus className="w-4 h-4 ml-1" /> مقاله جدید
            </Button>
          </div>

          {/* فیلترها */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setMeta((p) => ({ ...p, current_page: 1 }));
              }}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-teal-500 outline-none bg-white cursor-pointer"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="published">منتشر شده</option>
              <option value="draft">پیش‌نویس</option>
            </select>

            <select
              value={catFilter}
              onChange={(e) => {
                setCatFilter(e.target.value);
                setMeta((p) => ({ ...p, current_page: 1 }));
              }}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-teal-500 outline-none bg-white cursor-pointer"
            >
              <option value="all">همه دسته‌ها</option>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>

            {(filter !== "all" || catFilter !== "all") && (
              <button
                onClick={() => {
                  setFilter("all");
                  setCatFilter("all");
                  setMeta((p) => ({ ...p, current_page: 1 }));
                }}
                className="text-xs text-gray-400 hover:text-red-500 transition"
              >
                پاک کردن فیلتر ✕
              </button>
            )}
          </div>

          <Table columns={columns} data={posts} loading={loading} />
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={(page) =>
              setMeta((p) => ({ ...p, current_page: page }))
            }
          />
        </div>
      </div>

      {formOpen && (
        <PostFormModal
          editing={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSuccess={load}
        />
      )}
    </div>
  );
}
