"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { sendOtpAction, verifyOtpAction } from "@/app/_actions/auth";
import { AuthCard, OtpForm } from "@/app/_components/auth";
import SessionModal from "@/app/_components/auth/SessionModal";
import { useAuth } from "@/context/AuthContext";
import { SubmitButton } from "@/app/_components/auth/SubmitButton";

// ─── helpers ──────────────────────────────────────────────────
const isMobile = (v: string) => /^09[0-9]{9}$/.test(v);
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

type InputState = "idle" | "mobile" | "email" | "invalid";

function getInputState(value: string): InputState {
  if (!value) return "idle";
  if (isMobile(value)) return "mobile";
  if (isEmail(value)) return "email";
  if (value.length > 2) return "invalid";
  return "idle";
}

// ─── IdentifierForm (فقط ظاهر تغییر کرده، منطق همان است) ───────
function IdentifierForm({
  identifier,
  setIdentifier,
  error,
  action,
}: {
  identifier: string;
  setIdentifier: (v: string) => void;
  error?: string;
  action: (payload: FormData) => void;
}) {
  const state = getInputState(identifier);

  const hint =
    state === "mobile"
      ? "✓ شماره موبایل - کد به‌صورت پیامک ارسال می‌شود"
      : state === "email"
      ? "✓ ایمیل - کد به ایمیل شما ارسال می‌شود"
      : state === "invalid"
      ? "یک شماره موبایل (۰۹...) یا ایمیل معتبر وارد کنید"
      : "شماره موبایل یا ایمیل خود را وارد کنید";

  const hintColor =
    state === "mobile" || state === "email"
      ? "text-[#00966D]"
      : state === "invalid"
      ? "text-[#C30000]"
      : "text-[#898989]";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="identifier" value={identifier} />
      <div className="space-y-2">
        <label className="block text-[14px] font-medium text-[#242424] text-right">
          ورود / ثبت‌نام
        </label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="09123456789 یا email@example.com"
          dir="ltr"
          className="w-full px-4 py-3 rounded-xl border border-[#EDEDED] bg-white text-left
                     placeholder:text-[#CBCBCB] text-[#242424]
                     focus:outline-none focus:border-[#A72F3B] focus:ring-4 focus:ring-[#A72F3B]/10
                     transition text-sm"
        />
        <p className={`text-xs text-right transition-colors ${hintColor}`}>
          {hint}
        </p>
      </div>

      {error && (
        <p className="text-sm text-[#C30000] text-right bg-[#FBEAEA] px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <SubmitButton
        labelPending="در حال ارسال..."
        labelIdle="ارسال کد تایید"
        disabled={state !== "mobile" && state !== "email"}
        icon={null}
      />
    </form>
  );
}

// ─── LoginContent (منطق کاملاً دست‌نخورده) ────────────────────
export function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/profile";

  const [step, setStep] = useState<"identifier" | "otp">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [channel, setChannel] = useState<"sms" | "email">("sms");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [sessionData, setSessionData] = useState<{
    sessions: any[];
    sessionToken: string;
    message: string;
  } | null>(null);

  const { user, loading, refreshUser } = useAuth();

  // اگه کاربر قبلاً لاگین کرده، مستقیم بفرست به redirectUrl
  useEffect(() => {
    if (!loading && user) {
      router.push(redirectUrl);
    }
  }, [user, loading, router, redirectUrl]);

  const [sendState, sendAction] = useFormState(sendOtpAction, {
    isSuccess: false,
    error: "",
  });

  const [verifyState, verifyAction] = useFormState(verifyOtpAction, {
    isSuccess: false,
    error: "",
  });

  useEffect(() => {
    if (sendState.isSuccess) {
      setStep("otp");
      setCountdown(sendState.expiresIn || 120);
      setChannel(sendState.channel || "sms");
      setCode("");
    }
  }, [sendState]);

  useEffect(() => {
    if (verifyState.isSuccess) {
      setIsRedirecting(true);
      refreshUser().then(() => router.push(redirectUrl));
      return;
    }

    if ((verifyState as any).requireSessionManagement) {
      setSessionData({
        sessions: (verifyState as any).sessions,
        sessionToken: (verifyState as any).sessionToken,
        message: (verifyState as any).message,
      });
    }
  }, [verifyState, router, refreshUser, redirectUrl]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleSessionSuccess = () => {
    setSessionData(null);
    setIsRedirecting(true);
    refreshUser().then(() => router.push(redirectUrl));
  };

  // تا وقتی auth status معلوم نشده، یا کاربر لاگین بود، یا در حال ریدایرکت هستیم، اسپینر کلی نشون بده
  if (loading || user || isRedirecting) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A72F3B]" />
      </div>
    );
  }

  return (
    <>
      <AuthCard step={step} identifier={identifier} channel={channel}>
        {step === "identifier" ? (
          <IdentifierForm
            identifier={identifier}
            setIdentifier={setIdentifier}
            error={sendState.error}
            action={sendAction}
          />
        ) : (
          <OtpForm
            identifier={identifier}
            code={code}
            setCode={setCode}
            countdown={countdown}
            channel={channel}
            error={verifyState.error}
            action={verifyAction}
            onResend={() => setStep("identifier")}
            onBack={() => setStep("identifier")}
          />
        )}
      </AuthCard>

      {sessionData && (
        <SessionModal
          sessions={sessionData.sessions}
          sessionToken={sessionData.sessionToken}
          message={sessionData.message}
          onSuccess={handleSessionSuccess}
          onCancel={() => setSessionData(null)}
        />
      )}
    </>
  );
}
