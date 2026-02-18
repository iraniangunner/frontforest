// import { Smartphone, KeyRound } from "lucide-react";

// interface AuthCardProps {
//   step: "mobile" | "otp";
//   mobile?: string;
//   children: React.ReactNode;
// }

// export function AuthCard({ step, mobile, children }: AuthCardProps) {
//   return (
//     <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-8 text-center">
//         <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
//           {step === "mobile" ? (
//             <Smartphone className="w-8 h-8 text-white" />
//           ) : (
//             <KeyRound className="w-8 h-8 text-white" />
//           )}
//         </div>
//         <h1 className="text-xl font-bold text-white">
//           {step === "mobile" ? "ورود / ثبت نام" : "کد تایید"}
//         </h1>
//         <p className="text-teal-100 text-sm mt-2">
//           {step === "mobile"
//             ? "شماره موبایل خود را وارد کنید"
//             : `کد ارسال شده به ${mobile} را وارد کنید`}
//         </p>
//       </div>

//       {/* Content */}
//       <div className="p-6 sm:p-8">{children}</div>
//     </div>
//   );
// }


import { Smartphone, KeyRound, Mail } from "lucide-react";

interface AuthCardProps {
  step: "identifier" | "otp";
  identifier?: string;
  channel?: "sms" | "email";
  children: React.ReactNode;
}

export function AuthCard({ step, identifier, channel, children }: AuthCardProps) {
  const icon =
    step === "identifier" ? <Smartphone className="w-8 h-8 text-white" /> :
    channel === "email"   ? <Mail className="w-8 h-8 text-white" /> :
                            <KeyRound className="w-8 h-8 text-white" />;

  const subtitle =
    step === "identifier"
      ? "شماره موبایل یا ایمیل خود را وارد کنید"
      : channel === "email"
      ? `کد ارسال شده به ${identifier} را وارد کنید`
      : `کد ارسال شده به ${identifier} را وارد کنید`;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-8 text-center">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
        <h1 className="text-xl font-bold text-white">
          {step === "identifier" ? "ورود / ثبت نام" : "کد تایید"}
        </h1>
        <p className="text-teal-100 text-sm mt-2">{subtitle}</p>
      </div>

      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}