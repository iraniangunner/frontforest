import { Product } from "@/types";

interface AttributesTabProps {
  product: Product;
}

export default function AttributesTab({ product }: AttributesTabProps) {
  const staticSpecs = [
    { label: "برند",      value: product.brand },
    { label: "کد محصول", value: product.sku },
    { label: "وزن",       value: product.weight ? `${product.weight} گرم` : null },
    { label: "ابعاد",     value: product.dimensions },
    { label: "دسته‌بندی", value: product.category?.name },
  ].filter((r) => r.value);

  const dynamicAttrs = product.attributes || [];

  const allRows = [
    ...staticSpecs,
    ...dynamicAttrs.map((a) => ({ label: a.key, value: a.value })),
  ];

  if (allRows.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">مشخصاتی ثبت نشده است.</p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <tbody>
          {allRows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="px-4 py-3 text-gray-500 w-1/3 font-medium">
                {row.label}
              </td>
              <td className="px-4 py-3 text-gray-800">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
