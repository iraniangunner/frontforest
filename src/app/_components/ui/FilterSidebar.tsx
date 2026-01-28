// "use client";

// import { useState } from "react";
// import {
//   HiChevronDown,
//   HiX,
//   HiCheck,
//   HiSparkles,
//   HiTag,
//   HiCurrencyDollar,
//   HiStar,
//   HiCollection,
//   HiCode,
//   HiColorSwatch,
//   HiLightningBolt,
//   HiFilter,
//   HiTrash,
// } from "react-icons/hi";
// import { Category, Tag, FilterParams } from "@/types";

// interface FilterSidebarProps {
//   categories: Category[];
//   tags: {
//     frameworks: Tag[];
//     styling: Tag[];
//     features: Tag[];
//   };
//   filters: FilterParams;
//   onFilterChange: (filters: FilterParams) => void;
//   onClose?: () => void;
//   isMobile?: boolean;
// }

// export default function FilterSidebar({
//   categories,
//   tags,
//   filters,
//   onFilterChange,
//   onClose,
//   isMobile = false,
// }: FilterSidebarProps) {
//   const [expandedSections, setExpandedSections] = useState<string[]>([
//     "categories",
//     "frameworks",
//     "styling",
//     "features",
//     "price",
//     "rating",
//   ]);

//   const toggleSection = (section: string) => {
//     setExpandedSections((prev) =>
//       prev.includes(section)
//         ? prev.filter((s) => s !== section)
//         : [...prev, section]
//     );
//   };

//   const handleCategoryToggle = (slug: string) => {
//     const current = filters.categories || [];
//     const updated = current.includes(slug)
//       ? current.filter((s) => s !== slug)
//       : [...current, slug];
//     onFilterChange({ ...filters, categories: updated, page: 1 });
//   };

//   const handleTagToggle = (
//     type: "frameworks" | "stylings" | "features",
//     slug: string
//   ) => {
//     const current = filters[type] || [];
//     const updated = current.includes(slug)
//       ? current.filter((s) => s !== slug)
//       : [...current, slug];
//     onFilterChange({ ...filters, [type]: updated, page: 1 });
//   };

//   const handlePriceChange = (
//     field: "min_price" | "max_price",
//     value: string
//   ) => {
//     const numValue = value ? parseInt(value) : undefined;
//     onFilterChange({ ...filters, [field]: numValue, page: 1 });
//   };

//   const handleBooleanToggle = (field: "free" | "featured" | "on_sale") => {
//     onFilterChange({
//       ...filters,
//       [field]: filters[field] ? undefined : true,
//       page: 1,
//     });
//   };

//   const handleRatingChange = (rating: number) => {
//     onFilterChange({
//       ...filters,
//       min_rating: filters.min_rating === rating ? undefined : rating,
//       page: 1,
//     });
//   };

//   const clearAllFilters = () => {
//     onFilterChange({ page: 1, per_page: filters.per_page });
//   };

//   const hasActiveFilters = () => {
//     return (
//       (filters.categories && filters.categories.length > 0) ||
//       (filters.frameworks && filters.frameworks.length > 0) ||
//       (filters.stylings && filters.stylings.length > 0) ||
//       (filters.features && filters.features.length > 0) ||
//       filters.free ||
//       filters.featured ||
//       filters.on_sale ||
//       filters.min_price ||
//       filters.max_price ||
//       filters.min_rating
//     );
//   };

//   const getActiveFiltersCount = () => {
//     let count = 0;
//     if (filters.categories) count += filters.categories.length;
//     if (filters.frameworks) count += filters.frameworks.length;
//     if (filters.stylings) count += filters.stylings.length;
//     if (filters.features) count += filters.features.length;
//     if (filters.free) count++;
//     if (filters.featured) count++;
//     if (filters.on_sale) count++;
//     if (filters.min_price || filters.max_price) count++;
//     if (filters.min_rating) count++;
//     return count;
//   };

//   const sectionIcons: Record<string, React.ElementType> = {
//     categories: HiCollection,
//     frameworks: HiCode,
//     styling: HiColorSwatch,
//     features: HiLightningBolt,
//     price: HiCurrencyDollar,
//     rating: HiStar,
//   };

//   const SectionHeader = ({
//     title,
//     section,
//     count,
//   }: {
//     title: string;
//     section: string;
//     count?: number;
//   }) => {
//     const Icon = sectionIcons[section];
//     const isExpanded = expandedSections.includes(section);

