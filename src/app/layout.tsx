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
import Script from "next/script";
import { Suspense } from "react";
import YandexMetrica from "./_components/analytics/YandexMetrica";

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
  title: "فروشگاه پترا",
  icons: {
    icon: "/favicon.ico",
  },
  description:
    "خرید آنلاین محصولات فروشگاه پترا با گارانتی معتبر — ارسال به سراسر ایران",
  verification: {
    google: "1nXv1VVb_D9HbajkcQTp507Iru1JAYv2lqfraw3gNVA",
  },
  alternates: { canonical: process.env.NEXT_PUBLIC_SITE_URL },
  openGraph: {
    title: "فروشگاه پترا",
    description:
      "خرید آنلاین محصولات فروشگاه پترا با گارانتی معتبر — ارسال به سراسر ایران",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "فروشگاه پترا",
    locale: "fa_IR",
    type: "website",
  },
};

// Schema.org JSON-LD
function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "فروشگاه پترا",
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
      <head>
        <Script id="yandex-metrica" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(109829000, "init", {
                webvisor:true,
                clickmap:true,
                ecommerce:"dataLayer",
                accurateTrackBounce:true,
                trackLinks:true
            });
          `}
        </Script>
      </head>
      <body className={`${yekanbakh.variable} antialiased`}>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/109829000"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        <Suspense fallback={null}>
          <YandexMetrica />
        </Suspense>
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
