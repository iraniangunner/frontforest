interface AuthCardProps {
  step: "identifier" | "otp";
  identifier?: string;
  channel?: "sms" | "email";
  children: React.ReactNode;
}

export function AuthCard({
  step,
  identifier,
  channel,
  children,
}: AuthCardProps) {
  const title = step === "identifier" ? "ورود / ثبت‌نام" : "کد تایید";

  const subtitle =
    step === "identifier"
      ? "شماره موبایل یا ایمیل خود را وارد کنید"
      : `کد ارسال‌شده به ${identifier} را وارد کنید`;

  // بدون کادر و حاشیه — فقط عنوان + فرم، لخت روی پس‌زمینه
  return (
    <div>
      <div className="text-right mb-8">
        <h1 className="text-[28px] leading-[1.4] font-bold text-[#242424]">
          {title}
        </h1>
        <p className="text-[#898989] text-sm leading-[1.8] mt-2">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}
