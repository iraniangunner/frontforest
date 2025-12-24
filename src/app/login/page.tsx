"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import logo from "../../../public/images/frontforest-logo.svg";
import { sendOtpAction, verifyOtpAction } from "@/app/_actions/auth";
import { AuthCard, MobileForm, OtpForm } from "@/app/_components/auth";
import Image from "next/image";


export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);

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
      router.push(verifyState.isNewUser ? "/complete-profile" : "/dashboard");
    }
  }, [verifyState, router]);

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
          <Link href="/" className="inline-flex items-center gap-1 mb-4 group">
          <Image
    src={logo}
    alt="Logo"
    
  />
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
