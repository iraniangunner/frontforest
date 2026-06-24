import { Product } from "@/types";
import { SwiperCarousel } from "../ui/SwiperCarousel";

interface RelatedProductsProps {
  products: Product[];
}


export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold text-[#242424] mb-4">محصولات مرتبط</h2>

      <SwiperCarousel products={products} />
    </div>
  );
}
