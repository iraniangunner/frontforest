// "use client";

// import { useState, useEffect } from "react";
// import Header from "@/app/_components/admin/Header";
// import Button from "@/app/_components/admin/Button";
// import Table from "@/app/_components/admin/Table";
// import Modal from "@/app/_components/admin/Modal";
// import Input from "@/app/_components/admin/Input";
// import Badge from "@/app/_components/admin/Badge";
// import Pagination from "@/app/_components/admin/Pagination";
// import { componentsAPI, categoriesAPI, tagsAPI } from "../../../lib/api";
// import { HiPlus, HiPencil, HiTrash, HiStar, HiEye, HiDownload } from "react-icons/hi";
// import toast from "react-hot-toast";

// interface ComponentItem {
//   id: number;
//   title: string;
//   slug: string;
//   short_description: string | null;
//   description: string | null;
//   category: { id: number; name: string; parent?: { name: string } };
//   price: number;
//   sale_price: number | null;
//   current_price: number;
//   thumbnail: string | null;
//   preview_url: string | null;
//   demo_url: string | null;
//   is_free: boolean;
//   is_featured: boolean;
//   is_active: boolean;
//   views_count: number;
//   rating: number;
//   tags: { id: number; name: string; color: string }[];
// }

// interface Category {
//   id: number;
//   name: string;
//   parent_id: number | null;
//   parent?: { name: string };
// }

// interface Tag {
//   id: number;
//   name: string;
//   color: string;
// }

// interface FormData {
//   category_id: string;
//   title: string;
//   slug: string;
//   short_description: string;
//   description: string;
//   price: number;
//   sale_price: string;
//   preview_url: string;
//   demo_url: string;
//   tags: number[];
//   is_free: boolean;
//   is_featured: boolean;
//   is_active: boolean;
//   thumbnail: File | null;
//   file: File | null;
// }

// export default function ComponentsPage() {
//   const [components, setComponents] = useState<ComponentItem[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [tags, setTags] = useState<Tag[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingComponent, setEditingComponent] =
//     useState<ComponentItem | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [downloading, setDownloading] = useState(false);
//   const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

//   const [formData, setFormData] = useState<FormData>({
//     category_id: "",
//     title: "",
//     slug: "",
//     short_description: "",
//     description: "",
//     price: 0,
//     sale_price: "",
//     preview_url: "",
//     demo_url: "",
//     tags: [],
//     is_free: false,
//     is_featured: false,
//     is_active: true,
//     thumbnail: null,
//     file: null,
//   });

//   useEffect(() => {
//     loadData();
//   }, [meta.current_page]);

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const [componentsRes, categoriesRes, tagsRes] = await Promise.all([
//         componentsAPI.getAll({ page: meta.current_page, per_page: 10 }),
//         categoriesAPI.getAll({ per_page: 100 }),
//         tagsAPI.adminGetAll({ per_page: 100 }),
//       ]);

//       setComponents(componentsRes.data.data);
//       setMeta(componentsRes.data.meta);
//       setCategories(
//         categoriesRes.data.data.filter((c: Category) => c.parent_id)
//       );
//       setTags(tagsRes.data.data);
//     } catch (error) {
//       toast.error("خطا در دریافت اطلاعات");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openModal = (component: ComponentItem | null = null) => {
//     if (component) {
//       setEditingComponent(component);
//       setFormData({
//         category_id: component.category?.id?.toString() || "",
//         title: component.title || "",
//         slug: component.slug || "",
//         short_description: component.short_description || "",
//         description: component.description || "",
//         price: component.price || 0,
//         sale_price: component.sale_price?.toString() || "",
//         preview_url: component.preview_url || "",
//         demo_url: component.demo_url || "",
//         tags: component.tags?.map((t) => t.id) || [],
//         is_free: component.is_free,
//         is_featured: component.is_featured,
//         is_active: component.is_active,
//         thumbnail: null,
//         file: null,
//       });
//     } else {
//       setEditingComponent(null);
//       setFormData({
//         category_id: "",
//         title: "",
//         slug: "",
//         short_description: "",
//         description: "",
//         price: 0,
//         sale_price: "",
//         preview_url: "",
//         demo_url: "",
//         tags: [],
//         is_free: false,
//         is_featured: false,
//         is_active: true,
//         thumbnail: null,
//         file: null,
//       });
//     }
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setEditingComponent(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       const data = new FormData();

//       data.append("category_id", formData.category_id);
//       data.append("title", formData.title);
//       data.append("slug", formData.slug);
//       data.append("short_description", formData.short_description);
//       data.append("description", formData.description);

//       data.append("price", String(formData.is_free ? 0 : formData.price || 0));
//       data.append("sale_price", formData.sale_price);
//       data.append("preview_url", formData.preview_url);
//       data.append("demo_url", formData.demo_url);

//       formData.tags.forEach((tag) => data.append("tags[]", tag.toString()));

//       data.append("is_free", formData.is_free ? "1" : "0");
//       data.append("is_featured", formData.is_featured ? "1" : "0");
//       data.append("is_active", formData.is_active ? "1" : "0");

//       if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);
//       if (formData.file) data.append("file", formData.file);

//       if (editingComponent) {
//         await componentsAPI.update(editingComponent.id, data);
//         toast.success("کامپوننت بروزرسانی شد");
//       } else {
//         await componentsAPI.create(data);
//         toast.success("کامپوننت ایجاد شد");
//       }

//       closeModal();
//       loadData();
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "خطا در ذخیره");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm("آیا مطمئن هستید؟")) return;

//     try {
//       await componentsAPI.delete(id);
//       toast.success("حذف شد");
//       loadData();
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "خطا در حذف");
//     }
//   };

