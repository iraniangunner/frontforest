// "use client";

// import { useState, useEffect } from "react";
// import { useFormState } from "react-dom";
// import { useSearchParams } from "next/navigation";
// import {
//   HiCog,
//   HiUser,
//   HiPhone,
//   HiMail,
//   HiCheckCircle,
//   HiExclamationCircle,
// } from "react-icons/hi";
// import { useAuth } from "@/context/AuthContext";
// import {
//   updateProfileAction,
//   sendVerifyOtpAction,
//   confirmVerifyOtpAction,
// } from "@/app/_actions/auth";
// import { OtpInput } from "@/app/_components/auth/OtpInput";

// // ─── VerifyField Component ────────────────────────────────────
// function VerifyField({
//   type,
//   onSuccess,
// }: {
//   type: "email" | "mobile";
//   onSuccess: () => void;
// }) {
//   const [step, setStep] = useState<"input" | "otp">("input");
//   const [value, setValue] = useState("");
//   const [code, setCode] = useState("");
//   const [countdown, setCountdown] = useState(0);

//   const [sendState, sendAction] = useFormState(sendVerifyOtpAction, {
//     isSuccess: false,
//     error: "",
//   });
//   const [confirmState, confirmAction] = useFormState(confirmVerifyOtpAction, {
//     isSuccess: false,
//     error: "",
//   });

//   useEffect(() => {
//     if (sendState.isSuccess) {
//       setStep("otp");
//       setCountdown(sendState.expiresIn || 300);
//       setCode("");
//     }
//   }, [sendState]);

//   useEffect(() => {
//     if (confirmState.isSuccess) {
//       onSuccess();
//     }
//   }, [confirmState]);

//   useEffect(() => {
//     if (countdown > 0) {
//       const t = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(t);
//     }
//   }, [countdown]);

//   const formatTime = (s: number) =>
//     `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

//   const label = type === "email" ? "ایمیل" : "شماره موبایل";
//   const placeholder = type === "email" ? "email@example.com" : "09123456789";

//   if (step === "input") {
//     return (
//       <form action={sendAction} className="space-y-3">
//         <input type="hidden" name={type} value={value} />
//         <input
//           type={type === "email" ? "email" : "tel"}
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//           placeholder={placeholder}
//           dir={type === "email" ? "ltr" : "rtl"}
//           className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition text-sm"
//         />
//         {sendState.error && (
//           <p className="text-red-600 text-xs">{sendState.error}</p>
//         )}
//         <button
//           type="submit"
//           disabled={!value}
//           className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-medium rounded-xl disabled:opacity-40 transition"
//         >
//           ارسال کد تایید به {label}
//         </button>
//       </form>
//     );
//   }

//   return (
//     <form action={confirmAction} className="space-y-3">
//       <input type="hidden" name={type} value={value} />
//       <input type="hidden" name="code" value={code} />

//       <p className="text-sm text-slate-600">
//         کد ارسال شده به{" "}
//         <span className="font-medium" dir="ltr">
//           {value}
//         </span>{" "}
//         را وارد کنید
//       </p>

//       <OtpInput value={code} onChange={setCode} />

//       {confirmState.error && (
//         <p className="text-red-600 text-xs">{confirmState.error}</p>
//       )}

//       <div className="text-center text-xs text-slate-500">
//         {countdown > 0 ? (
//           <span>ارسال مجدد تا {formatTime(countdown)}</span>
//         ) : (
//           <button
//             type="button"
//             onClick={() => {
//               setStep("input");
//               setCode("");
//             }}
//             className="text-teal-600 hover:text-teal-700 flex items-center gap-1 mx-auto"
//           >
//             ارسال مجدد
//           </button>
//         )}
//       </div>

//       <div className="flex gap-2">
//         <button
//           type="button"
//           onClick={() => {
//             setStep("input");
//             setCode("");
//           }}
//           className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition"
//         >
//           بازگشت
//         </button>
//         <button
//           type="submit"
//           disabled={code.length !== 6}
//           className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-medium rounded-xl disabled:opacity-40 transition"
//         >
//           تایید
//         </button>
//       </div>
//     </form>
//   );
// }

// // ─── SettingsPage ─────────────────────────────────────────────
// export default function SettingsPage() {
//   const { user, refreshUser } = useAuth();
//   const searchParams = useSearchParams();
//   const isIncomplete = searchParams.get("incomplete") === "true";

//   const [nameState, nameAction] = useFormState(updateProfileAction, {
//     isSuccess: false,
//     error: "",
//   });

