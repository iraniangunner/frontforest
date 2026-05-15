"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiLocationMarker,
  HiPlus,
  HiPencil,
  HiTrash,
  HiCheck,
  HiArrowLeft,
  HiArrowRight,
} from "react-icons/hi";
import { addressAPI } from "@/lib/api";
import { PROVINCE_NAMES, getCities } from "@/lib/iranProvinces";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Address {
  id: number;
  title: string | null;
  receiver_name: string;
  receiver_mobile: string;
  province: string;
  city: string;
  address: string;
  postal_code: string;
  is_default: boolean;
}

interface AddressForm {
  title: string;
  receiver_name: string;
  receiver_mobile: string;
  province: string;
  city: string;
  address: string;
  postal_code: string;
  is_default: boolean;
}

const emptyForm: AddressForm = {
  title: "",
  receiver_name: "",
  receiver_mobile: "",
  province: "",
  city: "",
  address: "",
  postal_code: "",
  is_default: false,
};

// ─────────────────────────────────────────────
// AddressFormModal
// ─────────────────────────────────────────────
function AddressFormModal({
  open,
  onClose,
  onSave,
  editAddress,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: AddressForm) => Promise<void>;
  editAddress: Address | null;
}) {
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  // شهرهای استان انتخابی
  const cities = form.province ? getCities(form.province) : [];

  useEffect(() => {
    if (editAddress) {
      setForm({
        title: editAddress.title || "",
        receiver_name: editAddress.receiver_name,
        receiver_mobile: editAddress.receiver_mobile,
        province: editAddress.province,
        city: editAddress.city,
        address: editAddress.address,
        postal_code: editAddress.postal_code,
        is_default: editAddress.is_default,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editAddress, open]);

  if (!open) return null;

  const inp =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-900">
            {editAddress ? "ویرایش آدرس" : "آدرس جدید"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* عنوان */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان آدرس
            </label>
            <input
              placeholder="مثلاً: خانه، محل کار"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inp}
            />
          </div>

          {/* نام و موبایل */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام گیرنده <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.receiver_name}
                onChange={(e) =>
                  setForm({ ...form, receiver_name: e.target.value })
                }
                className={inp}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                موبایل گیرنده <span className="text-red-500">*</span>
              </label>
              <input
                required
                dir="ltr"
                value={form.receiver_mobile}
                onChange={(e) =>
                  setForm({ ...form, receiver_mobile: e.target.value })
                }
                maxLength={11}
                placeholder="09xxxxxxxxx"
                className={inp}
              />
            </div>
          </div>

          {/* استان */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              استان <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.province}
              onChange={(e) =>
                setForm({ ...form, province: e.target.value, city: "" })
              }
              className={inp}
            >
              <option value="">انتخاب استان</option>
              {PROVINCE_NAMES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* شهر */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شهر <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              disabled={!form.province}
              className={`${inp} disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed`}
            >
              <option value="">
                {form.province ? "انتخاب شهر" : "ابتدا استان را انتخاب کنید"}
              </option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* آدرس کامل */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              آدرس کامل <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="خیابان، کوچه، پلاک، واحد..."
              className={inp}
            />
          </div>

          {/* کد پستی */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کد پستی <span className="text-red-500">*</span>
            </label>
            <input
              required
              dir="ltr"
              value={form.postal_code}
              onChange={(e) =>
                setForm({ ...form, postal_code: e.target.value })
              }
              maxLength={10}
              placeholder="1234567890"
              className={inp}
            />
          </div>

          {/* پیش‌فرض */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) =>
                setForm({ ...form, is_default: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">آدرس پیش‌فرض</span>
          </label>

          <div className="flex gap-3 pt-2">
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
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {saving ? "در حال ذخیره..." : "ذخیره آدرس"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function CheckoutAddressPage() {
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const res = await addressAPI.getAll();
      const list = res.data.data || [];
      setAddresses(list);
      const def = list.find((a: Address) => a.is_default) || list[0];
      if (def) setSelectedId(def.id);
    } catch {
      toast.error("خطا در دریافت آدرس‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (form: AddressForm) => {
    try {
      if (editingAddress) {
        await addressAPI.update(editingAddress.id, form);
        toast.success("آدرس بروزرسانی شد");
      } else {
        const res = await addressAPI.store(form);
        setSelectedId(res.data.data.id);
        toast.success("آدرس اضافه شد");
      }
      await loadAddresses();
      setModalOpen(false);
      setEditingAddress(null);
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0] as string[];
        toast.error(first[0]);
      } else {
        toast.error(error.response?.data?.message || "خطا در ذخیره آدرس");
      }
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این آدرس اطمینان دارید؟")) return;
    setDeletingId(id);
    try {
      await addressAPI.destroy(id);
      toast.success("آدرس حذف شد");
      await loadAddresses();
      if (selectedId === id) setSelectedId(null);
    } catch {
      toast.error("خطا در حذف آدرس");
    } finally {
      setDeletingId(null);
    }
  };

  const handleContinue = () => {
    if (!selectedId) {
      toast.error("لطفاً یک آدرس انتخاب کنید");
      return;
    }
    sessionStorage.setItem("checkout_address_id", String(selectedId));
    router.push("/checkout/confirm");
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* هدر */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/cart"
            className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition"
          >
            <HiArrowRight className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              انتخاب آدرس تحویل
            </h1>
            <p className="text-sm text-gray-500">مرحله ۱ از ۲</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              ۱
            </div>
            <span className="text-sm font-medium text-blue-600">
              آدرس تحویل
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">
              ۲
            </div>
            <span className="text-sm text-gray-400">تایید و پرداخت</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border-2 border-dashed border-gray-200">
                <HiLocationMarker className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">هنوز آدرسی ثبت نشده است</p>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setModalOpen(true);
                  }}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                >
                  افزودن آدرس
                </button>
              </div>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedId(addr.id)}
                  className={`relative bg-white rounded-2xl p-5 cursor-pointer transition border-2 ${
                    selectedId === addr.id
                      ? "border-blue-500 shadow-md shadow-blue-100"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div
                    className={`absolute top-4 left-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                      selectedId === addr.id
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedId === addr.id && (
                      <HiCheck className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>

                  <div className="pr-1 pl-10">
                    <div className="flex items-center gap-2 mb-2">
                      <HiLocationMarker
                        className={`w-4 h-4 flex-shrink-0 ${selectedId === addr.id ? "text-blue-500" : "text-gray-400"}`}
                      />
                      <span className="font-semibold text-gray-900 text-sm">
                        {addr.title || `${addr.province}، ${addr.city}`}
                      </span>
                      {addr.is_default && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                          پیش‌فرض
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                      {addr.address}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>
                        {addr.province}، {addr.city}
                      </span>
                      <span>{addr.receiver_name}</span>
                      <span dir="ltr">{addr.receiver_mobile}</span>
                      <span>کد پستی: {addr.postal_code}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAddress(addr);
                        setModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <HiPencil className="w-3.5 h-3.5" /> ویرایش
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(addr.id);
                      }}
                      disabled={deletingId === addr.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                    >
                      <HiTrash className="w-3.5 h-3.5" />
                      {deletingId === addr.id ? "در حال حذف..." : "حذف"}
                    </button>
                  </div>
                </div>
              ))
            )}

            {addresses.length > 0 && (
              <button
                onClick={() => {
                  setEditingAddress(null);
                  setModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:border-blue-300 hover:text-blue-600 transition text-sm font-medium"
              >
                <HiPlus className="w-5 h-5" /> افزودن آدرس جدید
              </button>
            )}

            <div className="pt-2">
              <button
                onClick={handleContinue}
                disabled={!selectedId}
                className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition text-base shadow-lg shadow-blue-200"
              >
                ادامه — تایید سفارش
                <HiArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <AddressFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAddress(null);
        }}
        onSave={handleSave}
        editAddress={editingAddress}
      />
    </div>
  );
}