//   const handleToggle = async (id: number) => {
//     try {
//       await componentsAPI.toggle(id);
//       loadData();
//     } catch (error) {
//       toast.error("خطا در تغییر وضعیت");
//     }
//   };

//   const handleToggleFeatured = async (id: number) => {
//     try {
//       await componentsAPI.toggleFeatured(id);
//       loadData();
//     } catch (error) {
//       toast.error("خطا در تغییر وضعیت");
//     }
//   };

//   const handleTagToggle = (tagId: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       tags: prev.tags.includes(tagId)
//         ? prev.tags.filter((id) => id !== tagId)
//         : [...prev.tags, tagId],
//     }));
//   };

//   const handleDownload = async (slug: string) => {
//     setDownloading(true);
//     try {
//       const response = await componentsAPI.download(slug);
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `${slug}.zip`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//       toast.success("دانلود شروع شد");
//     } catch (error) {
//       toast.error("خطا در دانلود فایل");
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const formatPrice = (price: number) => {
//     if (price === 0) return "رایگان";
//     return price.toLocaleString() + " تومان";
//   };

//   const columns = [
//     {
//       header: "کامپوننت",
//       render: (row: ComponentItem) => (
//         <div className="flex items-center gap-3">
//           {row.thumbnail ? (
//             <img
//               src={row.thumbnail}
//               alt={row.title}
//               className="w-12 h-12 rounded-lg object-cover"
//             />
//           ) : (
//             <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
//               <span className="text-gray-400 text-xs">بدون تصویر</span>
//             </div>
//           )}
//           <div>
//             <p className="font-medium">{row.title}</p>
//             <p className="text-xs text-gray-500">{row.category?.name}</p>
//           </div>
//         </div>
//       ),
//     },
//     {
//       header: "قیمت",
//       render: (row: ComponentItem) => (
//         <div>
//           {row.is_free ? (
//             <Badge variant="success">رایگان</Badge>
//           ) : (
//             <span className="font-medium">
//               {formatPrice(row.current_price)}
//             </span>
//           )}
//         </div>
//       ),
//     },
//     {
//       header: "آمار",
//       render: (row: ComponentItem) => (
//         <div className="flex items-center gap-4 text-sm text-gray-500">
//           <span className="flex items-center gap-1">
//             <HiEye className="w-4 h-4" />
//             {row.views_count}
//           </span>
//           <span className="flex items-center gap-1">
//             <HiStar className="w-4 h-4 text-yellow-500" />
//             {row.rating}
//           </span>
//         </div>
//       ),
//     },
//     {
//       header: "وضعیت",
//       render: (row: ComponentItem) => (
//         <div className="flex flex-col gap-1">
//           <button onClick={() => handleToggle(row.id)}>
//             <Badge variant={row.is_active ? "success" : "danger"} size="sm">
//               {row.is_active ? "فعال" : "غیرفعال"}
//             </Badge>
//           </button>
//           <button onClick={() => handleToggleFeatured(row.id)}>
//             <Badge variant={row.is_featured ? "warning" : "default"} size="sm">
//               {row.is_featured ? "ویژه" : "معمولی"}
//             </Badge>
//           </button>
//         </div>
//       ),
//     },
//     {
//       header: "عملیات",
//       render: (row: ComponentItem) => (
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => openModal(row)}
//             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
//           >
//             <HiPencil className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => handleDelete(row.id)}
//             className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
//           >
//             <HiTrash className="w-4 h-4" />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <Header title="کامپوننت‌ها" />

