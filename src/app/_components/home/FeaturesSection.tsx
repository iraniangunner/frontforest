// components/home/FeaturesSection.tsx
import {
  HiTruck,
  HiShieldCheck,
  HiCreditCard,
  HiSupport,
  HiRefresh,
  HiLocationMarker,
} from "react-icons/hi";

const features = [
  {
    icon: HiTruck,
    title: "ارسال سریع",
    description:
      "ارسال به سراسر کشور با پست پیشتاز و تیپاکس در کمترین زمان ممکن",
    color: "bg-blue-500",
  },
  {
    icon: HiShieldCheck,
    title: "ضمانت اصالت کالا",
    description: "تمامی محصولات دارای ضمانت اصالت و گارانتی معتبر هستند",
    color: "bg-green-500",
  },
  {
    icon: HiCreditCard,
    title: "پرداخت امن",
    description: "پرداخت آنلاین امن از طریق درگاه زرین‌پال و کارت به کارت",
    color: "bg-purple-500",
  },
  {
    icon: HiSupport,
    title: "پشتیبانی ۲۴ ساعته",
    description:
      "تیم پشتیبانی ما آماده پاسخگویی به سوالات شما در تمام ساعات است",
    color: "bg-yellow-500",
  },
  {
    icon: HiRefresh,
    title: "۷ روز ضمانت بازگشت",
    description:
      "در صورت عدم رضایت، تا ۷ روز پس از دریافت کالا امکان مرجوعی دارید",
    color: "bg-red-500",
  },
  {
    icon: HiLocationMarker,
    title: "رهگیری آنلاین سفارش",
    description: "وضعیت سفارش خود را در هر لحظه از طریق پنل کاربری پیگیری کنید",
    color: "bg-indigo-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            چرا از ما خرید کنید؟
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-2xl transition-all duration-300"
            >
              <div
                className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