//     return (
//       <button
//         type="button"
//         onClick={() => toggleSection(section)}
//         className="flex items-center justify-between w-full py-3.5 group"
//       >
//         <div className="flex items-center gap-2.5">
//           {Icon && (
//             <div
//               className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
//                 isExpanded
//                   ? "bg-gradient-to-br from-teal-500 to-emerald-500 shadow-md shadow-emerald-500/20"
//                   : "bg-gray-100 group-hover:bg-gray-200"
//               }`}
//             >
//               <Icon
//                 className={`w-4 h-4 transition-colors ${
//                   isExpanded ? "text-white" : "text-gray-500"
//                 }`}
//               />
//             </div>
//           )}
//           <span className="font-semibold text-gray-900">{title}</span>
//           {count !== undefined && count > 0 && (
//             <span className="px-2 py-0.5 text-xs font-bold bg-teal-100 text-teal-700 rounded-full">
//               {count}
//             </span>
//           )}
//         </div>
//         <div
//           className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
//             isExpanded ? "bg-gray-100 rotate-180" : "bg-gray-50"
//           }`}
//         >
//           <HiChevronDown className="w-4 h-4 text-gray-400" />
//         </div>
//       </button>
//     );
//   };

//   const CheckboxItem = ({
//     label,
//     checked,
//     onClick,
//     count,
//     color,
//   }: {
//     label: string;
//     checked: boolean;
//     onClick: () => void;
//     count?: number;
//     color?: string;
//   }) => (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer group w-full text-right transition-all duration-200 ${
//         checked
//           ? "bg-teal-50 border border-teal-200"
//           : "hover:bg-gray-50 border border-transparent"
//       }`}
//     >
//       <div
//         className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
//           checked
//             ? "bg-gradient-to-br from-teal-500 to-emerald-500 shadow-md shadow-emerald-500/30"
//             : "border-2 border-gray-300 group-hover:border-teal-400 group-hover:bg-teal-50"
//         }`}
//       >
//         {checked && <HiCheck className="w-3.5 h-3.5 text-white" />}
//       </div>
//       <span
//         className={`flex-1 flex items-center gap-2 transition-colors ${
//           checked
//             ? "text-teal-700 font-medium"
//             : "text-gray-600 group-hover:text-gray-900"
//         }`}
//       >
//         {color && (
//           <span
//             className="inline-block w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-white shadow-sm"
//             style={{ backgroundColor: color }}
//           />
//         )}
//         {label}
//       </span>
//       {count !== undefined && (
//         <span
//           className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
//             checked ? "bg-teal-200/50 text-teal-700" : "bg-gray-100 text-gray-400"
//           }`}
//         >
//           {count}
//         </span>
//       )}
//     </button>
//   );

//   const QuickFilterButton = ({
//     label,
//     icon: Icon,
//     active,
//     onClick,
//     activeColor,
//   }: {
//     label: string;
//     icon: React.ElementType;
//     active: boolean;
//     onClick: () => void;
//     activeColor: string;
//   }) => (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
//         active
//           ? `${activeColor} shadow-md hover:shadow-lg transform hover:-translate-y-0.5`
//           : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
//       }`}
//     >
//       <Icon className="w-4 h-4" />
//       {label}
//     </button>
//   );

