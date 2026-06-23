"use client";

// app/(public)/profile/settings/page.tsx
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import {
  HiUser,
  HiPhone,
  HiMail,
  HiCheckCircle,
  HiExclamationCircle,
  HiCreditCard,
} from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import {
  updateProfileAction,
  sendVerifyOtpAction,
  confirmVerifyOtpAction,
} from "@/app/_actions/auth";
import { OtpInput } from "@/app/_components/auth/OtpInput";

// ─── VerifyField (منطق بدون تغییر، فقط استایل مارونی) ──────────
function VerifyField({
  type,
  onSuccess,
}: {
  type: "email" | "mobile";
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<"input" | "otp">("input");
  const [value, setValue] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);

  const [sendState, sendAction] = useFormState(sendVerifyOtpAction, {
    isSuccess: false,
    error: "",
  });
  const [confirmState, confirmAction] = useFormState(confirmVerifyOtpAction, {
    isSuccess: false,
    error: "",
  });

  useEffect(() => {
    if (sendState.isSuccess) {
      setStep("otp");
      setCountdown(sendState.expiresIn || 300);
      setCode("");
    }
  }, [sendState]);

  useEffect(() => {
    if (confirmState.isSuccess) onSuccess();
  }, [confirmState]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const label = type === "email" ? "ایمیل" : "شماره موبایل";
  const placeholder = type === "email" ? "email@example.com" : "09123456789";

  const inp =
    "w-full px-4 py-3 rounded-xl border border-[#EDEDED] bg-[#F8F8F8] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#A72F3B]/10 focus:border-[#A72F3B] transition text-sm text-[#242424]";

  if (step === "input")
    return (
      <form action={sendAction} className="space-y-3">
        <input type="hidden" name={type} value={value} />
        <input
          type={type === "email" ? "email" : "tel"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          dir={type === "email" ? "ltr" : "rtl"}
          className={inp}
        />
        {sendState.error && (
          <p className="text-[#C30000] text-xs">{sendState.error}</p>
        )}
        <button
          type="submit"
          disabled={!value}
          className="w-full py-2.5 bg-[#A72F3B] hover:bg-[#86262F] text-white text-sm font-medium rounded-xl disabled:bg-[#D6D6D6] transition"
        >
          ارسال کد تایید به {label}
        </button>
      </form>
    );

  return (
    <form action={confirmAction} className="space-y-3">
      <input type="hidden" name={type} value={value} />
      <input type="hidden" name="code" value={code} />
      <p className="text-sm text-[#656565]">
        کد ارسال‌شده به{" "}
        <span className="font-medium" dir="ltr">
          {value}
        </span>{" "}
        را وارد کنید
      </p>
      <OtpInput value={code} onChange={setCode} />
      {confirmState.error && (
        <p className="text-[#C30000] text-xs">{confirmState.error}</p>
      )}
      <div className="text-center text-xs text-[#898989]">
        {countdown > 0 ? (
          <span>ارسال مجدد تا {formatTime(countdown)}</span>
        ) : (
          <button
            type="button"
            onClick={() => {
              setStep("input");
              setCode("");
            }}
            className="text-[#A72F3B] hover:text-[#86262F] flex items-center gap-1 mx-auto"
          >
            ارسال مجدد
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setStep("input");
            setCode("");
          }}
          className="flex-1 py-2.5 border border-[#EDEDED] text-[#656565] text-sm font-medium rounded-xl hover:bg-[#F8F8F8] transition"
        >
          بازگشت
        </button>
        <button
          type="submit"
          disabled={code.length !== 6}
          className="flex-1 py-2.5 bg-[#A72F3B] hover:bg-[#86262F] text-white text-sm font-medium rounded-xl disabled:bg-[#D6D6D6] transition"
        >
          تایید
        </button>
      </div>
    </form>
  );
}

// ─── SettingsPage ─────────────────────────────────────────────
type Tab = "contact" | "account";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();

  const [tab, setTab] = useState<Tab>("contact");

  const [formState, formAction] = useFormState(updateProfileAction, {
    isSuccess: false,
    error: "",
  });

  const [bankCard, setBankCard] = useState(user?.bank_card_number || "");
  const [bankCardOwner, setBankCardOwner] = useState(
    user?.bank_card_owner || "",
  );

  useEffect(() => {
    if (formState.isSuccess) refreshUser();
  }, [formState.isSuccess]);

  useEffect(() => {
    if (user?.bank_card_number) setBankCard(user.bank_card_number);
    if (user?.bank_card_owner) setBankCardOwner(user.bank_card_owner);
  }, [user]);

  const inp =
    "w-full px-4 py-3 rounded-xl border border-[#EDEDED] bg-[#F8F8F8] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#A72F3B]/10 focus:border-[#A72F3B] transition text-sm text-[#242424]";

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      {/* عنوان */}
      <div className="px-6 pt-6">
        <h2 className="text-lg font-bold text-[#242424] text-right">
          اطلاعات حساب کاربری
        </h2>
      </div>

      {/* تب‌ها مطابق فیگما */}
      <div className="px-6 mt-4 border-b border-[#F0F0F0] flex items-center gap-6">
        {[
          { key: "account" as Tab, label: "اطلاعات کاربری" },
          { key: "contact" as Tab, label: "اطلاعات تماس" },
        ].map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative -mb-px py-3 text-sm transition-colors ${
                active
                  ? "text-[#A72F3B] font-semibold"
                  : "text-[#898989] hover:text-[#656565]"
              }`}
            >
              {t.label}
              {active && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#A72F3B] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-6">
        {/* ═══════════ تب: اطلاعات تماس (موبایل + ایمیل) ═══════════ */}
        {tab === "contact" && (
          <div className="space-y-4">
            {/* شماره موبایل */}
            <div className="rounded-2xl border border-[#F0F0F0] p-5">
              <div className="flex items-center gap-2 mb-4">
                <HiPhone className="w-5 h-5 text-[#898989]" />
                <h3 className="font-semibold text-[#242424]">شماره موبایل</h3>
              </div>
              {user?.mobile ? (
                <div className="flex items-center gap-3 bg-[#F8F8F8] rounded-xl px-4 py-3">
                  <span className="text-[#242424] font-mono" dir="ltr">
                    {user.mobile}
                  </span>
                  <span className="mr-auto flex items-center gap-1 text-[#00966D] text-xs">
                    <HiCheckCircle className="w-4 h-4" /> تایید شده
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 bg-[#FBEFD7] border border-[#F4B740]/40 rounded-xl px-4 py-3">
                    <HiExclamationCircle className="w-4 h-4 text-[#A9791C] flex-shrink-0" />
                    <span className="text-[#A9791C] text-sm">
                      شماره موبایل تایید نشده — برای ورود با موبایل اضافه کنید
                    </span>
                  </div>
                  <VerifyField type="mobile" onSuccess={refreshUser} />
                </div>
              )}
            </div>

            {/* ایمیل — اختیاری */}
            <div className="rounded-2xl border border-[#F0F0F0] p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HiMail className="w-5 h-5 text-[#898989]" />
                  <h3 className="font-semibold text-[#242424]">ایمیل</h3>
                </div>
                <span className="text-xs text-[#898989] bg-[#F5F5F5] px-2 py-1 rounded-lg">
                  اختیاری
                </span>
              </div>
              {user?.email ? (
                <div className="flex items-center gap-3 bg-[#F8F8F8] rounded-xl px-4 py-3">
                  <span className="text-[#242424]" dir="ltr">
                    {user.email}
                  </span>
                  <span className="mr-auto flex items-center gap-1 text-[#00966D] text-xs">
                    <HiCheckCircle className="w-4 h-4" /> تایید شده
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-[#898989]">
                    با اضافه کردن ایمیل، می‌توانید با آن نیز وارد شوید
                  </p>
                  <VerifyField type="email" onSuccess={refreshUser} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════ تب: اطلاعات کاربری (نام + کارت بانکی) ═══════════ */}
        {tab === "account" && (
          <div className="rounded-2xl border border-[#F0F0F0] p-5">
            <div className="flex items-center gap-2 mb-6">
              <HiUser className="w-5 h-5 text-[#898989]" />
              <h3 className="font-semibold text-[#242424]">اطلاعات شخصی</h3>
            </div>

            {formState.isSuccess && (
              <div className="flex items-center gap-2 bg-[#E6F4EF] border border-[#00966D]/30 rounded-xl px-4 py-3 mb-4">
                <HiCheckCircle className="w-5 h-5 text-[#00966D] flex-shrink-0" />
                <p className="text-[#00966D] text-sm">
                  اطلاعات با موفقیت ذخیره شد
                </p>
              </div>
            )}

            {formState.error && (
              <div className="bg-[#FBEAEA] border border-[#C30000]/20 rounded-xl px-4 py-3 mb-4">
                <p className="text-[#C30000] text-sm">{formState.error}</p>
              </div>
            )}

            <form action={formAction} className="space-y-5">
              {/* نام */}
              <div>
                <label className="block text-sm font-medium text-[#656565] mb-2">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user?.name || ""}
                  placeholder="نام خود را وارد کنید"
                  className={inp}
                />
              </div>

              {/* کارت بانکی */}
              <div className="pt-2 border-t border-[#F0F0F0]">
                <div className="flex items-center gap-2 mb-4">
                  <HiCreditCard className="w-5 h-5 text-[#898989]" />
                  <h4 className="font-semibold text-[#242424]">
                    اطلاعات بانکی
                  </h4>
                  <span className="text-xs text-[#898989] bg-[#F5F5F5] px-2 py-1 rounded-lg">
                    اختیاری
                  </span>
                </div>
                <p className="text-xs text-[#898989] mb-4">
                  در صورت مرجوعی، مبلغ به این کارت واریز می‌شود
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#656565] mb-2">
                      شماره کارت
                    </label>
                    <input
                      type="text"
                      name="bank_card_number"
                      value={bankCard}
                      onChange={(e) =>
                        setBankCard(
                          e.target.value.replace(/\D/g, "").slice(0, 16),
                        )
                      }
                      placeholder="1234567890123456"
                      dir="ltr"
                      maxLength={16}
                      className={`${inp} font-mono tracking-widest`}
                    />
                    <p className="text-xs text-[#898989] mt-1">
                      {bankCard.length}/16
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#656565] mb-2">
                      نام صاحب کارت
                    </label>
                    <input
                      type="text"
                      name="bank_card_owner"
                      value={bankCardOwner}
                      onChange={(e) => setBankCardOwner(e.target.value)}
                      placeholder="نام و نام خانوادگی"
                      className={inp}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#A72F3B] hover:bg-[#86262F] text-white font-medium rounded-xl transition-colors"
              >
                ثبت اطلاعات
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
