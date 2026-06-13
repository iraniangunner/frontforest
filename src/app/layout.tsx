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
  display: "swap",
});

export const metadata: Metadata = {
  title: "نمایندگی انحصاری فانتوم پلاس در ایران",
  icons: {
    icon: "/favicon.ico",
  },
  description:
    "خرید آنلاین محصولات اصل فانتوم پلاس با گارانتی معتبر — ارسال به سراسر ایران",
  verification: {
    google: "1nXv1VVb_D9HbajkcQTp507Iru1JAYv2lqfraw3gNVA",
  },
  alternates: { canonical: process.env.NEXT_PUBLIC_SITE_URL },
  openGraph: {
    title: "نمایندگی انحصاری فانتوم پلاس در ایران",
    description:
      "خرید آنلاین محصولات اصل فانتوم پلاس با گارانتی معتبر — ارسال به سراسر ایران",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "نمایندگی انحصاری فانتوم پلاس در ایران",
    locale: "fa_IR",
    type: "website",
  },
};

// Schema.org JSON-LD
function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "نمایندگی انحصاری فانتوم پلاس در ایران",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/images/petra-logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+98-21-22252875",
      contactType: "customer service",
      areaServed: "IR",
      availableLanguage: "Persian",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${yekanbakh.variable} antialiased`}>
      <OrganizationJsonLd />
        <AuthProvider>
          <CartProvider>
            <UserStatusProvider>
              {children}

              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: { fontFamily: "var(--font-yekanbakh), sans-serif" },
                }}
              />
            </UserStatusProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