//       <div className="p-6">
//         <div className="bg-white rounded-xl shadow-sm">
//           <div className="flex items-center justify-between p-4 border-b">
//             <h3 className="font-semibold">لیست کامپوننت‌ها ({meta.total})</h3>
//             <Button onClick={() => openModal()}>
//               <HiPlus className="w-4 h-4 ml-2" />
//               کامپوننت جدید
//             </Button>
//           </div>

//           <Table columns={columns} data={components} loading={loading} />

//           <Pagination
//             currentPage={meta.current_page}
//             lastPage={meta.last_page}
//             onPageChange={(page) => setMeta({ ...meta, current_page: page })}
//           />
//         </div>
//       </div>

//       {/* Modal */}
//       <Modal
//         isOpen={modalOpen}
//         onClose={closeModal}
//         title={editingComponent ? "ویرایش کامپوننت" : "کامپوننت جدید"}
//         size="xl"
//       >
//         <form
//           onSubmit={handleSubmit}
//           className="space-y-4 max-h-[70vh] overflow-y-auto"
//         >
//           <div className="grid grid-cols-2 gap-4">
//             <Input
//               label="عنوان"
//               value={formData.title}
//               onChange={(e) =>
//                 setFormData({ ...formData, title: e.target.value })
//               }
//               required
//             />
//             <Input
//               label="اسلاگ"
//               value={formData.slug}
//               onChange={(e) =>
//                 setFormData({ ...formData, slug: e.target.value })
//               }
//               dir="ltr"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               دسته‌بندی
//             </label>
//             <select
//               value={formData.category_id}
//               onChange={(e) =>
//                 setFormData({ ...formData, category_id: e.target.value })
//               }
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               required
//             >
//               <option value="">انتخاب دسته‌بندی</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.parent?.name} / {cat.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               توضیح کوتاه
//             </label>
//             <textarea
//               value={formData.short_description}
//               onChange={(e) =>
//                 setFormData({ ...formData, short_description: e.target.value })
//               }
//               rows={2}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               توضیحات کامل
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//               rows={4}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <Input
//               label="قیمت (تومان)"
//               type="number"
//               value={formData.price}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   price: parseInt(e.target.value) || 0,
//                 })
//               }
//               min={0}
//             />
//             <Input
//               label="قیمت تخفیف‌خورده"
//               type="number"
//               value={formData.sale_price}
//               onChange={(e) =>
//                 setFormData({ ...formData, sale_price: e.target.value })
//               }
//               min={0}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <Input
//               label="لینک پیش‌نمایش"
//               type="url"
//               value={formData.preview_url}
//               onChange={(e) =>
//                 setFormData({ ...formData, preview_url: e.target.value })
//               }
//               dir="ltr"
//             />
//             <Input
//               label="لینک دمو"
//               type="url"
//               value={formData.demo_url}
//               onChange={(e) =>
//                 setFormData({ ...formData, demo_url: e.target.value })
//               }
//               dir="ltr"
//             />
//           </div>

//           {/* Tags */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               تگ‌ها
//             </label>
//             <div className="flex flex-wrap gap-2">
//               {tags.map((tag) => (
//                 <button
//                   key={tag.id}
//                   type="button"
//                   onClick={() => handleTagToggle(tag.id)}
//                   className={`px-3 py-1 rounded-full text-sm transition-colors ${
//                     formData.tags.includes(tag.id)
//                       ? "text-white"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                   style={
//                     formData.tags.includes(tag.id)
//                       ? { backgroundColor: tag.color }
//                       : {}
//                   }
//                 >
//                   {tag.name}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Files */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 تصویر
//               </label>

