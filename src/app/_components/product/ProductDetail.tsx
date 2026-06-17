import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import { Product, Review } from "@/types";
import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import RelatedProducts from "./RelatedProducts";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
  reviews: Review[];
}

export default function ProductDetail({
  product,
  relatedProducts,
  reviews,
}: ProductDetailProps) {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-teal-600 transition">
            خانه
          </Link>
          <HiChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
          {product.category?.parent && (
            <Link
              href={`/products/${product.category.parent.slug}`}
              className="hover:text-teal-600 transition"
            >
              {product.category.parent.name}
            </Link>
          )}

          {product.category?.parent && (
            <>
              <HiChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
              <Link
                href={`/products/${product.category.parent.slug}/${product.category.slug}`}
                className="hover:text-teal-600 transition"
              >
                {product.category.name}
              </Link>
            </>
          )}

          <HiChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-gray-800 font-medium truncate max-w-[200px]">
            {product.title}
          </span>
        </nav>

        {/* ردیف اصلی: گالری + اطلاعات */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ImageGallery
            thumbnail={product.thumbnail}
            images={product.images}
            title={product.title}
          />
          <ProductInfo product={product} />
        </div>

        {/* تب‌ها */}
        <div className="mb-8">
          <ProductTabs product={product} reviews={reviews} />
        </div>

        {/* محصولات مرتبط */}
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}