//   return (
//     <div
//       className={`bg-white ${
//         isMobile
//           ? "h-full overflow-y-auto"
//           : "rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100"
//       }`}
//       dir="rtl"
//     >
//       {/* Header */}
//       <div
//         className={`sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 ${
//           isMobile ? "px-5 py-4" : "px-5 py-4 rounded-t-2xl"
//         }`}
//       >
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
//               <HiFilter className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h3 className="font-bold text-gray-900">فیلترها</h3>
//               {hasActiveFilters() && (
//                 <p className="text-xs text-gray-500">
//                   {getActiveFiltersCount()} فیلتر فعال
//                 </p>
//               )}
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             {hasActiveFilters() && (
//               <button
//                 type="button"
//                 onClick={clearAllFilters}
//                 className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
//               >
//                 <HiTrash className="w-4 h-4" />
//                 <span className="hidden sm:inline">پاک کردن</span>
//               </button>
//             )}
//             {isMobile && onClose && (
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
//               >
//                 <HiX className="w-5 h-5" />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="p-5 space-y-2">
//         {/* Quick Filters */}
//         <div className="pb-5 border-b border-gray-100">
//           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
//             فیلتر سریع
//           </p>
//           <div className="flex flex-wrap gap-2">
//             <QuickFilterButton
//               label="رایگان"
//               icon={HiTag}
//               active={!!filters.free}
//               onClick={() => handleBooleanToggle("free")}
//               activeColor="bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/30"
//             />
//             <QuickFilterButton
//               label="تخفیف‌دار"
//               icon={HiCurrencyDollar}
//               active={!!filters.on_sale}
//               onClick={() => handleBooleanToggle("on_sale")}
//               activeColor="bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/30"
//             />
//             <QuickFilterButton
//               label="ویژه"
//               icon={HiSparkles}
//               active={!!filters.featured}
//               onClick={() => handleBooleanToggle("featured")}
//               activeColor="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30"
//             />
//           </div>
//         </div>

//         {/* Categories */}
//         <div className="border-b border-gray-100">
//           <SectionHeader
//             title="دسته‌بندی"
//             section="categories"
//             count={filters.categories?.length}
//           />
//           <div
//             className={`overflow-hidden transition-all duration-300 ease-out ${
//               expandedSections.includes("categories")
//                 ? "max-h-[500px] opacity-100"
//                 : "max-h-0 opacity-0"
//             }`}
//           >
//             <div className="pb-4 space-y-1 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
//               {categories.map((category) => (
//                 <div key={category.id} className="mb-3">
//                   {/* Parent Category */}
//                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
//                     {category.name}
//                   </p>
//                   {/* Children */}
//                   <div className="space-y-1">
//                     {category.children?.map((child) => (
//                       <CheckboxItem
//                         key={child.id}
//                         label={child.name}
//                         checked={
//                           filters.categories?.includes(child.slug) || false
//                         }
//                         onClick={() => handleCategoryToggle(child.slug)}
//                         count={child.components_count}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Frameworks */}
//         <div className="border-b border-gray-100">
//           <SectionHeader
//             title="فریم‌ورک"
//             section="frameworks"
//             count={filters.frameworks?.length}
//           />
//           <div
//             className={`overflow-hidden transition-all duration-300 ease-out ${
//               expandedSections.includes("frameworks")
//                 ? "max-h-[400px] opacity-100"
//                 : "max-h-0 opacity-0"
//             }`}
//           >
//             <div className="pb-4 space-y-1">
//               {tags.frameworks.map((tag) => (
//                 <CheckboxItem
//                   key={tag.id}
//                   label={tag.name}
//                   checked={filters.frameworks?.includes(tag.slug) || false}
//                   onClick={() => handleTagToggle("frameworks", tag.slug)}
//                   color={tag.color}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Styling */}
//         <div className="border-b border-gray-100">
//           <SectionHeader
//             title="استایل"
//             section="styling"
//             count={filters.stylings?.length}
//           />
//           <div
//             className={`overflow-hidden transition-all duration-300 ease-out ${
//               expandedSections.includes("styling")
//                 ? "max-h-[400px] opacity-100"
//                 : "max-h-0 opacity-0"
//             }`}
//           >
//             <div className="pb-4 space-y-1">
//               {tags.styling.map((tag) => (
//                 <CheckboxItem
//                   key={tag.id}
//                   label={tag.name}
//                   checked={filters.stylings?.includes(tag.slug) || false}
//                   onClick={() => handleTagToggle("stylings", tag.slug)}
//                   color={tag.color}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Features */}
//         <div className="border-b border-gray-100">
//           <SectionHeader
//             title="ویژگی‌ها"
//             section="features"
//             count={filters.features?.length}
//           />
//           <div
//             className={`overflow-hidden transition-all duration-300 ease-out ${
//               expandedSections.includes("features")
//                 ? "max-h-[400px] opacity-100"
//                 : "max-h-0 opacity-0"
//             }`}
//           >
//             <div className="pb-4 space-y-1">
//               {tags.features.map((tag) => (
//                 <CheckboxItem
//                   key={tag.id}
//                   label={tag.name}
//                   checked={filters.features?.includes(tag.slug) || false}
//                   onClick={() => handleTagToggle("features", tag.slug)}
//                   color={tag.color}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Price Range */}
//         {/* <div className="border-b border-gray-100">
//           <SectionHeader
//             title="محدوده قیمت"
//             section="price"
//             count={filters.min_price || filters.max_price ? 1 : undefined}
//           />
//           <div
//             className={`overflow-hidden transition-all duration-300 ease-out ${
//               expandedSections.includes("price")
//                 ? "max-h-[200px] opacity-100"
//                 : "max-h-0 opacity-0"
//             }`}
//           >
//             <div className="pb-4">
//               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
//                 <div className="flex-1 relative">
//                   <input
//                     type="number"
//                     placeholder="از"
//                     value={filters.min_price || ""}
//                     onChange={(e) =>
//                       handlePriceChange("min_price", e.target.value)
//                     }
//                     className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
//                   />
//                 </div>
//                 <div className="w-8 h-0.5 bg-gray-300 rounded-full flex-shrink-0" />
//                 <div className="flex-1 relative">
//                   <input
//                     type="number"
//                     placeholder="تا"
//                     value={filters.max_price || ""}
//                     onChange={(e) =>
//                       handlePriceChange("max_price", e.target.value)
//                     }
//                     className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
//                   />
//                 </div>
//               </div>
//               <p className="text-xs text-gray-400 mt-2 px-1 flex items-center gap-1">
//                 <HiCurrencyDollar className="w-3.5 h-3.5" />
//                 قیمت به تومان
//               </p>
//             </div>
//           </div>
//         </div> */}

//         {/* Rating */}
//         <div>
//           <SectionHeader
//             title="حداقل امتیاز"
//             section="rating"
//             count={filters.min_rating ? 1 : undefined}
//           />
//           <div
//             className={`overflow-hidden transition-all duration-300 ease-out ${
//               expandedSections.includes("rating")
//                 ? "max-h-[100px] opacity-100"
//                 : "max-h-0 opacity-0"
//             }`}
//           >
//             <div className="pb-4">
//               <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
//                 {[4, 3, 2, 1].map((rating) => (
//                   <button
//                     type="button"
//                     key={rating}
//                     onClick={() => handleRatingChange(rating)}
//                     className={`flex-1 flex items-center justify-center gap-1.5 px-1 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
//                       filters.min_rating === rating
//                         ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 shadow-lg shadow-amber-500/25 transform scale-105"
//                         : "bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-700 border border-gray-200"
//                     }`}
//                   >
//                     <span>{rating}+</span>
//                     <HiStar
//                       className={`w-4 h-4 ${
//                         filters.min_rating === rating
//                           ? "text-amber-900"
//                           : "text-amber-400"
//                       }`}
//                     />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Apply Button */}
//       {isMobile && (
//         <div className="sticky bottom-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-100">
//           <button
//             type="button"
//             onClick={onClose}
//             className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center gap-2"
//           >
//             <HiCheck className="w-5 h-5" />
//             اعمال فیلترها
//             {hasActiveFilters() && (
//               <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
//                 {getActiveFiltersCount()}
//               </span>
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  HiChevronDown,
  HiX,
  HiCheck,
  HiSparkles,
  HiTag,
  HiCurrencyDollar,
  HiStar,
  HiCollection,
  HiCode,
  HiColorSwatch,
  HiLightningBolt,
  HiFilter,
  HiTrash,
} from "react-icons/hi";
import { Category, Tag } from "@/types";

interface FilterSidebarProps {
  categories: Category[];
  tags: {
    frameworks: Tag[];
    styling: Tag[];
    features: Tag[];
  };
  onClose?: () => void;
  isMobile?: boolean;
}

export default function FilterSidebar({
  categories,
  tags,
  onClose,
  isMobile = false,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "categories",
    "frameworks",
    "styling",
    "features",
    "price",
    "rating",
  ]);

  // Get current filters from URL
  const getFiltersFromUrl = () => {
    return {
      categories: searchParams.getAll("categories[]"),
      frameworks: searchParams.getAll("frameworks[]"),
      stylings: searchParams.getAll("stylings[]"),
      features: searchParams.getAll("features[]"),
      free: searchParams.get("free") === "1",
      featured: searchParams.get("featured") === "1",
      on_sale: searchParams.get("on_sale") === "1",
      min_price: searchParams.get("min_price"),
      max_price: searchParams.get("max_price"),
      min_rating: searchParams.get("min_rating"),
    };
  };

  const filters = getFiltersFromUrl();

  // Update URL with new params
  const updateUrl = (updates: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset page when filters change
    params.delete("page");

    Object.entries(updates).forEach(([key, value]) => {
      // Remove existing values for array params
      if (key.endsWith("[]")) {
        const existingValues = params.getAll(key);
        existingValues.forEach(() => params.delete(key));
      }

      if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `/components?${queryString}` : "/components", {
      scroll: false,
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleCategoryToggle = (slug: string) => {
    const current = filters.categories;
    const updated = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    updateUrl({ "categories[]": updated });
  };

  const handleTagToggle = (
    type: "frameworks" | "stylings" | "features",
    slug: string
  ) => {
    const key = type as keyof typeof filters;
    const current = filters[key] as string[];
    const updated = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    updateUrl({ [`${type}[]`]: updated });
  };

  const handlePriceChange = (
    field: "min_price" | "max_price",
    value: string
  ) => {
    updateUrl({ [field]: value || null });
  };

  const handleBooleanToggle = (field: "free" | "featured" | "on_sale") => {
    const current = filters[field];
    updateUrl({ [field]: current ? null : "1" });
  };

  const handleRatingChange = (rating: number) => {
    const current = filters.min_rating;
    updateUrl({ min_rating: current === String(rating) ? null : String(rating) });
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    const perPage = searchParams.get("per_page");
    if (perPage) params.set("per_page", perPage);
    
    const queryString = params.toString();
    router.push(queryString ? `/components?${queryString}` : "/components", {
      scroll: false,
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.categories.length > 0 ||
      filters.frameworks.length > 0 ||
      filters.stylings.length > 0 ||
      filters.features.length > 0 ||
      filters.free ||
      filters.featured ||
      filters.on_sale ||
      filters.min_price ||
      filters.max_price ||
      filters.min_rating
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    count += filters.categories.length;
    count += filters.frameworks.length;
    count += filters.stylings.length;
    count += filters.features.length;
    if (filters.free) count++;
    if (filters.featured) count++;
    if (filters.on_sale) count++;
    if (filters.min_price || filters.max_price) count++;
    if (filters.min_rating) count++;
    return count;
  };

  const sectionIcons: Record<string, React.ElementType> = {
    categories: HiCollection,
    frameworks: HiCode,
    styling: HiColorSwatch,
    features: HiLightningBolt,
    price: HiCurrencyDollar,
    rating: HiStar,
  };

  const SectionHeader = ({
    title,
    section,
    count,
  }: {
    title: string;
    section: string;
    count?: number;
  }) => {
    const Icon = sectionIcons[section];
    const isExpanded = expandedSections.includes(section);

    return (
      <button
        type="button"
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full py-3.5 group"
      >
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                isExpanded
                  ? "bg-gradient-to-br from-teal-500 to-emerald-500 shadow-md shadow-emerald-500/20"
                  : "bg-gray-100 group-hover:bg-gray-200"
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isExpanded ? "text-white" : "text-gray-500"
                }`}
              />
            </div>
          )}
          <span className="font-semibold text-gray-900">{title}</span>
          {count !== undefined && count > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold bg-teal-100 text-teal-700 rounded-full">
              {count}
            </span>
          )}
        </div>
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
            isExpanded ? "bg-gray-100 rotate-180" : "bg-gray-50"
          }`}
        >
          <HiChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </button>
    );
  };

  const CheckboxItem = ({
    label,
    checked,
    onClick,
    count,
    color,
  }: {
    label: string;
    checked: boolean;
    onClick: () => void;
    count?: number;
    color?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer group w-full text-right transition-all duration-200 ${
        checked
          ? "bg-teal-50 border border-teal-200"
          : "hover:bg-gray-50 border border-transparent"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
          checked
            ? "bg-gradient-to-br from-teal-500 to-emerald-500 shadow-md shadow-emerald-500/30"
            : "border-2 border-gray-300 group-hover:border-teal-400 group-hover:bg-teal-50"
        }`}
      >
        {checked && <HiCheck className="w-3.5 h-3.5 text-white" />}
      </div>
      <span
        className={`flex-1 flex items-center gap-2 transition-colors ${
          checked
            ? "text-teal-700 font-medium"
            : "text-gray-600 group-hover:text-gray-900"
        }`}
      >
        {color && (
          <span
            className="inline-block w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-white shadow-sm"
            style={{ backgroundColor: color }}
          />
        )}
        {label}
      </span>
      {count !== undefined && (
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
            checked ? "bg-teal-200/50 text-teal-700" : "bg-gray-100 text-gray-400"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );

  const QuickFilterButton = ({
    label,
    icon: Icon,
    active,
    onClick,
    activeColor,
  }: {
    label: string;
    icon: React.ElementType;
    active: boolean;
    onClick: () => void;
    activeColor: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
        active
          ? `${activeColor} shadow-md hover:shadow-lg transform hover:-translate-y-0.5`
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div
      className={`bg-white ${
        isMobile
          ? "h-full overflow-y-auto"
          : "rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100"
      }`}
      dir="rtl"
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 ${
          isMobile ? "px-5 py-4" : "px-5 py-4 rounded-t-2xl"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <HiFilter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">فیلترها</h3>
              {hasActiveFilters() && (
                <p className="text-xs text-gray-500">
                  {getActiveFiltersCount()} فیلتر فعال
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters() && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <HiTrash className="w-4 h-4" />
                <span className="hidden sm:inline">پاک کردن</span>
              </button>
            )}
            {isMobile && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <HiX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-2">
        {/* Quick Filters */}
        <div className="pb-5 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            فیلتر سریع
          </p>
          <div className="flex flex-wrap gap-2">
            <QuickFilterButton
              label="رایگان"
              icon={HiTag}
              active={filters.free}
              onClick={() => handleBooleanToggle("free")}
              activeColor="bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/30"
            />
            <QuickFilterButton
              label="تخفیف‌دار"
              icon={HiCurrencyDollar}
              active={filters.on_sale}
              onClick={() => handleBooleanToggle("on_sale")}
              activeColor="bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/30"
            />
            <QuickFilterButton
              label="ویژه"
              icon={HiSparkles}
              active={filters.featured}
              onClick={() => handleBooleanToggle("featured")}
              activeColor="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="border-b border-gray-100">
          <SectionHeader
            title="دسته‌بندی"
            section="categories"
            count={filters.categories.length}
          />
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              expandedSections.includes("categories")
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pb-4 space-y-1 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {categories.map((category) => (
                <div key={category.id} className="mb-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
                    {category.name}
                  </p>
                  <div className="space-y-1">
                    {category.children?.map((child) => (
                      <CheckboxItem
                        key={child.id}
                        label={child.name}
                        checked={filters.categories.includes(child.slug)}
                        onClick={() => handleCategoryToggle(child.slug)}
                        count={child.components_count}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Frameworks */}
        <div className="border-b border-gray-100">
          <SectionHeader
            title="فریم‌ورک"
            section="frameworks"
            count={filters.frameworks.length}
          />
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              expandedSections.includes("frameworks")
                ? "max-h-[400px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pb-4 space-y-1">
              {tags.frameworks.map((tag) => (
                <CheckboxItem
                  key={tag.id}
                  label={tag.name}
                  checked={filters.frameworks.includes(tag.slug)}
                  onClick={() => handleTagToggle("frameworks", tag.slug)}
                  color={tag.color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Styling */}
        <div className="border-b border-gray-100">
          <SectionHeader
            title="استایل"
            section="styling"
            count={filters.stylings.length}
          />
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              expandedSections.includes("styling")
                ? "max-h-[400px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pb-4 space-y-1">
              {tags.styling.map((tag) => (
                <CheckboxItem
                  key={tag.id}
                  label={tag.name}
                  checked={filters.stylings.includes(tag.slug)}
                  onClick={() => handleTagToggle("stylings", tag.slug)}
                  color={tag.color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="border-b border-gray-100">
          <SectionHeader
            title="ویژگی‌ها"
            section="features"
            count={filters.features.length}
          />
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              expandedSections.includes("features")
                ? "max-h-[400px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pb-4 space-y-1">
              {tags.features.map((tag) => (
                <CheckboxItem
                  key={tag.id}
                  label={tag.name}
                  checked={filters.features.includes(tag.slug)}
                  onClick={() => handleTagToggle("features", tag.slug)}
                  color={tag.color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div>
          <SectionHeader
            title="حداقل امتیاز"
            section="rating"
            count={filters.min_rating ? 1 : undefined}
          />
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              expandedSections.includes("rating")
                ? "max-h-[100px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pb-4">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                {[4, 3, 2, 1].map((rating) => (
                  <button
                    type="button"
                    key={rating}
                    onClick={() => handleRatingChange(rating)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-1 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      filters.min_rating === String(rating)
                        ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 shadow-lg shadow-amber-500/25 transform scale-105"
                        : "bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-700 border border-gray-200"
                    }`}
                  >
                    <span>{rating}+</span>
                    <HiStar
                      className={`w-4 h-4 ${
                        filters.min_rating === String(rating)
                          ? "text-amber-900"
                          : "text-amber-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Apply Button */}
      {isMobile && (
        <div className="sticky bottom-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <HiCheck className="w-5 h-5" />
            اعمال فیلترها
            {hasActiveFilters() && (
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}