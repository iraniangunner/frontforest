// app/contact/page.tsx
import { HiLocationMarker, HiMail, HiPhone, HiChatAlt2 } from "react-icons/hi";
import ContactForm from "@/app/_components/ui/ContactForm";

export const metadata = {
  title: "تماس با ما | فروشگاه پترا",
  description: "با ما در ارتباط باشید - فروشگاه پترا",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/contact` },
  openGraph: {
    title: "تماس با ما | فروشگاه پترا",
    description: "با ما در ارتباط باشید - فروشگاه پترا",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
    siteName: "فروشگاه پترا",
    locale: "fa_IR",
    type: "website",
  },
};

// Schema.org JSON-LD
function ContactJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "تماس با ما",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "فروشگاه پترا",
      telephone: "+98-21-22252875",
      email: "info@petra.pmk-co.com",
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

const contactItems = [
  {
    label: "تماس بگیرید",
    value: "021-2225-2875",
    href: "tel:+982122252875",
    icon: HiPhone,
    ltr: true,
    mono: true,
  },
  {
    label: "مکاتبه ایمیلی",
    value: "info@petra.pmk-co.com",
    href: "mailto:info@petra.pmk-co.com",
    icon: HiMail,
    ltr: true,
  },
  {
    label: "نشانی",
    value:
      "تهران — میرداماد، میدان مادر، خیابان سنجابی، کوچه شریفی، پلاک ۶، واحد ۲",
    icon: HiLocationMarker,
  },
];

export default function ContactPage() {
  return (
    <>
      <ContactJsonLd />
      <div className="bg-white" dir="rtl">
        {/* ═══════════ Hero ═══════════ */}
        <section className="relative bg-[#FCFCFC]">
          <div className="relative overflow-hidden bg-gradient-to-b from-[#F6EAEB] to-[#FBF3F4] pb-40 pt-20 sm:pt-28">
            <div className="relative mx-auto max-w-2xl px-6 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#A72F3B] shadow-sm ring-1 ring-[#EDD5D8]">
                <HiChatAlt2 className="h-7 w-7" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-[#242424] sm:text-5xl">
                تماس با ما
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#656565] sm:text-lg">
                سوالی دارید؟ در سریع‌ترین زمان ممکن پاسخگوی شما هستیم.
              </p>
            </div>
          </div>

          {/* ═══════════ کارت اطلاعات تماس شناور ═══════════ */}
          <div className="relative z-10 mx-auto -mt-20 max-w-5xl px-6">
            <div className="rounded-3xl border border-[#F0F0F0] bg-white p-6 shadow-xl shadow-black/[0.04] sm:p-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F6EAEB] text-[#A72F3B]">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <dt className="text-sm font-medium text-[#898989]">
                        {item.label}
                      </dt>
                      <dd className="mt-1">
                        {item.href ? (
                          <a
                            href={item.href}
                            className={`text-sm text-[#242424] hover:text-[#A72F3B] transition-colors ${
                              item.mono ? "font-mono" : ""
                            }`}
                            dir={item.ltr ? "ltr" : undefined}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <span className="text-sm text-[#242424] leading-7">
                            {item.value}
                          </span>
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ نقشه + فرم ═══════════ */}
        <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#242424] sm:text-3xl">
              از طریق ایمیل و تماس تلفنی پاسخگوی شما هستیم
            </h2>
            <p className="mt-3 text-[#656565]">
              فرم زیر را پر کنید تا در اسرع وقت با شما در ارتباط باشیم.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            {/* نقشه */}
            <div className="overflow-hidden rounded-3xl border border-[#F0F0F0] bg-[#F8F8F8] min-h-[320px] lg:min-h-full">
              <iframe
                title="موقعیت فروشگاه پترا روی نقشه"
                src="https://www.google.com/maps?q=%D9%85%DB%8C%D8%AF%D8%A7%D9%86+%D9%85%D8%A7%D8%AF%D8%B1+%D8%AA%D9%87%D8%B1%D8%A7%D9%86&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "320px" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full w-full"
              />
            </div>

            {/* فرم */}
            <div className="rounded-3xl border border-[#F0F0F0] bg-white p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
