import { HiCheck } from "react-icons/hi";

const FEATURES = [
  "کد تمیز و مستند",
  "ریسپانسیو",
  "پشتیبانی RTL",
  "بروزرسانی رایگان",
  "پشتیبانی ۶ ماهه",
];

export function FeaturesCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">ویژگی‌ها</h3>
      <div className="space-y-3">
        {FEATURES.map((feature) => (
          <div key={feature} className="flex items-center gap-3 text-gray-600">
            <HiCheck className="w-5 h-5 text-green-500" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}