//   useEffect(() => {
//     if (nameState.isSuccess) {
//       refreshUser();
//     }
//   }, [nameState.isSuccess]);

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50"
//       dir="rtl"
//     >
//       <div className="max-w-2xl mx-auto px-4 py-12">
//         {/* Header */}
//         <div className="flex items-center gap-3 mb-8">
//           <div className="p-3 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl shadow-lg">
//             <HiCog className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">تنظیمات حساب</h1>
//             <p className="text-slate-500 text-sm">
//               اطلاعات حساب کاربری خود را مدیریت کنید
//             </p>
//           </div>
//         </div>

//         {/* بنر اجباری تکمیل پروفایل */}
//         {/* {isIncomplete && (
//           <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
//             <HiExclamationCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
//             <div>
//               <p className="font-semibold text-red-800">تکمیل پروفایل اجباری است</p>
//               <p className="text-sm text-red-600 mt-0.5">
//                 برای دسترسی به سایر بخش‌ها، ابتدا{" "}
//                 {!user?.email ? "ایمیل" : "شماره موبایل"} خود را تایید کنید
//               </p>
//             </div>
//           </div>
//         )} */}

//         {/* شماره موبایل */}
//         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
//           <div className="flex items-center gap-2 mb-4">
//             <HiPhone className="w-5 h-5 text-slate-500" />
//             <h2 className="font-semibold text-slate-800">شماره موبایل</h2>
//           </div>

//           {user?.mobile ? (
//             <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
//               <span className="text-slate-700 font-mono" dir="ltr">
//                 {user.mobile}
//               </span>
//               <span className="mr-auto flex items-center gap-1 text-emerald-600 text-xs">
//                 <HiCheckCircle className="w-4 h-4" />
//                 تایید شده
//               </span>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
//                 <HiExclamationCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
//                 <span className="text-amber-700 text-sm">
//                   شماره موبایل تایید نشده — برای ورود با موبایل اضافه کنید
//                 </span>
//               </div>
//               <VerifyField type="mobile" onSuccess={refreshUser} />
//             </div>
//           )}
//         </div>

//         {/* ایمیل */}
//         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
//           <div className="flex items-center gap-2 mb-4">
//             <HiMail className="w-5 h-5 text-slate-500" />
//             <h2 className="font-semibold text-slate-800">ایمیل</h2>
//           </div>

//           {user?.email ? (
//             <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
//               <span className="text-slate-700" dir="ltr">
//                 {user.email}
//               </span>
//               <span className="mr-auto flex items-center gap-1 text-emerald-600 text-xs">
//                 <HiCheckCircle className="w-4 h-4" />
//                 تایید شده
//               </span>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
//                 <HiExclamationCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
//                 <span className="text-amber-700 text-sm">
//                   ایمیل تایید نشده — برای ورود با ایمیل اضافه کنید
//                 </span>
//               </div>
//               <VerifyField type="email" onSuccess={refreshUser} />
//             </div>
//           )}
//         </div>

//         {/* فرم نام */}
//         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
//           <div className="flex items-center gap-2 mb-6">
//             <HiUser className="w-5 h-5 text-slate-500" />
//             <h2 className="font-semibold text-slate-800">اطلاعات شخصی</h2>
//           </div>

//           {nameState.isSuccess && (
//             <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4">
//               <HiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
//               <p className="text-emerald-700 text-sm">نام با موفقیت ذخیره شد</p>
//             </div>
//           )}

//           {nameState.error && (
//             <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
//               <p className="text-red-700 text-sm">{nameState.error}</p>
//             </div>
//           )}

//           <form action={nameAction} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 نام و نام خانوادگی
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 defaultValue={user?.name || ""}
//                 placeholder="نام خود را وارد کنید"
//                 className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition text-sm"
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all duration-200"
//             >
//               ذخیره نام
//             </button>
//           </form>
//         </div>

//         {/* راهنما */}
//         {(!user?.email || !user?.mobile) && (
//           <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4">
//             <p className="text-blue-800 text-sm font-medium mb-2">💡 راهنما</p>
//             <ul className="text-blue-700 text-xs space-y-1.5">
//               {!user?.mobile && (
//                 <li>• شماره موبایل خود را وارد کنید — کد تایید SMS می‌شود</li>
//               )}
//               {!user?.email && (
//                 <li>
//                   • ایمیل خود را وارد کنید — کد تایید به ایمیل ارسال می‌شود
//                 </li>
//               )}
//               <li>• با داشتن هر دو، از هر روشی می‌توانید وارد شوید</li>
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import {
  HiCog,
  HiUser,
  HiPhone,
  HiMail,
  HiCheckCircle,
  HiExclamationCircle,
} from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import {
  updateProfileAction,
  sendVerifyOtpAction,
  confirmVerifyOtpAction,
} from "@/app/_actions/auth";
import { OtpInput } from "@/app/_components/auth/OtpInput";

