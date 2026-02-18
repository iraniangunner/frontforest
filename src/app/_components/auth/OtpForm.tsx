// "use client";

// import { ArrowLeft, RefreshCw, Timer } from "lucide-react";
// import { SubmitButton } from "./SubmitButton";
// import { ErrorMessage } from "./ErrorMessage";
// import { OtpInput } from "./OtpInput";

// interface OtpFormProps {
//   mobile: string;
//   code: string;
//   setCode: (value: string) => void;
//   countdown: number;
//   error: string;
//   action: (formData: FormData) => void;
//   onResend: () => void;
//   onBack: () => void;
// }

// export function OtpForm({
//   mobile,
//   code,
//   setCode,
//   countdown,
//   error,
//   action,
//   onResend,
//   onBack,
// }: OtpFormProps) {
//   const formatTime = (s: number) =>
//     `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

//   return (
//     <form action={action} className="space-y-6">
//       <input type="hidden" name="mobile" value={mobile} />
//       <input type="hidden" name="code" value={code} />

//       <OtpInput value={code} onChange={setCode} />

//       {/* Countdown */}
//       <div className="text-center">
//         {countdown > 0 ? (
//           <span className="inline-flex items-center gap-2 text-gray-500 text-sm">
//             <Timer className="w-4 h-4" />
//             ارسال مجدد تا {formatTime(countdown)}
//           </span>
//         ) : (
//           <button
//             type="button"
//             onClick={onResend}
//             className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-600 font-medium text-sm"
//           >
//             <RefreshCw className="w-4 h-4" />
//             ارسال مجدد کد
//           </button>
//         )}
//       </div>

//       <ErrorMessage message={error} />

//       <SubmitButton
//         labelPending="در حال بررسی..."
//         labelIdle="تایید و ورود"
//         disabled={code.length !== 6}
//       />

//       <button
//         type="button"
//         onClick={onBack}
//         className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-teal-600 text-sm"
//       >
//         <ArrowLeft className="w-4 h-4" />
//         تغییر شماره موبایل
//       </button>
//     </form>
//   );
// }

"use client";

import { ArrowLeft, RefreshCw, Timer } from "lucide-react";
import { SubmitButton } from "./SubmitButton";
import { ErrorMessage } from "./ErrorMessage";
import { OtpInput } from "./OtpInput";

interface OtpFormProps {
  identifier: string;
  channel: "sms" | "email";
  code: string;
  setCode: (value: string) => void;
  countdown: number;
  error: string;
  action: (formData: FormData) => void;
  onResend: () => void;
  onBack: () => void;
}

export function OtpForm({
  identifier,
  channel,
  code,
  setCode,
  countdown,
  error,
  action,
  onResend,
  onBack,
}: OtpFormProps) {
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const backLabel =
    channel === "email" ? "تغییر ایمیل" : "تغییر شماره موبایل";

  return (
    <form action={action} className="space-y-6">
      {/* hidden fields */}
      <input type="hidden" name="identifier" value={identifier} />
      <input type="hidden" name="code" value={code} />

      <OtpInput value={code} onChange={setCode} />

      {/* Countdown */}
      <div className="text-center">
        {countdown > 0 ? (
          <span className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <Timer className="w-4 h-4" />
            ارسال مجدد تا {formatTime(countdown)}
          </span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-600 font-medium text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            ارسال مجدد کد
          </button>
        )}
      </div>

      <ErrorMessage message={error} />

      <SubmitButton
        labelPending="در حال بررسی..."
        labelIdle="تایید و ورود"
        disabled={code.length !== 6}
      />

      <button
        type="button"
        onClick={onBack}
        className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-teal-600 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </button>
    </form>
  );
}