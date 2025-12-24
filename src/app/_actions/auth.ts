"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export async function sendOtpAction(prevState: any, formData: FormData) {
  const mobile = formData.get("mobile") as string;

  if (!mobile) {
    return { isSuccess: false, error: "شماره موبایل را وارد کنید" };
  }

  if (!/^09[0-9]{9}$/.test(mobile)) {
    return { isSuccess: false, error: "فرمت شماره موبایل صحیح نیست" };
  }

  try {
    const res = await fetch(`${API_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 429) {
      return {
        isSuccess: false,
        error: data.message || "لطفا کمی صبر کنید",
        retryAfter: data.retry_after || 120,
      };
    }

    if (!res.ok) {
      return { isSuccess: false, error: data.message || "خطا در ارسال کد تایید" };
    }

    return { isSuccess: true, error: "", expiresIn: data.expires_in || 120 };
  } catch {
    return { isSuccess: false, error: "خطا در برقراری ارتباط با سرور" };
  }
}

export async function verifyOtpAction(prevState: any, formData: FormData) {
  const mobile = formData.get("mobile") as string;
  const code = formData.get("code") as string;

  if (!mobile || !code) {
    return { isSuccess: false, error: "اطلاعات را کامل وارد کنید" };
  }

  if (code.length !== 6) {
    return { isSuccess: false, error: "کد تایید باید ۶ رقم باشد" };
  }

  try {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, code }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 429) {
      return { isSuccess: false, error: "تعداد تلاش بیش از حد مجاز است" };
    }

    if (res.status === 401) {
      return { isSuccess: false, error: "کد تایید نامعتبر یا منقضی شده است" };
    }

    if (!res.ok) {
      return { isSuccess: false, error: data.message || "خطا در ورود" };
    }

    const c = await cookies();

    c.set("access_token", data.access_token, {
      ...cookieBase,
      maxAge: data.expires_in,
    });

    c.set("refresh_token", data.refresh_token, {
      ...cookieBase,
      maxAge: 14 * 24 * 60 * 60,
    });

    return { isSuccess: true, error: "", isNewUser: data.is_new_user };
  } catch {
    return { isSuccess: false, error: "خطا در برقراری ارتباط با سرور" };
  }
}