// ─── VerifyField ──────────────────────────────────────────────
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

  if (step === "input") {
    return (
      <form action={sendAction} className="space-y-3">
        <input type="hidden" name={type} value={value} />
        <input
          type={type === "email" ? "email" : "tel"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          dir={type === "email" ? "ltr" : "rtl"}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition text-sm"
        />
        {sendState.error && (
          <p className="text-red-600 text-xs">{sendState.error}</p>
        )}
        <button
          type="submit"
          disabled={!value}
          className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-medium rounded-xl disabled:opacity-40 transition"
        >
          ارسال کد تایید به {label}
        </button>
      </form>
    );
  }

  return (
    <form action={confirmAction} className="space-y-3">
      <input type="hidden" name={type} value={value} />
      <input type="hidden" name="code" value={code} />

      <p className="text-sm text-slate-600">
        کد ارسال شده به{" "}
        <span className="font-medium" dir="ltr">
          {value}
        </span>{" "}
        را وارد کنید
      </p>

      <OtpInput value={code} onChange={setCode} />

      {confirmState.error && (
        <p className="text-red-600 text-xs">{confirmState.error}</p>
      )}

      <div className="text-center text-xs text-slate-500">
        {countdown > 0 ? (
          <span>ارسال مجدد تا {formatTime(countdown)}</span>
        ) : (
          <button
            type="button"
            onClick={() => {
              setStep("input");
              setCode("");
            }}
            className="text-teal-600 hover:text-teal-700 flex items-center gap-1 mx-auto"
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
          className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition"
        >
          بازگشت
        </button>
        <button
          type="submit"
          disabled={code.length !== 6}
          className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-medium rounded-xl disabled:opacity-40 transition"
        >
          تایید
        </button>
      </div>
    </form>
  );
}

// ─── SettingsPage ─────────────────────────────────────────────
export default function SettingsPage() {
  const { user, refreshUser } = useAuth();

  const [nameState, nameAction] = useFormState(updateProfileAction, {
    isSuccess: false,
    error: "",
  });

  useEffect(() => {
    if (nameState.isSuccess) refreshUser();
  }, [nameState.isSuccess]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50"
      dir="rtl"
    >
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl shadow-lg">
            <HiCog className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">تنظیمات حساب</h1>
            <p className="text-slate-500 text-sm">
              اطلاعات حساب کاربری خود را مدیریت کنید
            </p>
          </div>
        </div>

        {/* شماره موبایل */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <HiPhone className="w-5 h-5 text-slate-500" />
            <h2 className="font-semibold text-slate-800">شماره موبایل</h2>
          </div>

          {user?.mobile ? (
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
              <span className="text-slate-700 font-mono" dir="ltr">
                {user.mobile}
              </span>
              <span className="mr-auto flex items-center gap-1 text-emerald-600 text-xs">
                <HiCheckCircle className="w-4 h-4" /> تایید شده
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <HiExclamationCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-amber-700 text-sm">
                  شماره موبایل تایید نشده — برای ورود با موبایل اضافه کنید
                </span>
              </div>
              <VerifyField type="mobile" onSuccess={refreshUser} />
            </div>
          )}
        </div>

        {/* ایمیل — اختیاری */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HiMail className="w-5 h-5 text-slate-500" />
              <h2 className="font-semibold text-slate-800">ایمیل</h2>
            </div>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
              اختیاری
            </span>
          </div>

          {user?.email ? (
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
              <span className="text-slate-700" dir="ltr">
                {user.email}
              </span>
              <span className="mr-auto flex items-center gap-1 text-emerald-600 text-xs">
                <HiCheckCircle className="w-4 h-4" /> تایید شده
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">
                با اضافه کردن ایمیل، می‌توانید با آن نیز وارد شوید
              </p>
              <VerifyField type="email" onSuccess={refreshUser} />
            </div>
          )}
        </div>

        {/* فرم نام */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <HiUser className="w-5 h-5 text-slate-500" />
            <h2 className="font-semibold text-slate-800">اطلاعات شخصی</h2>
          </div>

          {nameState.isSuccess && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4">
              <HiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-emerald-700 text-sm">نام با موفقیت ذخیره شد</p>
            </div>
          )}

          {nameState.error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <p className="text-red-700 text-sm">{nameState.error}</p>
            </div>
          )}

          <form action={nameAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                name="name"
                defaultValue={user?.name || ""}
                placeholder="نام خود را وارد کنید"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all duration-200"
            >
              ذخیره نام
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
