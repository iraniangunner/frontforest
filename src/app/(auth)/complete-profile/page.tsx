"use client";

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { User, Mail, Camera, Loader2, ArrowRight, Sparkles, Trees } from "lucide-react";
import { updateProfileAction } from "@/app/_actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 px-6 py-4
                 bg-gradient-to-r from-emerald-500 to-teal-600 
                 hover:from-emerald-600 hover:to-teal-700 
                 disabled:from-slate-300 disabled:to-slate-400
                 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/25 
                 transition-all duration-300 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>در حال ذخیره...</span>
        </>
      ) : (
        <>
          <span>تکمیل و ورود</span>
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </button>
  );
}

export default function CompleteProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [state, action] = useFormState(updateProfileAction, {
    isSuccess: false,
    error: "",
  });

  useEffect(() => {
    if (state.isSuccess) {
      router.push("/dashboard");
    }
  }, [state.isSuccess, router]);

  return (
    <div className="relative w-full max-w-md animate-slide-up">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2">
          <div
            className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 
                          rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30"
          >
            <Trees className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              Front
            </span>
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              Forest
            </span>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="relative group">
        <div
          className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500 
                        rounded-[28px] blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
        />

        <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-teal-600 px-8 py-10 text-center">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

            <div className="relative inline-flex">
              <div
                className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center 
                              border-4 border-white/30"
              >
                <User className="w-12 h-12 text-white" />
              </div>
              <button
                className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-full 
                                  flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <Camera className="w-5 h-5 text-teal-600" />
              </button>
              <Sparkles className="absolute -top-2 -left-2 w-6 h-6 text-teal-200 animate-pulse" />
            </div>

            <h1 className="text-2xl font-bold text-white mt-6">تکمیل پروفایل</h1>
            <p className="text-teal-100 text-sm mt-2">لطفا اطلاعات خود را تکمیل کنید</p>

            <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 400 30" fill="none">
              <path
                d="M0 30V15C50 25 100 5 150 15C200 25 250 5 300 15C350 25 400 15 400 15V30H0Z"
                fill="white"
              />
            </svg>
          </div>

          {/* Form */}
          <form action={action} className="px-8 py-8 space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: علی محمدی"
                className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl
                         text-slate-900 placeholder:text-slate-300
                         focus:outline-none focus:border-emerald-500 focus:bg-white 
                         focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                ایمیل
                <span className="text-xs text-gray-400 font-normal">(اختیاری)</span>
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                dir="ltr"
                className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl
                         text-slate-900 placeholder:text-slate-300 text-left
                         focus:outline-none focus:border-emerald-500 focus:bg-white 
                         focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>

            {/* Error */}
            {state.error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600">
                <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold">
                  !
                </span>
                {state.error}
              </div>
            )}

            <SubmitButton />

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full text-center text-sm text-gray-400 hover:text-teal-600 transition-colors"
            >
              بعداً تکمیل می‌کنم
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}