// app/components/[slug]/page.tsx
import { notFound } from "next/navigation";
import ComponentDetail from "@/app/_components/component-detail/ComponentDetail";

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

async function getComponentReviews(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/components/${slug}/reviews`,
      { cache: "no-store" } // مهم
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export default async function ComponentPage({ params }: Props) {
  const [component, relatedComponents, reviews] = await Promise.all([
    getComponent(params.slug),
    getRelatedComponents(params.slug),
    getComponentReviews(params.slug),
  ]);

  if (!component) {
    notFound();
  }

  return (
    <ComponentDetail
      component={component}
      relatedComponents={relatedComponents}
      reviews={reviews}
    />
  );
}
