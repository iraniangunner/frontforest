"use client";

// app/(public)/profile/addresses/page.tsx
import { useState, useEffect } from "react";
import {
  HiLocationMarker,
  HiPlus,
  HiPencil,
  HiTrash,
  HiCheck,
  HiPhone,
  HiUser,
  HiMail,
} from "react-icons/hi";
import { addressAPI } from "@/lib/api";
import { PROVINCE_NAMES, getCities } from "@/lib/iranProvinces";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

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
// AddressFormModal — بدون نقشه
// ─────────────────────────────────────────────
function AddressFormModal({
  open,
  onClose,
  onSave,
  editAddress,
  defaultName,
  defaultMobile,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: AddressForm) => Promise<void>;
  editAddress: Address | null;
  defaultName?: string;
  defaultMobile?: string;
}) {
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [saving, setSaving] = useState(false);

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
      setForm({
        ...emptyForm,
        receiver_name: defaultName || "",
        receiver_mobile: defaultMobile || "",
      });
    }
  }, [editAddress, open]);

  if (!open) return null;

  const inp =
    "w-full px-3 py-2.5 border border-[#EDEDED] rounded-xl text-sm focus:ring-4 focus:ring-[#A72F3B]/10 focus:border-[#A72F3B] outline-none transition bg-white text-[#242424]";

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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0] sticky top-0 bg-white z-10">
          <h2 className="font-bold text-[#242424]">
            {editAddress ? "ویرایش آدرس" : "جزئیات آدرس"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#898989] hover:text-[#242424] hover:bg-[#F5F5F5] rounded-lg transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#656565] mb-1">
              عنوان آدرس
            </label>
            <input
              placeholder="مثلاً: خانه، محل کار"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inp}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#656565] mb-1">
                نام و نام خانوادگی <span className="text-[#C30000]">*</span>
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
              <label className="block text-sm font-medium text-[#656565] mb-1">
                شماره تماس <span className="text-[#C30000]">*</span>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#656565] mb-1">
                استان <span className="text-[#C30000]">*</span>
              </label>
              <select
                required
                value={form.province}
                onChange={(e) =>
                  setForm({ ...form, province: e.target.value, city: "" })
                }
                className={inp}
              >
                <option value="">انتخاب کنید</option>
                {PROVINCE_NAMES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#656565] mb-1">
                شهر <span className="text-[#C30000]">*</span>
              </label>
              <select
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                disabled={!form.province}
                className={`${inp} disabled:bg-[#F8F8F8] disabled:text-[#AFAFAF] disabled:cursor-not-allowed`}
              >
                <option value="">
                  {form.province ? "انتخاب کنید" : "ابتدا استان"}
                </option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#656565] mb-1">
              نشانی پستی <span className="text-[#C30000]">*</span>
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

          <div>
            <label className="block text-sm font-medium text-[#656565] mb-1">
              کد پستی <span className="text-[#C30000]">*</span>
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

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) =>
                setForm({ ...form, is_default: e.target.checked })
              }
              className="w-4 h-4 accent-[#A72F3B] rounded"
            />
            <span className="text-sm text-[#656565]">آدرس پیش‌فرض</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#EDEDED] rounded-xl text-sm text-[#656565] hover:bg-[#F8F8F8] transition"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-[#A72F3B] text-white rounded-xl text-sm font-medium hover:bg-[#86262F] disabled:bg-[#D6D6D6] transition"
            >
              {saving ? "در حال ذخیره..." : "تایید آدرس"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page — محتوای داخل layout
// ─────────────────────────────────────────────
export default function ProfileAddressesPage() {
  const { user } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const res = await addressAPI.getAll();
      setAddresses(res.data.data || []);
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
        await addressAPI.store(form);
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
        toast.error(error.response?.data?.message || "خطا در ذخیره");
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
    } catch {
      toast.error("خطا در حذف آدرس");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    setSettingDefaultId(id);
    try {
      await addressAPI.setDefault(id);
      await loadAddresses();
      toast.success("آدرس پیش‌فرض تغییر کرد");
    } catch {
      toast.error("خطا");
    } finally {
      setSettingDefaultId(null);
    }
  };

  return (
    <>
      {/* هدر بخش */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#242424]">آدرس‌های من</h2>
          <p className="text-sm text-[#898989] mt-0.5">
            {addresses.length} آدرس ذخیره شده
          </p>
        </div>
        <button
          onClick={() => {
            setEditingAddress(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 border border-[#A72F3B] text-[#A72F3B] rounded-xl text-sm font-medium hover:bg-[#F6EAEB] transition"
        >
          <HiPlus className="w-4 h-4" /> افزودن آدرس جدید
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-[#F0F0F0] animate-pulse"
            >
              <div className="h-4 bg-[#F5F5F5] rounded w-2/3 mb-4" />
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="h-3 bg-[#F5F5F5] rounded" />
                <div className="h-3 bg-[#F5F5F5] rounded" />
                <div className="h-3 bg-[#F5F5F5] rounded" />
                <div className="h-3 bg-[#F5F5F5] rounded" />
              </div>
              <div className="h-8 bg-[#F5F5F5] rounded-lg w-24" />
            </div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#F0F0F0]">
          <div className="w-16 h-16 bg-[#F6EAEB] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HiLocationMarker className="w-8 h-8 text-[#DCACB1]" />
          </div>
          <h3 className="font-semibold text-[#242424] mb-2">
            هنوز آدرسی ندارید
          </h3>
          <p className="text-sm text-[#898989] mb-6">
            آدرس‌های تحویل خود را ذخیره کنید
          </p>
          <button
            onClick={() => {
              setEditingAddress(null);
              setModalOpen(true);
            }}
            className="px-6 py-2.5 bg-[#A72F3B] text-white rounded-xl text-sm font-medium hover:bg-[#86262F] transition"
          >
            افزودن اولین آدرس
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white rounded-2xl p-5 border border-[#F0F0F0] hover:border-[#EDEDED] transition"
            >
              {/* نشانی کامل */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <p className="font-semibold text-[#242424] text-sm leading-relaxed">
                  {addr.address}
                </p>
                {addr.is_default && (
                  <span className="text-xs px-2.5 py-0.5 bg-[#F6EAEB] text-[#A72F3B] rounded-full font-medium whitespace-nowrap flex-shrink-0">
                    پیش‌فرض
                  </span>
                )}
              </div>

              {/* فیلدها — دو ردیف منظم مثل فیگما (هر ردیف: راست و چپ) */}
              <div className="space-y-2.5 text-sm">
                {/* ردیف ۱: استان/شهر (راست) — موبایل (چپ) */}
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-[#656565]">
                    <HiLocationMarker className="w-4 h-4 text-[#A72F3B] flex-shrink-0" />
                    {addr.province}، {addr.city}
                  </span>
                  <span
                    className="flex items-center gap-2 text-[#656565]"
                   
                  >
                    <HiPhone className="w-4 h-4 text-[#A72F3B] flex-shrink-0" />
                   موبایل: {addr.receiver_mobile}
                  </span>
                </div>
                {/* ردیف ۲: نام گیرنده (راست) — کد پستی (چپ) */}
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-[#656565]">
                    <HiUser className="w-4 h-4 text-[#A72F3B] flex-shrink-0" />
                    {addr.receiver_name}
                  </span>
                  <span className="flex items-center gap-2 text-[#656565]">
                    <HiMail className="w-4 h-4 text-[#A72F3B] flex-shrink-0" />
                    کد پستی: {addr.postal_code}
                  </span>
                </div>
              </div>

              {/* اکشن‌ها */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#F5F5F5]">
                <button
                  onClick={() => {
                    setEditingAddress(addr);
                    setModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 border border-[#A72F3B] text-[#A72F3B] rounded-lg text-xs font-medium hover:bg-[#F6EAEB] transition"
                >
                  <HiPencil className="w-3.5 h-3.5" /> ویرایش
                </button>
                {!addr.is_default && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    disabled={settingDefaultId === addr.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#00966D] hover:bg-[#00966D]/10 rounded-lg transition disabled:opacity-50"
                  >
                    <HiCheck className="w-3.5 h-3.5" />
                    {settingDefaultId === addr.id
                      ? "در حال تنظیم..."
                      : "پیش‌فرض کن"}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  disabled={deletingId === addr.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#C30000] hover:bg-[#FBEAEA] rounded-lg transition disabled:opacity-50 mr-auto"
                >
                  <HiTrash className="w-3.5 h-3.5" />
                  {deletingId === addr.id ? "در حال حذف..." : "حذف"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAddress(null);
        }}
        onSave={handleSave}
        editAddress={editingAddress}
        defaultName={user?.name || ""}
        defaultMobile={user?.mobile || ""}
      />
    </>
  );
}
