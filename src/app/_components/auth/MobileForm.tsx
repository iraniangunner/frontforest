"use client";

import { Smartphone } from "lucide-react";
import { SubmitButton } from "./SubmitButton";
import { ErrorMessage } from "./ErrorMessage";

interface MobileFormProps {
  mobile: string;
  setMobile: (value: string) => void;
  error: string;
  action: (formData: FormData) => void;
}

export function MobileForm({ mobile, setMobile, error, action }: MobileFormProps) {
  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <Smartphone className="w-4 h-4 text-gray-400" />
          شماره موبایل
        </label>
        <input
          type="tel"
          name="mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 11))}
          placeholder="09123456789"
          dir="ltr"
          className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl 
                     text-slate-900 placeholder:text-gray-400 text-center text-lg tracking-wider
                     focus:outline-none focus:border-emerald-500 focus:bg-white 
                     focus:ring-4 focus:ring-emerald-500/10 transition-all"
        />
      </div>

      <ErrorMessage message={error} />

      <SubmitButton labelPending="در حال ارسال..." labelIdle="دریافت کد تایید" />
    </form>
  );
}