import Image from "next/image";
import Link from "next/link";
import { HiCube } from "react-icons/hi2";
import { Product } from "@/types";

interface RelatedProductsProps {
  products: Product[];
}

const formatPrice = (price: number) =>
  price.toLocaleString("fa-IR") + " تومان";

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">محصولات مرتبط</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((item) => (
          <Link
            key={item.id}
            href={`/products/${item.slug}`}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition group"
          >
            {/* تصویر */}
            <div className="aspect-square relative bg-gray-50">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-contain p-3 group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <HiCube className="w-10 h-10 text-gray-300" />
                </div>
              )}

              {/* بج تخفیف */}
              {item.is_on_sale && (
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium">
                  {item.discount_percent}٪
                </span>
              )}

              {/* بج ناموجود */}
              {!item.is_in_stock && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span className="text-xs text-red-500 font-medium bg-white px-2 py-1 rounded-full border border-red-100">
                    ناموجود
                  </span>
                </div>
              )}
            </div>

            {/* اطلاعات */}
            <div className="p-3">
              {item.brand && (
                <p className="text-xs text-blue-600 mb-1">{item.brand}</p>
              )}
              <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 leading-snug">
                {item.title}
              </p>
              <div>
                {item.is_on_sale ? (
                  <>
                    <p className="text-sm font-bold text-blue-600">
                      {formatPrice(item.current_price)}
                    </p>
                    <p className="text-xs text-gray-400 line-through">
                      {formatPrice(item.price)}
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-bold text-gray-800">
                    {formatPrice(item.current_price)}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
