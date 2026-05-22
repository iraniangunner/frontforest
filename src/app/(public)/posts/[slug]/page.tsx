import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import PostHero from "@/app/_components/posts/PostHero";
import PostMeta from "@/app/_components/posts/PostMeta";
import PostBody from "@/app/_components/posts/PostBody";
import PostComments from "@/app/_components/posts/PostComments";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`,
      {
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

async function getComments(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}/comments`,
      {
        next: { revalidate: 30 },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "مقاله | فانتوم پلاس" };

  return {
    title: `${post.title} | اخبار و مقالات`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: "article",
      locale: "fa_IR",
      images: post.thumbnail ? [{ url: post.thumbnail }] : [],
    },
    alternates: { canonical: `/posts/${slug}` },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const [post, comments] = await Promise.all([
    getPost(slug),
    getComments(slug),
  ]);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <PostHero title={post.title} thumbnail={post.thumbnail} />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <PostMeta
          author={post.author}
          publishedAt={post.published_at}
          views={post.views}
          commentsCount={comments.length}
        />

        <PostBody excerpt={post.excerpt} body={post.body} />

        {/* PostComments — client component چون فرم داره */}
        <PostComments slug={slug} comments={comments} />

        <div className="mt-8">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 transition group"
          >
            <HiArrowRight className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            بازگشت به اخبار
          </Link>
        </div>
      </div>
    </div>
  );
}
