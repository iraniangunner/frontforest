"use client";

// app/(public)/checkout/address/page.tsx
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
  HiLogin,
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
// AddressFormModal — بدون نقشه (مثل profile/addresses)
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
// نوار مراحل (سبد خرید → اطلاعات آدرس → پرداخت)
// ─────────────────────────────────────────────
function Stepper() {
  const steps = [
    { label: "سبد خرید", done: true },
    { label: "اطلاعات آدرس", active: true },
    { label: "پرداخت", done: false },
  ];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                s.active
                  ? "bg-[#A72F3B] text-white"
                  : s.done
                    ? "bg-[#F6EAEB] text-[#A72F3B]"
                    : "bg-[#F0F0F0] text-[#AFAFAF]"
              }`}
            >
              {s.done ? <HiCheck className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={`text-xs ${
                s.active ? "text-[#A72F3B] font-medium" : "text-[#898989]"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="w-16 sm:w-24 mb-5 border-t border-dashed border-[#DCACB1]" />
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Page — فقط انتخاب آدرس (بدون خلاصه‌ی قیمت)
// ─────────────────────────────────────────────
export default function CheckoutAddressPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (user) loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const res = await addressAPI.getAll();
      const list: Address[] = res.data.data || [];
      setAddresses(list);
      const def = list.find((a) => a.is_default) || list[0];
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

  // ── loading auth ──
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#EDEDED] border-t-[#A72F3B] rounded-full animate-spin" />
      </div>
    );
  }

  // ── لاگین نکرده ──
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Stepper />
          <div className="bg-white rounded-2xl border border-[#F0F0F0] p-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F6EAEB] rounded-full flex items-center justify-center mx-auto mb-4">
                <HiLogin className="w-8 h-8 text-[#A72F3B]" />
              </div>
              <h2 className="text-lg font-bold text-[#242424] mb-2">
                برای ادامه وارد شوید
              </h2>
              <p className="text-[#898989] text-sm mb-6">
                برای ثبت آدرس و تکمیل سفارش باید وارد حساب کاربری شوید.
              </p>
              <Link
                href="/login?redirect=/checkout/address"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#A72F3B] text-white rounded-xl font-medium hover:bg-[#86262F] transition"
              >
                <HiLogin className="w-5 h-5" /> ورود به حساب کاربری
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── لاگین کرده — فقط آدرس ──
  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Stepper />

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-[#242424]">آدرس ارسال</h1>
          <button
            onClick={() => {
              setEditingAddress(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-[#A72F3B] text-[#A72F3B] rounded-xl text-sm font-medium hover:bg-[#F6EAEB] transition"
          >
            <HiPlus className="w-4 h-4" /> افزودن آدرس جدید
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-[#F0F0F0] animate-pulse"
              >
                <div className="h-4 bg-[#F5F5F5] rounded w-2/3 mb-3" />
                <div className="h-3 bg-[#F5F5F5] rounded w-1/2 mb-2" />
                <div className="h-3 bg-[#F5F5F5] rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-[#F0F0F0]">
            <HiLocationMarker className="w-12 h-12 text-[#DCACB1] mx-auto mb-3" />
            <p className="text-[#898989] mb-4">آدرسی برای شما ثبت نشده</p>
            <button
              onClick={() => {
                setEditingAddress(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#A72F3B] text-[#A72F3B] rounded-xl text-sm font-medium hover:bg-[#F6EAEB] transition"
            >
              <HiPlus className="w-4 h-4" /> افزودن آدرس جدید
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => {
              const selected = selectedId === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => setSelectedId(addr.id)}
                  className={`bg-white rounded-2xl p-5 cursor-pointer transition border-2 ${
                    selected
                      ? "border-[#A72F3B]"
                      : "border-[#F0F0F0] hover:border-[#EDEDED]"
                  }`}
                >
                  {/* نشانی کامل + رادیو + بَج */}
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                        selected
                          ? "bg-[#A72F3B] border-[#A72F3B]"
                          : "border-[#CBCBCB]"
                      }`}
                    >
                      {selected && <HiCheck className="w-3 h-3 text-white" />}
                    </div>
                    <p className="flex-1 font-semibold text-[#242424] text-sm leading-relaxed">
                      {addr.address}
                    </p>
                    {addr.is_default && (
                      <span className="text-xs px-2.5 py-0.5 bg-[#F6EAEB] text-[#A72F3B] rounded-full font-medium whitespace-nowrap flex-shrink-0">
                        پیش‌فرض
                      </span>
                    )}
                  </div>

                  {/* فیلدها — دو ردیف منظم */}
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-[#656565]">
                        <HiLocationMarker className="w-4 h-4 text-[#A72F3B] flex-shrink-0" />
                        {addr.province}، {addr.city}
                      </span>
                      <span className="flex items-center gap-2 text-[#656565]">
                        <HiPhone className="w-4 h-4 text-[#A72F3B] flex-shrink-0" />
                        موبایل: {addr.receiver_mobile}
                      </span>
                    </div>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAddress(addr);
                        setModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-4 py-1.5 border border-[#A72F3B] text-[#A72F3B] rounded-lg text-xs font-medium hover:bg-[#F6EAEB] transition"
                    >
                      <HiPencil className="w-3.5 h-3.5" /> ویرایش
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(addr.id);
                      }}
                      disabled={deletingId === addr.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#C30000] hover:bg-[#FBEAEA] rounded-lg transition disabled:opacity-50 mr-auto"
                    >
                      <HiTrash className="w-3.5 h-3.5" />
                      {deletingId === addr.id ? "در حال حذف..." : "حذف"}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* دکمه‌ی ادامه پایین لیست */}
            <button
              onClick={handleContinue}
              disabled={!selectedId}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 bg-[#A72F3B] text-white rounded-xl font-semibold hover:bg-[#86262F] disabled:bg-[#D6D6D6] disabled:cursor-not-allowed transition"
            >
              ادامه و پرداخت
              <HiArrowLeft className="w-5 h-5" />
            </button>
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
        defaultName={user?.name || ""}
        defaultMobile={user?.mobile || ""}
      />
    </div>
  );
}
