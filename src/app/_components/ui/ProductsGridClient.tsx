// "use client";

// // app/products/_components/ProductsGridClient.tsx
// // این کامپوننت client wrapper هست چون ProductCard از hooks استفاده میکنه
// import ProductCard from "./ProductCard";
// import { Product } from "@/types";

// interface Props {
//   products: Product[];
//   view: "grid" | "list";
// }

// export default function ProductsGridClient({ products, view }: Props) {
//   if (!products.length) return null;

//   return (
//     <div
//       className={
//         view === "list"
//           ? "space-y-3"
//           : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4"
//       }
//     >
//       {products.map((product) => (
//         <ProductCard key={product.id} product={product} view={view} />
//       ))}
//     </div>
//   );
// }
