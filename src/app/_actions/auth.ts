// "use server";

// import { cookies } from "next/headers";

// const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// const cookieBase = {
//   httpOnly: true,
//   sameSite: "lax" as const,
//   path: "/",
//   secure: process.env.NODE_ENV === "production",
// };

// // ========================
// // Send OTP
// // ========================
// export async function sendOtpAction(prevState: any, formData: FormData) {
//   const mobile = formData.get("mobile") as string;

//   if (!mobile) {
//     return { isSuccess: false, error: "شماره موبایل را وارد کنید" };
//   }

//   if (!/^09[0-9]{9}$/.test(mobile)) {
//     return { isSuccess: false, error: "فرمت شماره موبایل صحیح نیست" };
//   }

//   try {
//     const res = await fetch(`${API_URL}/auth/send-otp`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ mobile }),
//     });

//     const data = await res.json().catch(() => ({}));

//     if (res.status === 429) {
//       return {
//         isSuccess: false,
//         error: data.message || "لطفا کمی صبر کنید",
//         retryAfter: data.retry_after || 120,
//       };
//     }

//     if (!res.ok) {
//       return { isSuccess: false, error: data.message || "خطا در ارسال کد تایید" };
//     }

//     return { isSuccess: true, error: "", expiresIn: data.expires_in || 120 };
//   } catch {
//     return { isSuccess: false, error: "خطا در برقراری ارتباط با سرور" };
//   }
// }

// // ========================
// // Verify OTP
// // ========================
// export async function verifyOtpAction(prevState: any, formData: FormData) {
//   const mobile = formData.get("mobile") as string;
//   const code = formData.get("code") as string;

//   if (!mobile || !code) {
//     return { isSuccess: false, error: "اطلاعات را کامل وارد کنید" };
//   }

//   if (code.length !== 6) {
//     return { isSuccess: false, error: "کد تایید باید ۶ رقم باشد" };
//   }

//   try {
//     const res = await fetch(`${API_URL}/auth/verify-otp`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ mobile, code }),
//     });

//     const data = await res.json().catch(() => ({}));

//     if (res.status === 429) {
//       return { isSuccess: false, error: "تعداد تلاش بیش از حد مجاز است" };
//     }

//     if (res.status === 401) {
//       return { isSuccess: false, error: "کد تایید نامعتبر یا منقضی شده است" };
//     }

//     if (!res.ok) {
//       return { isSuccess: false, error: data.message || "خطا در ورود" };
//     }

//     const c = await cookies();

//     c.set("access_token", data.access_token, {
//       ...cookieBase,
//       maxAge: data.expires_in,
//     });

//     c.set("refresh_token", data.refresh_token, {
//       ...cookieBase,
//       maxAge: 14 * 24 * 60 * 60,
//     });

//     return { isSuccess: true, error: "", isNewUser: data.is_new_user };
//   } catch {
//     return { isSuccess: false, error: "خطا در برقراری ارتباط با سرور" };
//   }
// }

// // ========================
// // Logout
// // ========================
// export async function logoutAction() {
//   const c = await cookies();
//   const accessToken = c.get("access_token")?.value;
//   const refreshToken = c.get("refresh_token")?.value;

//   try {
//     await fetch(`${API_URL}/auth/logout`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
//       },
//       body: JSON.stringify({ refresh_token: refreshToken }),
//     });
//   } catch {
//     // Ignore
//   }

//   c.delete("access_token");
//   c.delete("refresh_token");

//   return { isSuccess: true };
// }

// // ========================
// // Update Profile
// // ========================
// export async function updateProfileAction(prevState: any, formData: FormData) {
//   const name = formData.get("name") as string;
//   const email = formData.get("email") as string;

//   const c = await cookies();
//   const accessToken = c.get("access_token")?.value;

//   if (!accessToken) {
//     return { isSuccess: false, error: "لطفا دوباره وارد شوید" };
//   }

//   try {
//     const res = await fetch(`${API_URL}/auth/profile`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify({ name, email }),
//     });

//     const data = await res.json().catch(() => ({}));

//     if (res.status === 401) {
//       return { isSuccess: false, error: "لطفا دوباره وارد شوید" };
//     }

//     if (!res.ok) {
//       return { isSuccess: false, error: data.message || "خطا در ذخیره اطلاعات" };
//     }

//     return { isSuccess: true, error: "" };
//   } catch {
//     return { isSuccess: false, error: "خطا در برقراری ارتباط با سرور" };
//   }
// }

