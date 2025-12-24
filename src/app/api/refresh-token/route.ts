import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST() {
  const c = await cookies();
  const refreshToken = c.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: "No refresh token" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      // Clear cookies on refresh failure
      c.delete("access_token");
      c.delete("refresh_token");

      return NextResponse.json(
        { success: false, message: "Refresh failed" },
        { status: 401 }
      );
    }

    // Update cookies
    const cookieOptions = {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    };

    c.set("access_token", data.access_token, {
      ...cookieOptions,
      maxAge: data.expires_in || 3600,
    });

    c.set("refresh_token", data.refresh_token, {
      ...cookieOptions,
      maxAge: 14 * 24 * 60 * 60, // 14 days
    });

    return NextResponse.json({
      success: true,
      access_token: data.access_token,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
