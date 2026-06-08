import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { UserStatusProvider } from "@/context/UserStatusContext";

const yekanbakh = localFont({
  src: [
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-yekanbakh",
});

export const metadata: Metadata = {
  title: "نمایندگی انحصاری فانتوم پلاس در ایران",
  description:
    "خرید آنلاین محصولات اصل فانتوم پلاس با گارانتی معتبر — ارسال به سراسر ایران",
  alternates: { canonical: process.env.NEXT_PUBLIC_SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${yekanbakh.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <UserStatusProvider>
              {children}

              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: { fontFamily: "Vazirmatn, sans-serif" },
                }}
              />
            </UserStatusProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
