import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "./_components/layout/Header";
import { AuthProvider } from "@/context/AuthContext";
import Footer from "./_components/layout/Footer";
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
  title: "FrontForest",
  description: "Explore themes here!!",
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
              <Header />
              {children}

              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: { fontFamily: "Vazirmatn, sans-serif" },
                }}
              />
              <Footer />
            </UserStatusProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
