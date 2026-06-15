// app/products/[slug]/[child]/page.tsx  ←  SERVER COMPONENT
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { publicCategoriesAPI } from "@/lib/api";
import CategoryProductsPage, { CategoryBreadcrumbJsonLd, CategoryData } from "@/app/_components/ui/CategoryProductsPage";


interface Props {
  params: Promise<{ slug: string; child: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// شکل آیتم‌های /categories/menu — بر اساس response واقعی بک‌اند
interface MenuCategory {
  id: number;
  parent_id: number | null;
  name: string;
  name_en?: string;
  slug: string;
  icon?: string | null;
  icon_image?: string | null;
  color?: string | null;
  image?: string | null;
  description: string | null;
  sort_order?: number;
  is_active?: boolean;
  is_featured?: boolean;
  products_count?: number;
  children?: {
    id: number;
    name: string;
    name_en?: string;
    slug: string;
    icon?: string | null;
    icon_image?: string | null;
    color?: string | null;
    image?: string | null;
    description?: string | null;
    products_count?: number;
  }[];
}

let menuCache: MenuCategory[] | null = null;

async function getMenu(): Promise<MenuCategory[]> {
  if (menuCache) return menuCache;
  try {
    const res = await publicCategoriesAPI.getMenu();
    menuCache = res.data?.data || [];
    return menuCache!;
  } catch {
    return [];
  }
}

function toCategoryData(cat: MenuCategory): CategoryData {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    products_count: cat.products_count,
    children: cat.children?.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      products_count: c.products_count,
    })),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, child } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const menu = await getMenu();
  const parentCategory = menu.find((c) => c.slug === slug);
  const childCategory = parentCategory?.children?.find(
    (c) => c.slug === child
  );

  if (!childCategory) return { title: "یافت نشد" };

  const title = `${childCategory.name} | فروشگاه`;
  const description =
    childCategory.description ||
    `خرید آنلاین محصولات ${childCategory.name} با گارانتی معتبر`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/products/${slug}/${child}` },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fa_IR",
    },
  };
}

export default async function ChildCategoryPage({
  params,
  searchParams,
}: Props) {
  const { slug, child } = await params;
  const sp = await searchParams;

  const menu = await getMenu();
  const parentCategory = menu.find((c) => c.slug === slug);
  if (!parentCategory) notFound();

  const childCategory = parentCategory.children?.find(
    (c) => c.slug === child
  );
  if (!childCategory) notFound();

  const parentData = toCategoryData(parentCategory);
  const childData: CategoryData = {
    id: childCategory.id,
    name: childCategory.name,
    slug: childCategory.slug,
    description: childCategory.description,
    products_count: childCategory.products_count,
    // child خودش children ندارد
  };

  return (
    <>
      <CategoryBreadcrumbJsonLd category={childData} parent={parentData} />
      <CategoryProductsPage
        category={childData}
        parentCategory={parentData}
        searchParams={sp}
        basePath={`/products/${slug}/${child}`}
      />
    </>
  );
}
