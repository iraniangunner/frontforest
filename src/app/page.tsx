// app/page.tsx

import {
  HeroSection,
  ComponentsSection,
  FeaturesSection,
  CTASection,
} from "./_components/home";



// Server-side data fetching
async function getHomeData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const [featuredRes, newestRes, freeRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/components/featured?per_page=4`, {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }),
      fetch(`${baseUrl}/components/newest?per_page=8`, {
        next: { revalidate: 60 },
      }),
      fetch(`${baseUrl}/components/free?per_page=4`, {
        next: { revalidate: 60 },
      }),
      fetch(`${baseUrl}/categories`, {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }),
    ]);

    const [featured, newest, free, categories] = await Promise.all([
      featuredRes.json(),
      newestRes.json(),
      freeRes.json(),
      categoriesRes.json(),
    ]);

    return {
      featuredComponents: featured.data || [],
      newestComponents: newest.data || [],
      freeComponents: free.data || [],
      categories: categories.data || [],
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return {
      featuredComponents: [],
      newestComponents: [],
      freeComponents: [],
      categories: [],
    };
  }
}

export default async function HomePage() {
  const { featuredComponents, newestComponents, freeComponents, categories } =
    await getHomeData();

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white"
      dir="rtl"
    >
      <HeroSection />

      {/* <StatsSection /> */}

      {/* {categories.length > 0 && <CategoriesSection categories={categories} />} */}

   
  

      <FeaturesSection />

      <CTASection />
    </div>
  );
}
