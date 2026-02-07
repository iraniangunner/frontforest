"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiDownload, HiEye, HiArrowRight } from "react-icons/hi";
import { ordersAPI, publicComponentsAPI } from "@/lib/api";
import Pagination from "@/app/_components/ui/Pagination";
import toast from "react-hot-toast";

interface Purchase {
  id: number;
  component: {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    category: { name: string };
  };
  price: number;
  purchased_at: string;
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  useEffect(() => {
    loadPurchases();
  }, [meta.current_page]);

  const loadPurchases = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getPurchases({
        page: meta.current_page,
        per_page: 12,
      });
      setPurchases(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (slug: string, id: number) => {
    setDownloading(id);
    try {
      const response = await publicComponentsAPI.download(slug);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${slug}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("دانلود شروع شد");
    } catch (error) {
      toast.error("خطا در دانلود فایل");
    } finally {
      setDownloading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString() + " تومان";
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/profile"
            className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
          >
            <HiArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">خریدهای من</h1>
            <p className="text-gray-500">{meta.total} کامپوننت خریداری شده</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : purchases.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <HiDownload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              هنوز خریدی انجام نداده‌اید
            </h3>
            <p className="text-gray-500 mb-4">
              کامپوننت‌های خریداری شده اینجا نمایش داده می‌شوند
            </p>
            <Link
              href="/components"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              مشاهده کامپوننت‌ها
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="relative aspect-video">
                    {purchase.component.thumbnail ? (
                      <Image
                        src={purchase.component.thumbnail}
                        alt={purchase.component.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">بدون تصویر</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {purchase.component.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {purchase.component.category?.name}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>{formatDate(purchase.purchased_at)}</span>
                      <span>{formatPrice(purchase.price)}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(purchase.component.slug, purchase.id)}
                        disabled={downloading === purchase.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {downloading === purchase.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <HiDownload className="w-4 h-4" />
                        )}
                        دانلود
                      </button>
                      <Link
                        href={`/components/${purchase.component.slug}`}
                        className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        <HiEye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                // basePath="/profile/purchases"
                onPageChange={(page) => setMeta({ ...meta, current_page: page })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}