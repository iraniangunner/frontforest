"use client";

import { useState, useEffect, Suspense } from "react";
import { useFormState } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { sendOtpAction, verifyOtpAction } from "@/app/_actions/auth";
import { AuthCard, MobileForm, OtpForm } from "@/app/_components/auth";
import { Trees } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ✅ Get redirect URL from query params (default to /profile)
  const redirectUrl = searchParams.get("redirect") || "/profile";

  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);

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
      setCode("");
    }
  }, [sendState]);

  useEffect(() => {
    if (verifyState.isSuccess) {
      refreshUser().then(() => {
        // ✅ Redirect to the URL from query params
        router.push(redirectUrl);
      });
    }
  }, [verifyState, router, refreshUser, redirectUrl]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleResend = () => setStep("mobile");
  const handleBack = () => setStep("mobile");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-teal-200/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-200/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Trees className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                فرانت
              </span>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                فارست
              </span>
            </div>
          </Link>
        </div>

        {/* Auth Card */}
        <AuthCard step={step} mobile={mobile}>
          {step === "mobile" ? (
            <MobileForm
              mobile={mobile}
              setMobile={setMobile}
              error={sendState.error}
              action={sendAction}
            />
          ) : (
            <OtpForm
              mobile={mobile}
              code={code}
              setCode={setCode}
              countdown={countdown}
              error={verifyState.error}
              action={verifyAction}
              onResend={handleResend}
              onBack={handleBack}
            />
          )}
        </AuthCard>
      </div>
    </div>
  );
}

// ✅ Wrap with Suspense for useSearchParams
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
