// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { publicComponentsAPI } from "@/lib/api";
// import { Component } from "@/types";
// import toast from "react-hot-toast";

// import {
//   Breadcrumb,
//   ImageGallery,
//   ComponentInfo,
//   ActionButtons,
//   FileInfoCard,
//   TagsCard,
//   FeaturesCard,
//   ReviewsSection,
//   RelatedComponents,
// } from "@/app/_components/component-detail"

// interface Review {
//   id: number;
//   rating: number;
//   comment: string | null;
//   user: { id: number; name: string };
//   created_at: string;
// }

// export default function ComponentDetailPage() {
//   const params = useParams();
//   const slug = params.slug as string;

//   const [component, setComponent] = useState<Component | null>(null);
//   const [relatedComponents, setRelatedComponents] = useState<Component[]>([]);
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

//   useEffect(() => {
//     if (slug) {
//       loadComponent();
//     }
//   }, [slug]);

//   const loadComponent = async () => {
//     setLoading(true);
//     try {
//       const [componentRes, relatedRes] = await Promise.all([
//         publicComponentsAPI.getBySlug(slug),
//         publicComponentsAPI.getRelated(slug),
//       ]);

//       setComponent(componentRes.data.data);
//       setRelatedComponents(relatedRes.data.data);
//       loadReviews();
//     } catch (error) {
//       console.error("Error loading component:", error);
//       toast.error("خطا در دریافت اطلاعات");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadReviews = async () => {
//     try {
//       const response = await publicComponentsAPI.getReviews(slug);
//       setReviews(response.data.data);
//     } catch (error) {
//       console.error("Error loading reviews:", error);
//     }
//   };

//   // Loading State
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   // Not Found
//   if (!component) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">یافت نشد</h1>
//           <p className="text-gray-500 mb-4">کامپوننت مورد نظر پیدا نشد</p>
//           <Link
//             href="/components"
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             بازگشت به لیست
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50" dir="rtl">
//       {/* Breadcrumb */}
//       <Breadcrumb component={component} />

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Images */}
//           <div className="lg:col-span-2 space-y-4">
//             <ImageGallery component={component} />

//             {/* Tabs */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="flex border-b border-gray-100">
//                 <button
//                   onClick={() => setActiveTab("description")}
//                   className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
//                     activeTab === "description"
//                       ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   توضیحات
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("reviews")}
//                   className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
//                     activeTab === "reviews"
//                       ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   نظرات ({component.reviews_count})
//                 </button>
//               </div>

//               <div className="p-6">
//                 {activeTab === "description" ? (
//                   <div className="prose prose-gray max-w-none">
//                     {component.description ? (
//                       <div
//                         dangerouslySetInnerHTML={{ __html: component.description }}
//                       />
//                     ) : component.short_description ? (
//                       <p>{component.short_description}</p>
//                     ) : (
//                       <p className="text-gray-500">توضیحاتی ثبت نشده است.</p>
//                     )}
//                   </div>
//                 ) : (
//                   <ReviewsSection
//                     reviews={reviews}
//                     componentSlug={slug}
//                     onReviewAdded={loadReviews}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Info & Actions */}
//           <div className="space-y-6">
//             {/* Main Info Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//               <ComponentInfo component={component} />
//               <ActionButtons
//                 component={component}
//                 // initialIsFavorite={component.is_favorited || false}
//               />
//             </div>

//             <FileInfoCard component={component} />
//             <TagsCard component={component} />
//             <FeaturesCard />
//           </div>
//         </div>

//         {/* Related Components */}
//         <RelatedComponents
//           components={relatedComponents}
//           categorySlug={component.category.slug}
//         />
//       </div>
//     </div>
//   );
// }

// app/components/[slug]/page.tsx

import { notFound } from "next/navigation";
import { componentsAPI } from "@/lib/api";
import ComponentDetail from "@/app/_components/ComponentDetail";

interface Props {
  params: { slug: string };
}

async function getComponent(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/components/${slug}`,
      { next: { revalidate: 60 } }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    return null;
  }
}

async function getRelatedComponents(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/components/${slug}/related?per_page=4`,
      { next: { revalidate: 60 } }
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
}

export default async function ComponentPage({ params }: Props) {
  const [component, relatedComponents] = await Promise.all([
    getComponent(params.slug),
    getRelatedComponents(params.slug),
  ]);

  if (!component) {
    notFound();
  }

  return (
    <ComponentDetail 
      component={component} 
      relatedComponents={relatedComponents} 
    />
  );
}