// app/contact/page.tsx
import { HiMail, HiPhone} from "react-icons/hi";
import ContactForm from "@/app/_components/ui/ContactForm";

export const metadata = {
  title: "تماس با ما | نمایندگی انحصاری فانتوم پلاس در ایران",
  description: "با ما در ارتباط باشید - نمایندگی انحصاری فانتوم پلاس در ایران",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="bg-white" dir="rtl">
      {/* Hero */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20 mb-6">
              تماس با ما
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              با ما در ارتباط باشید
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              سوالی دارید؟ تیم پشتیبانی ما آماده پاسخگویی به شماست.
            </p>
          </div>
        </div>

        {/* Decorative blob */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-teal-200 to-emerald-200 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>

      {/* Contact Section */}
      <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {/* اطلاعات تماس */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              اطلاعات تماس
            </h2>
            <p className="mt-4 text-gray-600 leading-8">
              از طریق راه‌های زیر می‌توانید با ما در ارتباط باشید یا فرم را پر
              کنید تا با شما تماس بگیریم.
            </p>

            <dl className="mt-10 space-y-6">
              {/* ایمیل */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <HiMail className="w-6 h-6" />
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">ایمیل</dt>
                  <dd className="mt-1">
                    <a
                      href="mailto:info@petra.pmk-co.com"
                      className="text-gray-900 hover:text-teal-600 transition-colors"
                      dir="ltr"
                    >
                      info@petra.pmk-co.com
                    </a>
                  </dd>
                </div>
              </div>

              {/* تلفن */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <HiPhone className="w-6 h-6" />
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">تلفن</dt>
                  <dd className="mt-1">
                    <a
                      href="tel:+982122252875"
                      className="text-gray-900 hover:text-teal-600 transition-colors font-mono"
                      dir="ltr"
                    >
                      021-2225-2875
                    </a>
                  </dd>
                </div>
              </div>

              {/* آدرس */}
              {/* <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <HiLocationMarker className="w-6 h-6" />
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">آدرس</dt>
                  <dd className="mt-1 text-gray-900">تهران</dd>
                </div>
              </div> */}

              {/* ساعات کاری */}
              {/* <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  ساعات پاسخگویی
                </p>
                <p className="text-sm text-gray-600">
                  شنبه تا چهارشنبه — ۹ صبح تا ۵ عصر
                </p>
                <p className="text-sm text-gray-600">
                  پنجشنبه — ۹ صبح تا ۱ بعدازظهر
                </p>
              </div> */}
            </dl>
          </div>

          {/* فرم تماس */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
