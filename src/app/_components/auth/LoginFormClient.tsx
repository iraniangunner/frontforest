// app/login/_components/LoginFormClient.tsx
"use client";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import dynamic from "next/dynamic";
import { sendOtpAction, verifyOtpAction } from "@/app/_actions/auth";
import { AuthCard, OtpForm, IdentifierForm } from "@/app/_components/auth";
import { authAPI } from "@/lib/api";

const SessionModal = dynamic(
  () => import("@/app/_components/auth/SessionModal"),
  { ssr: false },
);

export function LoginFormClient() {
  const [step, setStep] = useState<"identifier" | "otp">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [channel, setChannel] = useState<"sms" | "email">("sms");
  const [checking, setChecking] = useState(true);
  const [sessionData, setSessionData] = useState<{
    sessions: any[];
    sessionToken: string;
    message: string;
  } | null>(null);

  const [sendState, sendAction] = useFormState(sendOtpAction, {
    isSuccess: false,
    error: "",
  });

  const [verifyState, verifyAction] = useFormState(verifyOtpAction, {
    isSuccess: false,
    error: "",
  });

  // وقتی صفحه login باز شد، چک کن آیا کاربر لاگین هست
  // api.ts interceptor خودش اگه access_token منقضی بود با refresh_token توکن جدید میگیره
  useEffect(() => {
    authAPI
      .me()
      .then(() => {
        window.location.href = "/profile";
      })
      .catch(() => {
        // نشد — بمون توی login
        setChecking(false);
      });
  }, []);

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
      window.location.href = "/profile";
      return;
    }
    if ((verifyState as any).requireSessionManagement) {
      setSessionData({
        sessions: (verifyState as any).sessions,
        sessionToken: (verifyState as any).sessionToken,
        message: (verifyState as any).message,
      });
    }
  }, [verifyState]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // تا وقتی چک در جریانه، همان skeleton رو نشون بده
  if (checking) return null;

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
          onSuccess={() => {
            setSessionData(null);
            window.location.href = "/profile";
          }}
          onCancel={() => setSessionData(null)}
        />
      )}
    </>
  );
}
