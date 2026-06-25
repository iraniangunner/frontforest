// app/contact/page.tsx
import { HiLocationMarker, HiMail, HiPhone } from "react-icons/hi";
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
      name: "ن",
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
    label: "ایمیل",
    value: "info@petra.pmk-co.com",
    href: "mailto:info@petra.pmk-co.com",
    icon: HiMail,
    ltr: true,
  },
  {
    label: "تلفن",
    value: "021-2225-2875",
    href: "tel:+982122252875",
    icon: HiPhone,
    ltr: true,
    mono: true,
  },
  {
    label: "آدرس",
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
        {/* Hero */}
        <div className="relative isolate overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-[#F6EAEB] px-4 py-1.5 text-sm font-medium text-[#A72F3B] ring-1 ring-inset ring-[#A72F3B]/20 mb-6">
                تماس با ما
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-[#242424] sm:text-5xl">
                با ما در ارتباط باشید
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#656565]">
                سوالی دارید؟ تیم پشتیبانی ما آماده پاسخگویی به شماست.
              </p>
            </div>
          </div>

          {/* Decorative blob — maroon */}
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#DCACB1] to-[#F6EAEB] opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {/* اطلاعات تماس */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#242424]">
                اطلاعات تماس
              </h2>
              <p className="mt-4 text-[#656565] leading-8">
                از طریق راه‌های زیر می‌توانید با ما در ارتباط باشید یا فرم را پر
                کنید تا با شما تماس بگیریم.
              </p>

              <dl className="mt-10 space-y-4">
                {contactItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex gap-4 rounded-2xl border border-[#F0F0F0] p-4 hover:border-[#DCACB1] hover:bg-[#FCF8F8] transition-colors"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F6EAEB] text-[#A72F3B]">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <dt className="text-sm font-medium text-[#898989]">
                        {item.label}
                      </dt>
                      <dd className="mt-1">
                        {item.href ? (
                          <a
                            href={item.href}
                            className={`text-[#242424] hover:text-[#A72F3B] transition-colors ${item.mono ? "font-mono" : ""}`}
                            dir={item.ltr ? "ltr" : undefined}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <span className="text-[#242424] leading-7">
                            {item.value}
                          </span>
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* فرم تماس */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