//               {/* Show current thumbnail in edit mode */}
//               {editingComponent?.thumbnail && !formData.thumbnail && (
//                 <div className="mb-2">
//                   <img
//                     src={editingComponent.thumbnail}
//                     alt="تصویر فعلی"
//                     className="w-24 h-24 rounded-lg object-cover border border-gray-200"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">تصویر فعلی</p>
//                 </div>
//               )}

//               {/* Show preview of new selected image */}
//               {formData.thumbnail && (
//                 <div className="mb-2">
//                   <img
//                     src={URL.createObjectURL(formData.thumbnail)}
//                     alt="تصویر جدید"
//                     className="w-24 h-24 rounded-lg object-cover border border-blue-200"
//                   />
//                   <p className="text-xs text-blue-500 mt-1">تصویر جدید</p>
//                 </div>
//               )}

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     thumbnail: e.target.files?.[0] || null,
//                   })
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 فایل ZIP
//               </label>

//               {/* Show download button for existing file in edit mode */}
//               {editingComponent && !formData.file && (
//                 <div className="mb-2">
//                   <button
//                     type="button"
//                     onClick={() => handleDownload(editingComponent.slug)}
//                     disabled={downloading}
//                     className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <HiDownload className="w-4 h-4" />
//                     {downloading ? "در حال دانلود..." : "دانلود فایل فعلی"}
//                   </button>
//                 </div>
//               )}

//               {/* Show new file name if selected */}
//               {formData.file && (
//                 <div className="mb-2 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
//                   <p className="text-xs text-blue-600">
//                     فایل جدید: {formData.file.name}
//                   </p>
//                   <button
//                     type="button"
//                     onClick={() => setFormData({ ...formData, file: null })}
//                     className="text-red-500 hover:text-red-700 text-xs"
//                   >
//                     حذف
//                   </button>
//                 </div>
//               )}

//               <input
//                 type="file"
//                 accept=".zip,.rar"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     file: e.target.files?.[0] || null,
//                   })
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//           </div>

//           {/* Checkboxes */}
//           <div className="flex items-center gap-6">
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={formData.is_free}
//                 onChange={(e) =>
//                   setFormData({ ...formData, is_free: e.target.checked })
//                 }
//                 className="w-4 h-4 text-blue-600 rounded"
//               />
//               <span className="text-sm text-gray-700">رایگان</span>
//             </label>
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={formData.is_featured}
//                 onChange={(e) =>
//                   setFormData({ ...formData, is_featured: e.target.checked })
//                 }
//                 className="w-4 h-4 text-blue-600 rounded"
//               />
//               <span className="text-sm text-gray-700">ویژه</span>
//             </label>
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={formData.is_active}
//                 onChange={(e) =>
//                   setFormData({ ...formData, is_active: e.target.checked })
//                 }
//                 className="w-4 h-4 text-blue-600 rounded"
//               />
//               <span className="text-sm text-gray-700">فعال</span>
//             </label>
//           </div>

//           <div className="flex justify-end gap-3 pt-4 border-t">
//             <Button type="button" variant="secondary" onClick={closeModal}>
//               انصراف
//             </Button>
//             <Button type="submit" loading={saving}>
//               {editingComponent ? "بروزرسانی" : "ایجاد"}
//             </Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Modal from "@/app/_components/admin/Modal";
import Input from "@/app/_components/admin/Input";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import { productsAPI, categoriesAPI, tagsAPI } from "../../../lib/api";
import { HiPlus, HiPencil, HiTrash, HiStar, HiEye, HiCube } from "react-icons/hi";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Attribute {
  id?: number;
  key: string;
  value: string;
}

interface ProductItem {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  category: { id: number; name: string; parent?: { name: string } };
  sku: string | null;
  brand: string | null;
  price: number;
  sale_price: number | null;
  current_price: number;
  thumbnail: string | null;
  images: string[] | null;
  stock: number;
  low_stock_threshold: number;
  weight: number | null;
  dimensions: string | null;
  is_featured: boolean;
  is_active: boolean;
  views_count: number;
  rating: number;
  tags: { id: number; name: string; color: string }[];
  attributes: Attribute[];
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
  sku: string;
  brand: string;
  price: number;
  sale_price: string;
  weight: string;
  dimensions: string;
  stock: number;
  low_stock_threshold: number;
  tags: number[];
  attributes: Attribute[];
  is_featured: boolean;
  is_active: boolean;
  thumbnail: File | null;
  existingImages: string[];  // عکس‌های فعلی سرور
  images: File[];            // عکس‌های جدید
}

