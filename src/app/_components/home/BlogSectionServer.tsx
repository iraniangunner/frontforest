import BlogSection from "./BlogSection";

const API = process.env.NEXT_PUBLIC_API_URL;

async function getPosts() {
  const res = await fetch(`${API}/posts?per_page=5&sort=newest`, {
    next: { revalidate: 60 },
  });

  return res.json();
}

export default async function BlogSectionServer() {
  const data = await getPosts();
  const posts = data?.data ?? [];

  if (!posts.length) return null;

  return <BlogSection posts={posts} />;
}