"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

// ========================
// Send OTP
// ========================
export async function sendOtpAction(prevState: any, formData: FormData) {
  const identifier = (formData.get("identifier") as string)?.trim();

  if (!identifier) {
    return { isSuccess: false, error: "شماره موبایل یا ایمیل را وارد کنید" };
  }

  const isMobile = /^09[0-9]{9}$/.test(identifier);
  const isEmail  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

  if (!isMobile && !isEmail) {
    return { isSuccess: false, error: "یک شماره موبایل یا ایمیل معتبر وارد کنید" };
  }

  const body = isMobile ? { mobile: identifier } : { email: identifier };

  try {
    const res = await fetch(`${API_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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

    return {
      isSuccess: true,
      error: "",
      expiresIn: data.expires_in || 120,
      channel: data.channel, // 'sms' or 'email'
    };
  } catch {
    return { isSuccess: false, error: "خطا در برقراری ارتباط با سرور" };
  }
}

// ========================
// Verify OTP
// ========================
export async function verifyOtpAction(prevState: any, formData: FormData) {
  const identifier = (formData.get("identifier") as string)?.trim();
  const code       = formData.get("code") as string;

  if (!identifier || !code) {
    return { isSuccess: false, error: "اطلاعات را کامل وارد کنید" };
  }

  if (code.length !== 6) {
    return { isSuccess: false, error: "کد تایید باید ۶ رقم باشد" };
  }

  const isMobile = /^09[0-9]{9}$/.test(identifier);
  const body     = isMobile
    ? { mobile: identifier, code }
    : { email: identifier, code };

  try {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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





// ارسال OTP برای تایید موبایل/ایمیل در settings
export async function sendVerifyOtpAction(prevState: any, formData: FormData) {
  const mobile = formData.get("mobile") as string;
  const email  = formData.get("email") as string;

  const c           = await cookies();
  const accessToken = c.get("access_token")?.value;

  if (!accessToken) return { isSuccess: false, error: "لطفا دوباره وارد شوید" };

  const body = mobile ? { mobile } : { email };

  try {
    const res = await fetch(`${API_URL}/auth/verify/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 429) return { isSuccess: false, error: data.message || "لطفا صبر کنید", retryAfter: data.retry_after };
    if (!res.ok)           return { isSuccess: false, error: data.message || "خطا در ارسال کد" };

    return { isSuccess: true, error: "", expiresIn: data.expires_in || 300 };
  } catch {
    return { isSuccess: false, error: "خطا در ارتباط با سرور" };
  }
}

// تایید OTP
export async function confirmVerifyOtpAction(prevState: any, formData: FormData) {
  const mobile = formData.get("mobile") as string;
  const email  = formData.get("email") as string;
  const code   = formData.get("code") as string;

  const c           = await cookies();
  const accessToken = c.get("access_token")?.value;

  if (!accessToken) return { isSuccess: false, error: "لطفا دوباره وارد شوید" };

  const body = mobile ? { mobile, code } : { email, code };

  try {
    const res = await fetch(`${API_URL}/auth/verify/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) return { isSuccess: false, error: data.message || "کد نامعتبر است" };

    // آپدیت cookie
    c.set("profile_complete", "true", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 14 * 24 * 60 * 60,
    });

    return { isSuccess: true, error: "" };
  } catch {
    return { isSuccess: false, error: "خطا در ارتباط با سرور" };
  }
}

// ========================
// Logout
// ========================
export async function logoutAction() {
  const c = await cookies();
  const accessToken  = c.get("access_token")?.value;
  const refreshToken = c.get("refresh_token")?.value;

  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch {}

  c.delete("access_token");
  c.delete("refresh_token");

  return { isSuccess: true };
}

// ========================
// Update Profile
// ========================
export async function updateProfileAction(prevState: any, formData: FormData) {
  const name  = formData.get("name") as string;
  const email = formData.get("email") as string;

  const c           = await cookies();
  const accessToken = c.get("access_token")?.value;

  if (!accessToken) {
    return { isSuccess: false, error: "لطفا دوباره وارد شوید" };
  }

  try {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name, email }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      return { isSuccess: false, error: "لطفا دوباره وارد شوید" };
    }

    if (!res.ok) {
      return { isSuccess: false, error: data.message || "خطا در ذخیره اطلاعات" };
    }

    return { isSuccess: true, error: "" };
  } catch {
    return { isSuccess: false, error: "خطا در برقراری ارتباط با سرور" };
  }
}