// ─────────────────────────────────────────────
// StockBadge
// ─────────────────────────────────────────────
function StockBadge({ stock, threshold }: { stock: number; threshold: number }) {
  if (stock === 0)
    return <Badge variant="danger" size="sm">ناموجود</Badge>;
  if (stock <= threshold)
    return <Badge variant="warning" size="sm">{stock} عدد (کم)</Badge>;
  return <Badge variant="success" size="sm">{stock} عدد</Badge>;
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function ProductsPage() {
  const [products, setProducts]             = useState<ProductItem[]>([]);
  const [categories, setCategories]         = useState<Category[]>([]);
  const [tags, setTags]                     = useState<Tag[]>([]);
  const [loading, setLoading]               = useState(true);
  const [modalOpen, setModalOpen]           = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [saving, setSaving]                 = useState(false);
  const [meta, setMeta]                     = useState({ current_page: 1, last_page: 1, total: 0 });

  const defaultForm: FormData = {
    category_id:         "",
    title:               "",
    slug:                "",
    short_description:   "",
    description:         "",
    sku:                 "",
    brand:               "",
    price:               0,
    sale_price:          "",
    weight:              "",
    dimensions:          "",
    stock:               0,
    low_stock_threshold: 5,
    tags:                [],
    attributes:          [],
    is_featured:         false,
    is_active:           true,
    thumbnail:           null,
    existingImages:      [],
    images:              [],
  };

  const [formData, setFormData] = useState<FormData>(defaultForm);

  useEffect(() => { loadData(); }, [meta.current_page]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, tagsRes] = await Promise.all([
        productsAPI.getAll({ page: meta.current_page, per_page: 10 }),
        categoriesAPI.getAll({ per_page: 100 }),
        tagsAPI.adminGetAll({ per_page: 100 }),
      ]);
      setProducts(productsRes.data.data);
      setMeta(productsRes.data.meta);
      setCategories(categoriesRes.data.data.filter((c: Category) => c.parent_id));
      setTags(tagsRes.data.data);
    } catch {
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product: ProductItem | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        category_id:         product.category?.id?.toString() || "",
        title:               product.title || "",
        slug:                product.slug || "",
        short_description:   product.short_description || "",
        description:         product.description || "",
        sku:                 product.sku || "",
        brand:               product.brand || "",
        price:               product.price || 0,
        sale_price:          product.sale_price?.toString() || "",
        weight:              product.weight?.toString() || "",
        dimensions:          product.dimensions || "",
        stock:               product.stock || 0,
        low_stock_threshold: product.low_stock_threshold || 5,
        tags:                product.tags?.map((t) => t.id) || [],
        attributes:          product.attributes?.map((a) => ({ key: a.key, value: a.value })) || [],
        is_featured:         product.is_featured,
        is_active:           product.is_active,
        thumbnail:           null,
        existingImages:      product.images || [],  // ← عکس‌های فعلی لود می‌شن
        images:              [],
      });
    } else {
      setEditingProduct(null);
      setFormData(defaultForm);
    }
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditingProduct(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();

      data.append("category_id",         formData.category_id);
      data.append("title",               formData.title);
      data.append("slug",                formData.slug);
      data.append("short_description",   formData.short_description);
      data.append("description",         formData.description);
      data.append("sku",                 formData.sku);
      data.append("brand",               formData.brand);
      data.append("price",               String(formData.price || 0));
      data.append("sale_price",          formData.sale_price);
      data.append("weight",              formData.weight);
      data.append("dimensions",          formData.dimensions);
      data.append("stock",               String(formData.stock || 0));
      data.append("low_stock_threshold", String(formData.low_stock_threshold || 5));
      data.append("is_featured",         formData.is_featured ? "1" : "0");
      data.append("is_active",           formData.is_active   ? "1" : "0");

      // تگ‌ها
      formData.tags.forEach((id) => data.append("tags[]", id.toString()));

      // ویژگی‌ها
      formData.attributes.forEach((attr, i) => {
        if (attr.key.trim() && attr.value.trim()) {
          data.append(`attributes[${i}][key]`,   attr.key.trim());
          data.append(`attributes[${i}][value]`, attr.value.trim());
        }
      });

      // تصویر شاخص
      if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);

      // عکس‌های فعلی که باقی مونده (حذف‌نشده)
      formData.existingImages.forEach((img) =>
        data.append("existing_images[]", img)
      );

      // عکس‌های جدید
      formData.images.forEach((img) => data.append("images[]", img));

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, data);
        toast.success("محصول بروزرسانی شد");
      } else {
        await productsAPI.create(data);
        toast.success("محصول ایجاد شد");
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
      await productsAPI.delete(id);
      toast.success("حذف شد");
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در حذف");
    }
  };

  const handleToggle = async (id: number) => {
    try { await productsAPI.toggle(id); loadData(); }
    catch { toast.error("خطا در تغییر وضعیت"); }
  };

  const handleToggleFeatured = async (id: number) => {
    try { await productsAPI.toggleFeatured(id); loadData(); }
    catch { toast.error("خطا در تغییر وضعیت"); }
  };

  const handleTagToggle = (tagId: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  // ── مدیریت ویژگی‌ها ──
  const addAttribute = () =>
    setFormData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { key: "", value: "" }],
    }));

  const updateAttribute = (i: number, field: "key" | "value", val: string) =>
    setFormData((prev) => {
      const updated = [...prev.attributes];
      updated[i] = { ...updated[i], [field]: val };
      return { ...prev, attributes: updated };
    });

  const removeAttribute = (i: number) =>
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, j) => j !== i),
    }));

  // ── حذف عکس فعلی از گالری ──
  const removeExistingImage = (i: number) =>
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, j) => j !== i),
    }));

  // ── حذف عکس جدید از گالری ──
  const removeNewImage = (i: number) =>
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, j) => j !== i),
    }));

  const formatPrice = (price: number) =>
    price === 0 ? "رایگان" : price.toLocaleString() + " تومان";

  // ─────────────────────────────────────────────
  // ستون‌های جدول
  // ─────────────────────────────────────────────
  const columns = [
    {
      header: "محصول",
      render: (row: ProductItem) => (
        <div className="flex items-center gap-3">
          {row.thumbnail ? (
            <img src={row.thumbnail} alt={row.title}
              className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <HiCube className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <div>
            <p className="font-medium">{row.title}</p>
            <p className="text-xs text-gray-500">{row.category?.name}</p>
            {row.sku && <p className="text-xs text-gray-400 font-mono">SKU: {row.sku}</p>}
          </div>
        </div>
      ),
    },
    {
      header: "قیمت",
      render: (row: ProductItem) => (
        <div>
          <span className="font-medium">{formatPrice(row.current_price)}</span>
          {row.sale_price && (
            <p className="text-xs text-gray-400 line-through">{formatPrice(row.price)}</p>
          )}
        </div>
      ),
    },
    {
      header: "موجودی",
      render: (row: ProductItem) => (
        <StockBadge stock={row.stock} threshold={row.low_stock_threshold} />
      ),
    },
    {
      header: "آمار",
      render: (row: ProductItem) => (
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <HiEye className="w-4 h-4" />{row.views_count}
          </span>
          <span className="flex items-center gap-1">
            <HiStar className="w-4 h-4 text-yellow-500" />{row.rating}
          </span>
        </div>
      ),
    },
    {
      header: "وضعیت",
      render: (row: ProductItem) => (
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
      render: (row: ProductItem) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openModal(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
            <HiPencil className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div>
      <Header title="محصولات" />

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">لیست محصولات ({meta.total})</h3>
            <Button onClick={() => openModal()}>
              <HiPlus className="w-4 h-4 ml-2" />
              محصول جدید
            </Button>
          </div>

          <Table columns={columns} data={products} loading={loading} />

          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={(page) => setMeta({ ...meta, current_page: page })}
          />
        </div>
      </div>

      {/* ─────────────── Modal ─────────────── */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingProduct ? "ویرایش محصول" : "محصول جدید"}
        size="xl"
      >
        <form onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto px-1">

          {/* عنوان + اسلاگ */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="عنوان محصول" value={formData.title} required
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <Input label="اسلاگ" value={formData.slug} dir="ltr" required
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
          </div>

          {/* دسته‌بندی + برند */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
              <select value={formData.category_id} required
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="">انتخاب دسته‌بندی</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.parent?.name} / {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <Input label="برند" value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
          </div>

          {/* SKU */}
          <Input label="کد محصول (SKU)" value={formData.sku} dir="ltr"
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />

          {/* توضیح کوتاه */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">توضیح کوتاه</label>
            <textarea value={formData.short_description} rows={2}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>

          {/* توضیحات کامل */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات کامل</label>
            <textarea value={formData.description} rows={4}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>

          {/* قیمت */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="قیمت (تومان)" type="number" min={0} value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} />
            <Input label="قیمت تخفیف‌خورده" type="number" min={0} value={formData.sale_price}
              onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })} />
          </div>

          {/* انبار */}
          <div className="grid grid-cols-3 gap-4">
            <Input label="موجودی انبار" type="number" min={0} required value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} />
            <Input label="آستانه هشدار" type="number" min={0} value={formData.low_stock_threshold}
              onChange={(e) => setFormData({ ...formData, low_stock_threshold: parseInt(e.target.value) || 5 })} />
            <Input label="وزن (گرم)" type="number" min={0} dir="ltr" value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
          </div>

          {/* ابعاد */}
          <Input label="ابعاد" value={formData.dimensions} dir="ltr" placeholder="مثال: 10x5x3"
            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })} />

          {/* ویژگی‌های محصول */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">ویژگی‌های محصول</label>
              <button type="button" onClick={addAttribute}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                + افزودن ویژگی
              </button>
            </div>
            {formData.attributes.length === 0 ? (
              <div onClick={addAttribute}
                className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-sm text-gray-400 cursor-pointer hover:border-blue-200 hover:text-blue-500 transition">
                کلیک کنید تا ویژگی اضافه کنید (مثلاً: رنگ، جنس، ضمانت)
              </div>
            ) : (
              <div className="space-y-2">
                {formData.attributes.map((attr, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input placeholder="نام ویژگی (مثلاً: رنگ)" value={attr.key}
                      onChange={(e) => updateAttribute(i, "key", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    <input placeholder="مقدار (مثلاً: مشکی)" value={attr.value}
                      onChange={(e) => updateAttribute(i, "value", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    <button type="button" onClick={() => removeAttribute(i)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* تگ‌ها */}
          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تگ‌ها</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button key={tag.id} type="button" onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      formData.tags.includes(tag.id)
                        ? "text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    style={formData.tags.includes(tag.id) ? { backgroundColor: tag.color } : {}}>
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* تصویر شاخص */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تصویر شاخص</label>
            {editingProduct?.thumbnail && !formData.thumbnail && (
              <div className="mb-2">
                <img src={editingProduct.thumbnail} alt="تصویر فعلی"
                  className="w-24 h-24 rounded-lg object-cover border border-gray-200" />
                <p className="text-xs text-gray-500 mt-1">تصویر فعلی</p>
              </div>
            )}
            {formData.thumbnail && (
              <div className="mb-2">
                <img src={URL.createObjectURL(formData.thumbnail)} alt="تصویر جدید"
                  className="w-24 h-24 rounded-lg object-cover border border-blue-200" />
                <p className="text-xs text-blue-500 mt-1">تصویر جدید</p>
              </div>
            )}
            <input type="file" accept="image/*"
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>

          {/* گالری تصاویر */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">گالری تصاویر</label>

            {/* عکس‌های فعلی سرور */}
            {formData.existingImages.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">تصاویر فعلی — برای حذف روی × کلیک کنید:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.existingImages.map((img, i) => (
                    <div key={i} className="relative">
                      <img src={img} alt=""
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                      <button type="button" onClick={() => removeExistingImage(i)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* عکس‌های جدید */}
            {formData.images.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-blue-500 mb-1">تصاویر جدید:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative">
                      <img src={URL.createObjectURL(img)} alt=""
                        className="w-16 h-16 rounded-lg object-cover border border-blue-200" />
                      <button type="button" onClick={() => removeNewImage(i)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <input type="file" accept="image/*" multiple
              onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files || []) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>

          {/* چک‌باکس‌ها */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">ویژه</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">فعال</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={closeModal}>انصراف</Button>
            <Button type="submit" loading={saving}>
              {editingProduct ? "بروزرسانی" : "ایجاد"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
