import Image from "next/image";
import Link from "next/link";
import { HiCube } from "react-icons/hi2";
import { Product } from "@/types";
import { SwiperCarousel } from "../ui/SwiperCarousel";

interface RelatedProductsProps {
  products: Product[];
}

const formatPrice = (price: number) => price.toLocaleString("fa-IR") + " تومان";

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">محصولات مرتبط</h2>

      <SwiperCarousel products={products} />
    </div>
  );
}
