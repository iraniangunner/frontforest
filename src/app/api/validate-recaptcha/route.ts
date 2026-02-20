import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "reCAPTCHA token is required" },
        { status: 400 },
      );
    }

    const secret = process.env.CAPTCHA_SECRET_KEY;

    if (!secret) {
      console.error("RECAPTCHA_SECRET_KEY is not set");
      return NextResponse.json(
        { success: false, error: "Server misconfiguration" },
        { status: 500 },
      );
    }

    const verifyResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
      },
    );

    const result = await verifyResponse.json();

    if (result.success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: result["error-codes"] ?? "Invalid reCAPTCHA" },
      { status: 400 },
    );
  } catch (error) {
    console.error("reCAPTCHA validation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
