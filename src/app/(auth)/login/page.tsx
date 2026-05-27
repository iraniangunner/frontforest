"use client";

import { useState, useEffect, Suspense } from "react";
import { useFormState } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { sendOtpAction, verifyOtpAction } from "@/app/_actions/auth";
import { AuthCard, OtpForm } from "@/app/_components/auth";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

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

// ─── IdentifierForm ───────────────────────────────────────────
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
      ? "✓ شماره موبایل - کد SMS ارسال می‌شود"
      : state === "email"
        ? "✓ ایمیل - کد به ایمیل شما ارسال می‌شود"
        : state === "invalid"
          ? "یک شماره موبایل (09...) یا ایمیل معتبر وارد کنید"
          : "شماره موبایل یا ایمیل خود را وارد کنید";

  const hintColor =
    state === "mobile" || state === "email"
      ? "text-emerald-600"
      : state === "invalid"
        ? "text-red-500"
        : "text-slate-400";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="identifier" value={identifier} />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 text-right">
          ورود / ثبت‌نام
        </label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="09123456789 یا email@example.com"
          dir="ltr"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-left placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition text-sm"
        />
        <p className={`text-xs text-right transition-colors ${hintColor}`}>
          {hint}
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-right bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state !== "mobile" && state !== "email"}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium text-sm shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ارسال کد تایید
      </button>
    </form>
  );
}

// ─── LoginContent ─────────────────────────────────────────────
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/profile";

  const [step, setStep] = useState<"identifier" | "otp">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [channel, setChannel] = useState<"sms" | "email">("sms");

  const { refreshUser } = useAuth();

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
      refreshUser().then(() => router.push(redirectUrl));
    }
  }, [verifyState, router, refreshUser, redirectUrl]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-teal-200/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-200/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center items-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/petra-logo.png"
              alt="فانتوم پلاس"
              width={120}
              height={40}
              className="w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Card */}
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
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
